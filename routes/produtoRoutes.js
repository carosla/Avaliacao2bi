const router = require('express').Router();
const Produto = require('../models/Produto');

//POST (INSERT) Inserindo um novo produto no MongoDB
router.post('/', (req, res) => {
    const {nome, descricao, cor, peso, tipo, preco, dataCadastro} = req.body;
    if(!nome && !descricao && !cor && !peso && !tipo && !preco && !dataCadastro){
        res.status(422).json({ error: 'Informar o nome, descricao, cor, peso, tipo, preco, dataCadastro'})
    }
    const produto = {
        nome, 
        descricao,
        cor,
        peso,
        tipo,
        preco,
        dataCadastro,
    };
    try {
        Produto.create(produto);
        res.status(201).json({message: 'Produto cadastrado com sucesso!'})
    } catch (error) {
        res.status(500).json({error: error});
    }
});

// PUT (UPDATE) Atualizando um produto existente no MongoDB
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, descricao, cor, peso, tipo, preco, dataCadastro } = req.body;

    if (!nome && !descricao && !cor && !peso && !tipo && !preco && !dataCadastro) {
        return res.status(422).json({ error: 'Informar ao menos um campo para atualizar' });
    }

    const updateData = {};
    if (nome) updateData.nome = nome;
    if (descricao) updateData.descricao = descricao;
    if (cor) updateData.cor = cor;
    if (peso) updateData.peso = peso;
    if (tipo) updateData.tipo = tipo;
    if (preco) updateData.preco = preco;
    if (dataCadastro) updateData.dataCadastro = dataCadastro;

    try {
        const updatedProduto = await Produto.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedProduto) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }

        res.status(200).json({ message: 'Produto atualizado com sucesso!', produto: updatedProduto });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE (REMOVE) Deletando um produto existente no MongoDB
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedProduto = await Produto.findByIdAndDelete(id);

        if (!deletedProduto) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }

        res.status(200).json({ message: 'Produto deletado com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET (READ) Listar todas as informações de todos os produtos
router.get('/', async (req, res) => {
    try {
        const produtos = await Produto.find();
        res.status(200).json(produtos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET (READ) Listar todas as informações de um produto específico por ID ou Nome
router.get('/search', async (req, res) => {
    const { id, nome } = req.query;

    if (!id && !nome) {
        return res.status(422).json({ error: 'Informar o id ou nome do produto' });
    }

    try {
        let produto;
        if (id) {
            console.log(`Procurando produto por ID: ${id}`);
            produto = await Produto.findById(id);
        } else if (nome) {
            console.log(`Procurando produto por Nome: ${nome}`);
            produto = await Produto.findOne({ nome: nome });
        }

        if (!produto) {
            console.log('Produto não encontrado');
            return res.status(404).json({ error: 'Produto não encontrado' });
        }

        res.status(200).json(produto);
    } catch (error) {
        console.error(`Erro ao buscar produto: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;