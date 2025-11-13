const { promises } = require("dns");
const { sql, getConnection } = require("../config/db");

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
                WHERE idClientes = @idClientes
            `;

            const result = await pool.request()
                .input('idClientes', sql.UniqueIdentifier, idClientes)
                .query(querySQL);

            return result.recordset;

        } catch (error) {
            console.error("Erro ao buscar o clientes", error);
            throw error;
        }
    },

    /**
     * Insere um novo cliente no banco de dados.
     *
     * @async
     * @function criarCliente
     * @param {object} novoCliente - Objeto contendo nomeCliente e cpfCliente.
     * @returns {promise<object>} Retorna o objeto do cliente recém-criado.
     * @throws Propaga o erro caso a inserção falhe (ex: CPF duplicado).
     */
    criarCliente: async (novoCliente) => {
        try {
            
            const { nomeCliente, cpfCliente } = novoCliente;

            const pool = await getConnection();

            const querySQL = `
                INSERT INTO Clientes (nomeCliente, cpfCliente)
                OUTPUT INSERTED.* VALUES (@nomeCliente, @cpfCliente);
            `;

            const result = await pool.request()
                // Define os parâmetros de entrada (inputs) para evitar SQL Injection
                .input('nomeCliente', sql.VarChar, nomeCliente)
                .input('cpfCliente', sql.VarChar(14), cpfCliente)
                .query(querySQL);

            
            return result.recordset[0];

        } catch (error) {
            console.error("Erro ao criar cliente", error);

            
            if (error.number === 2601 || error.number === 2627) {
                throw new Error("Este CPF já está cadastrado.");
            }

            throw error; // Reverbera outros erros
        }
    }
}; // Fechamento do objeto clienteModel