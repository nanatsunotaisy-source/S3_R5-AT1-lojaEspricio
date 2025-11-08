const {promises} = require("dns");
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
    },

    buscarUm: async (idProduto) => {
        try {
            const pool = await getConnection();

            const querySQL = `
            SELECT * FROM Produtos
            WHERE idProduto = @idProduto
            `;

            const result = await pool.request()
            .input('idProduto', sql.UniqueIdentifier, idProduto)
            .query(querySQL);

            return result.recordset;

        } catch (error) {
            console.error("Erro ao buscar o produto", error);
            throw error;
        }
    },

    /**
     * Insere um novo produto no banco de dados
     * 
     * @async
     * @function inserirProduto
     * @param {string} nomeProduto - Nome produto a ser cadastrado 
     * @param {number} precoProduto - Preço do produto
     * @returns {Promise<void>} - Não retorna nada, apenas executa a inserção
     * @throws Mostra no console e propaga o erro caso a inserção falhe
     */
    inserirProduto: async (nomeProduto, precoProduto) => {
        try {
            
            const pool = await getConnection();

            const querySQL = `
            INSERT INTO Produtos (nomeProduto, precoProduto)
            VALUES (@nomeProduto, @precoProduto)
            `
            
            await pool.request()
            .input("nomeProduto", sql.VarChar(100), nomeProduto)
            .input("precoProduto", sql.Decimal(10,2), precoProduto)
            .query(querySQL);

        } catch (error) {
            console.error("Erro ao inserir produtos", error);
            throw error;
        }
    }
};


module.exports = {produtoModel};