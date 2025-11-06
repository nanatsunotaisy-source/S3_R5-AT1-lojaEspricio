const {sql, getConnection} = require("../config/db");

const produtoModel = {
    /**
     * Busca todos os produtos no banco de dados.
     * 
     * @async
     * @function buscarTodos
     * @returns {Promise<Array>} Retorna uma  lista com todos os produtos.
     * @throws Mostra no console e propaga o erro caso a busca falha.
     */
    buscarTodos: async () => {
        try {
            const pool = await getConnection();


            const querySQL = 'SELECT * FROM Produtos';

            const result = await pool.request()
                .query(querySQL);

            return result.recordset;

        } catch (error) {
            console.error("Erro ao buscar produtos", error);
            throw error; // Reverberar o erro para a função que o chamar.
        }
    }
}

module.exports = {produtoModel};