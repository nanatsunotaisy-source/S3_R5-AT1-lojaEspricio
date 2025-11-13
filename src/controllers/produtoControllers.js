const { produtoModel } = require("../models/produtoModel");
const clienteModel = require("../models/clienteModel"); // Adicionamos o model de cliente

const produtoController = {
  listarProdutos: async (req, res) => {
    try {
      const { idProduto } = req.query;

      if (idProduto) {
        if (idProduto.length !== 36) { // Ajustado para !== e com espaço
          return res.status(400).json({ erro: "id do produto invalido!" });
        }

        const produto = await produtoModel.buscarUm(idProduto);
        return res.status(200).json(produto);
      }

      const produtos = await produtoModel.buscarTodos();
      res.status(200).json(produtos);

    } catch (error) {
      console.error('Erro ao listar produtos', error);
      res.status(500).json({ erro: 'Erro ao buscar produtos.' });
    }
  },

  criarProduto: async (req, res) => {
    try {
      const { nomeProduto, precoProduto } = req.body;

      // Validação agrupada e ajustada
      if (!nomeProduto || nomeProduto.trim() === "" || precoProduto === undefined || isNaN(precoProduto)) {
        return res.status(400).json({ erro: "Campos obrigatorios não preenchidos" });
      }

      // (Nota: O seu model de produto parece se chamar 'inserirProduto')
      await produtoModel.inserirProduto(nomeProduto, precoProduto);

      res.status(201).json({ message: "Produto cadastrado com sucesso" });

    } catch (error) {
      console.error('Erro ao cadastrar produto', error);
      res.status(500).json({ erro: 'Erro ao cadastrar produtos.' });
    }
  }
}; // Fim do produtoController

const clienteController = {
  listarClientes: async (req, res) => {
    try {
      const { idClientes } = req.query;

      // 1. SE UM ID FOI FORNECIDO (buscaUm)
      if (idClientes) {
        // Validação de ID (seguindo seu padrão de 36-char UUID)
        if (idClientes.length !== 36) {
          return res.status(400).json({ erro: "ID do cliente inválido!" });
        }

        const cliente = await clienteModel.buscarUm(idClientes);
        return res.status(200).json(cliente);
      }

      // 2. SE NENHUM ID FOI FORNECIDO (buscarTodos)
      const clientes = await clienteModel.buscarTodos();
      res.status(200).json(clientes);

    } catch (error) {
      console.error('Erro ao listar clientes', error);
      res.status(500).json({ erro: 'Erro ao buscar clientes.' });
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

      // 2. Validação simples
      if (!nomeCliente || !cpfCliente) {
        return res.status(400).json({
          erro: "Nome e CPF são obrigatórios."
        });
      }

      // 3. Chama o Model para inserir no banco
      const novoCliente = { nomeCliente, cpfCliente };
      const clienteCriado = await clienteModel.criarCliente(novoCliente);

      // 4. Retorna o cliente que acabou de ser criado
      res.status(201).json(clienteCriado);

    } catch (error) {

      // 5. Tratamento de Erro (O Desafio)
      if (error.message === "Este CPF já está cadastrado.") {

        // Retorna o status 409 Conflict
        return res.status(409).json({
          erro: error.message
        });
      }

      // 6. Erro genérico para qualquer outra falha
      console.error("Erro ao criar cliente:", error);
      res.status(500).json({
        erro: "Erro interno no servidor ao tentar criar o cliente."
      });
    }
  }
}; // Fim do clienteController

module.exports = {
  produtoController,
  clienteController
};