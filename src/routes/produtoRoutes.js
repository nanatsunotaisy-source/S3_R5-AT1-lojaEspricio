const express = require('express');
const router = express.Router();
const {produtoController} = require("../controllers/produtoControllers");

router.get("/produtos", produtoController.listarProdutos);

module.exports = {produtosRoutes: router};