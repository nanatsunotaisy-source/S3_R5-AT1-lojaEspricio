const { produtoModel } = require("../models/produtoModel");


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
  },

  atualizarProduto: async (req, res)=> {

    try {
      const {idProduto} = req.params;
      const {nomeProduto, precoProduto} = req.body;

       if (idProduto.length !== 36) {
          return res.status(404).json({ erro: "id do produto invalido!" });
        }

        const produto = await produtoModel.buscarUm(idProduto);
        
        if (!produto || produto.length !== 1){
          return res.status(404).json({erro: 'Produto não encontrado!'});
        }

        const produtoAtual = produto[0];

        const nomeAtualizado = nomeProduto ?? produtoAtual.nomeProduto;
        const precoAtualizado = precoProduto ?? produtoAtual.precoProduto;

        await produtoModel.atualizarProduto(idProduto,nomeAtualizado, precoAtualizado);

        res.status(200).json({message: 'Produto atualizado com sucesso!'});

    } catch (error) {
      console.error('Erro ao atualizar produto', error);
      res.status(500).json({ erro: 'Erro ao atualizar produtos.' });
    }
  }
};



module.exports = {
  produtoController,};