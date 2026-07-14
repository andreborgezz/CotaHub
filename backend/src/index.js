const express = require('express');
const cors = require('cors'); 
const { Pool } = require('pg');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

// console.log('DEBUG ENV:', { //verificando se as variaveis de ambiente estao sendo carregadas
//   host: process.env.HOST_DB,
//   port: process.env.PORT_DB,
//   user: process.env.USER_DB,
//   password: process.env.PASSWORD_DB,
//   database: process.env.DATABASE_DB
// });

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({ 
    host: process.env.HOST_DB,
    port: process.env.PORT_DB,
    user: process.env.USER_DB,
    password: process.env.PASSWORD_DB,
    database: process.env.DATABASE_DB
});

app.get('/teste-db', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT NOW()');
        res.json({ conectado: true, hora_banco: resultado.rows[0].now });
    } catch (erro) {
        res.status(500).json({ conectado: false, erro: erro.message });
    }
});

app.listen(3000, () => {
    console.log("backend rodando na porta 3000 - AGORA VAI");
});

// 2. ROTA GERAL DE COTAÇÕES
app.get('/api/cotacoes/general', async(req, res) => {
    try {
        const resposta = await axios.get('https://br.dolarapi.com/v1/cotacoes');
        res.json(resposta.data);
    } catch(erro) {
        res.status(500).json({ erro: 'Erro ao consultar cotações' });
    }
});

// 3. ROTA DOLAR
app.get('/api/cotacoes/dolar', async(req, res) => {
    try {
        const resposta = await axios.get('https://br.dolarapi.com/v1/cotacoes/usd');
        res.json({
            "moeda": resposta.data.moeda,
            "nome": resposta.data.nome,
            "compra": resposta.data.compra,
            "venda": resposta.data.venda,
            "fechoAnterior": resposta.data.fechoAnterior,
            "dataAtualizacao": new Date(resposta.data.dataAtualizacao).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }) 
        });
    } catch(erro) {
        res.status(500).json({ erro: 'Erro ao consultar cotação: Dolar $' });
    }
});

// 4. CRUD USUÁRIOS - CRIAR (POST)
app.post('/api/usuarios', async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        
        await pool.query(
            'INSERT INTO users (nome, email, senha) VALUES ($1, $2, $3)',
            [nome, email, senha]
        );
        res.status(201).json({ mensagem: 'Usuário criado.' });
    } catch(erro) {
        res.status(500).json({ erro: 'Erro ao criar usuário: ' + erro.message });
    }
});

// 5. CRUD USUÁRIOS - ATUALIZAR (PUT)
app.put('/api/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { senha } = req.body;
        
        // CORREÇÃO: Usando a constante pool aqui também
        await pool.query(
            'UPDATE users SET senha = $1 WHERE id = $2',
            [senha, id]
        );
        res.status(200).json({ mensagem: 'Senha do usuário atualizada.' });
    } catch(erro) {
        res.status(500).json({ erro: 'Erro ao atualizar senha: ' + erro.message });
    }
});