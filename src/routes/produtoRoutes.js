const express = require("express");
const router = express.Router();
const {produtoController} = require("../controllers/produtoControllers");

router.get("/produtos", produtoController.listarProdutos);

router.post("/produtos", produtoController.criarProduto);

router.put("/produto/:idProduto", produtoController.atualizarProduto);

module.exports = {produtosRoutes: router};