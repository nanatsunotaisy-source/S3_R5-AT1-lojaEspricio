const { clienteModel } = require("../models/clienteModel")

const clienteController = {

    /**
     * Controlador que lista todos os clientes cadastrados do banco de dados
     * @async
     * @function mostrarClientes
     * @param {object} req - Objeto da requisição (recebido do cliente HTTP) 
     * @param {object} res - Objeto da resposta (enviado ao cliente HTTP)
     * @returns {Promise<void>} Retorna uma reposta JSON com a lista de clientes.
     * @throws Mostra no console e retorna erro 500 se ocorrer falha ao buscar os cliente.
     * 
     */
    listarClientes: async (req, res) => {
        try {

            const clientes = await clienteModel.buscarClientes();

            res.status(200).json(clientes);

        } catch (error) {
            console.error("Erro ao mostrar clientes: ", error);
            res.status(500).json({ erro: "Erro ao mostrar clientes." });
        }
    },

    /**
   * Controlador que cria um novo cliente no banco de dados
     * 
     * @async
     * @function cadastrarCliente
     * @param {object} req - Objeto da requisição (recebido do cliente HTTP) 
     * @param {object} res - Objeto da resposta (enviado ao cliente HTTP)
     * @returns {Promise<void>} Retorna uma mensagem de sucesso ou erro em formato JSON.
     * @throws {400} Se algum campo obrigatório não for preenchido corretamente.
     * @throws {409} Se houver a tentativa do cadastro de um CPF já existente no banco de dados
     * @throws {500} Se ocorrer qualquer erro interno no servidor.
     * 
     */
    cadastrarCliente: async (req, res) => {
        try {
            const { nomeCliente, cpfCliente } = req.body;

            const verificacaoCPF = await clienteModel.buscarCpf(cpfCliente)

            if (nomeCliente == undefined || nomeCliente.trim() == "" || cpfCliente == undefined || cpfCliente == "", cpfCliente.length != 11) {
                return res.status(400).json({ erro: "Campos obrigatórios não preenchidos" });
            }

            if (cpfCliente.length != 11) {
                return res.status(400).json({ erro: "CPF inválido!" })
            }

            if (verificacaoCPF.length > 0) {
                return res.status(409).json({ erro: "Esse CPF já está cadastrado!" });
            }

            await clienteModel.adicionarClientes(nomeCliente, cpfCliente);

            res.status(201).json({ message: "Cliente cadastrado com sucesso!" });

        } catch (error) {
            console.error("Erro ao cadastrar clientes: ", error);
            res.status(500).json({ erro: "Erro ao cadastrar clientes." });
        }
    },

    /**
     * @async
     * @function atualizarCliente
     * @param {object} req - Objeto da requisição (recebido do cliente HTTP) 
     * @param {object} res - Objeto da resposta (enviado ao cliente HTTP)
     * @returns {Promise<void>} Retorna uma mensagem de sucesso ou erro em formato JSON.
     * @throws {400} Se algum campo não for preenchido corretamente.
     * @throws {400} Se houver a tentativa de colocar um CPF com menos digitos
     * @throws {409} Se houver a tentativa de atualizar um CPF colocando um que já existente no banco de dados
     * @throws {500} Se ocorrer qualquer erro interno no servidor.
     */
    atualizarCliente: async (req, res) => {
        try {
            const { idCliente } = req.params;
            const { nomeCliente, cpfCliente } = req.body;

            const verificacaoCPF = await clienteModel.buscarCpf(cpfCliente)

            if (idCliente.length != 36) {
                return res.status(400).json({ erro: "Id do cliente inválido!" });
            }

            if (cpfCliente && cpfCliente.length != 11) {
                return res.status(400).json({ erro: "CPF inválido!" })
            }

            if (verificacaoCPF.length > 0) {
                return res.status(409).json({ erro: "Esse CPF já está cadastrado!" });
            }

            const cliente = await clienteModel.buscarID(idCliente);

            if (!cliente || cliente.length !== 1) {
                return res.status(404).json({ erro: "Cliente não encontrado!" })
            }

            const clienteAtual = cliente[0];

            const nomeAtualizado = nomeCliente ?? clienteAtual.nomeCliente;
            const cpfAtualizado = cpfCliente ?? clienteAtual.cpfCliente;

            await clienteModel.atualizarCliente(idCliente, nomeAtualizado, cpfAtualizado);

            res.status(200).json({ mensagem: "Cliente atualizado com sucesso!" })

        } catch (error) {
            console.error("Erro ao atualizar o cliente: ", error);
            res.status(500).json({ erro: "Erro interno no servidor ao atualizar o cliente!" });
        }
    },

    /**
     * @async
     * @function deletarCliente
     * @param {object} req - Objeto da requisição (recebido do cliente HTTP) 
     * @param {object} res - Objeto da resposta (enviado ao cliente HTTP)
     * @returns {Promise<void>} Retorna uma mensagem de sucesso ou erro em formato JSON.
     */
    deletarCliente: async (req, res) => {
        try {
            const { idCliente } = req.params;

            if (idCliente.length != 36) {
                return res.status(400).json({ erro: "Id do cliente inválido!" });
            };

            const cliente = await clienteModel.buscarID(idCliente);

            if (!cliente || cliente.length !== 1) {
                return res.status(404).json({ erro: "Cliente não encontrado!" })
            };

            await clienteModel.deletarCliente(idCliente);

            res.status(200).json({ mensagem: "Cliente deletado com sucesso!" })

        } catch (error) {
            console.error("Erro ao deletar cliente: ", error);
            res.status(500).json({ erro: "Erro interno no servidor ao deletar cliente!" });
        }
    }


};

module.exports = { clienteController };