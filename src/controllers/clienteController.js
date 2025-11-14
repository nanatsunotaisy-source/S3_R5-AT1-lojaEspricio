const {clienteModel} = require("../models/clienteModel"); // Adicionamos o model de cliente

const clienteController = {
    listarClientes: async (req, res) => {
        try {

            const clientes = await clienteModel.buscarTodos();

            res.status(200).json(clientes);

        } catch (error) {
            console.error("Erro ao mostrar clientes: ", error);
            res.status(500).json({ erro: "Erro ao mostrar clientes." });
        }
    },

    /**
     * Controlador que cria um novo cliente no banco de dados.
     * (Desafio: Verifica se o CPF já existe)
     */
    criarCliente: async (req, res) => {
        try {
            // 1. Pega os dados do corpo (body) da requisição
            const { nomeCliente, cpfCliente } = req.body;
            const verificacao = await clienteModel.buscarUm(cpfCliente)

            // 2. Validação simples
            if (!nomeCliente || !cpfCliente) {
                return res.status(400).json({
                    erro: "Nome e CPF são obrigatórios."
                });
            }


            if (verificacao.length > 0) {
                return res.status(409).json({ erro: "Esse CPF já está cadastrado!" });
            }


            // 3. Chama o Model para inserir no banco
            const novoCliente = { nomeCliente, cpfCliente };
            const clienteCriado = await clienteModel.criarCliente(novoCliente);

            // 4. Retorna o cliente que acabou de ser criado
            res.status(201).json(clienteCriado);

        } catch (error) {

            // 6. Erro genérico para qualquer outra falha
            console.error("Erro ao criar cliente:", error);
            res.status(500).json({
                erro: "Erro interno no servidor ao tentar criar o cliente."
            });
        }
    }
}; // Fim do clienteController

module.exports = { clienteController };