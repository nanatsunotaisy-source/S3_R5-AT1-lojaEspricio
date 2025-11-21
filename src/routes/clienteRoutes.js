const express = require("express");
const router = express.Router();
const { clienteController } = require("../controllers/clienteController");

router.get("/clientes", clienteController.listarClientes);
router.post("/clientes", clienteController.cadastrarCliente);
router.put("/clientes/:idCliente", clienteController.atualizarCliente);
router.delete("/clientes/:idCliente", clienteController.deletarCliente);

module.exports = {clientesRoutes: router};