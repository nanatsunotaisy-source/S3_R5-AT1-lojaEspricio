const express = require("express");
const app = express();
const {produtosRoutes} = require("./src/routes/produtoRoutes");

const PORT = 8081;

app.listen(PORT, ()=>{
    console.log(`Servidor rodando em http://localhost:${PORT}`);
})