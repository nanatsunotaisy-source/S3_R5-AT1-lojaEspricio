const express = require("express");
const app = express();
const {produtosRoutes} = require("./src/routes/produtoRoutes");
const {clientesRoutes} = require("./src/routes/clienteRoutes");

const PORT = 8081;

app.use(express.json());
app.use('/', produtosRoutes);
app.use('/', clientesRoutes);

app.listen(PORT, ()=>{
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});