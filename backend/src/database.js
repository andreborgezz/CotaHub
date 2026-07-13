//importando as dependencias
// require('dotenv').config();
const{ Pool } = require('pg');

//pegando as variaveis de ambiente do arquivo .env e colocando em variaveis
const host = process.env.host_db;
const port = process.env.port_db;
const user = process.env.user_db;
const password = process.env.password_db;
const database = process.env.database_db; 

//criando a pool de conexões com o banco de dados
const pool = new Pool({
    host: host,
    port: port,
    user: user,
    password: password,
    database: database
})

module.exports = pool;
