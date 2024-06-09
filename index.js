const express = require('express');
const mongoose = require('mongoose');
const server = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const produtoRoutes = require('./routes/produtoRoutes');

//Middleware
server.use(
    express.urlencoded({
        extended: true,
    }),
);

// Documentação da API com Swagger
server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

server.use(express.json());

//Criando o endpoint e rotas da minha API
server.use('/produto', produtoRoutes);

//Conexão com MongoDB Atlas
const DB_USER = 'anacarolinaneias';
const DB_PASSWORD = encodeURIComponent('sininho149')

//Conexão com MongoDB Atlas
mongoose.connect('mongodb+srv://anacarolinaneias:sininho149@cluster0.tvllt5o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
                .then(()=>{
                    console.log('Conectado ao MongoDB!');
                })
                .catch((err)=>{
                    console.log(err);
                });

//Porta do servidor
server.listen(3000);