const {promises} = require("dns");
const {sql, getConnection} = require("../config/db");

const clienteModel = {
    /**
     * buscar todos os clientes no banco de dados.
     * 
     * @async
     * @function buscarTodos
     * @returns {promise<Array>} Retorna uma tabela com todos os clientes.
     * @throws Mostra no console e propaga o erro caso a busca falha.
     */

    buscarTodos: async () => {
        try {
            const pool = await getConnection();

            const querySQL = 'SELECT * FROM Clientes';

            const result = await pool.request()
            .query(querySQL);

            return result.recordset;

        } catch (error) {
            console.error("Erro ao buscar Clientes", error);
            throw error; // Reverberar o erro para a função que o chamar.
        }
    },


    buscarUm: async (idClientes) => {
        try {
            const pool = await getConnection();

            const querySQL = `
            SELECT * FROM Clientes
            WHERE idClientes = idClientes
            `;

            const result = await pool.request()
            .input('idClientes', sql.UniqueIdentifier,idClientes)
            .query(querySQL);

            return result.recordset

        } catch (error) {
             console.error("Erro ao buscar o clientes", error);
            throw error;
        }
    },

    /**
     * Insere um novo cliente no banco de dados.
     * 
     * @async
     * @function
     * @param {string} nomeCliente - Nome Clientes a ser cadastrado
     * @param {number} 
     * @return
     * @throws
     */

}