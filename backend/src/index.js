const express = require('express');
const cors = require('cors'); 
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const axios = require('axios');
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
    console.log("backend rodando na porta 3000");
});

// rota geral de cotações
app.get('/api/cotacoes/general', async(req, res) => {
    try {
        const resposta = await axios.get('https://br.dolarapi.com/v1/cotacoes');
        res.json(resposta.data);
    } catch(erro) {
        res.status(500).json({ erro: 'Erro ao consultar cotações' });
    }
});

// rota dolar
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

// rota EURO 
app.get('/api/cotacoes/euro', async(req,res) => {
    try{
        const resposta = await axios.get('https://br.dolarapi.com/v1/cotacoes/eur');

        res.json({
        "moeda": resposta.data.moeda,
        "nome": resposta.data.nome,
        "compra": resposta.data.compra,
        "venda": resposta.data.venda,
        "fechoAnterior": resposta.data.fechoAnterior,
        "dataAtualizacao": new Date(resposta.data.dataAtualizacao).toLocaleString('pt-BR', {timeZone: 'America/Sao_Paulo'}) 
        //formatando a data pra voltar como: "08/07/2026, 11:02:00"
        });
    } catch(erro) {
        res.status(500).json({erro: 'Erro ao consultar cotação: Euro €'})
}
});

// rota PESO ARGENTINO: 
app.get('/api/cotacoes/argentino', async(req,res) => {
    try{
        const resposta = await axios.get('https://br.dolarapi.com/v1/cotacoes/ars');

        res.json({
        "moeda": resposta.data.moeda,
        "nome": 'Peso Argentino',
        "compra": resposta.data.compra,
        "venda": resposta.data.venda,
        "fechoAnterior": resposta.data.fechoAnterior,
        "dataAtualizacao": new Date(resposta.data.dataAtualizacao).toLocaleString('pt-BR', {timeZone: 'America/Sao_Paulo'}) 
        //formatando a data pra voltar como: "08/07/2026, 11:02:00"
        });
    } catch(erro) {
        res.status(500).json({erro: 'Erro ao consultar cotação: Peso Argentino $'})
}
});

// rota PESO CHILENO: 
app.get('/api/cotacoes/chileno', async(req,res) => {
    try{
        const resposta = await axios.get('https://br.dolarapi.com/v1/cotacoes/clp');

        res.json({
        "moeda": resposta.data.moeda,
        "nome": 'Peso Chileno',
        "compra": resposta.data.compra,
        "venda": resposta.data.venda,
        "fechoAnterior": resposta.data.fechoAnterior,
        "dataAtualizacao": new Date(resposta.data.dataAtualizacao).toLocaleString('pt-BR', {timeZone: 'America/Sao_Paulo'}) 
        //formatando a data pra voltar como: "08/07/2026, 11:02:00"
        });
    } catch(erro) {
        res.status(500).json({erro: 'Erro ao consultar cotação: Peso Chileno $'})
}
});

// rota PESO URUGUAIO: 
app.get('/api/cotacoes/uruguaio', async(req,res) => {
    try{
        const resposta = await axios.get('https://br.dolarapi.com/v1/cotacoes/uyu');

        res.json({
        "moeda": resposta.data.moeda,
        "nome": 'Peso Uruguaio',
        "compra": resposta.data.compra,
        "venda": resposta.data.venda,
        "fechoAnterior": resposta.data.fechoAnterior,
        "dataAtualizacao": new Date(resposta.data.dataAtualizacao).toLocaleString('pt-BR', {timeZone: 'America/Sao_Paulo'}) 
        //formatando a data pra voltar como: "08/07/2026, 11:02:00"
        });
    } catch(erro) {
        res.status(500).json({erro: 'Erro ao consultar cotação: Peso Uruguaio $'})
}
});

// create usuario
app.post('/api/usuarios', async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        
        const senhaHash = await bcrypt.hash(senha, 10);
        
        await pool.query(
            'INSERT INTO users (nome, email, senha) VALUES ($1, $2, $3)',
            [nome, email, senhaHash]
        );
        res.status(201).json({ mensagem: 'Usuário criado com sucesso.' });
    } catch(erro) {
        res.status(500).json({ erro: 'Erro ao criar usuário: ' + erro.message });
    }
});

// rota para atualizar usuario
app.put('/api/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { senha } = req.body;
        
        const senhaHash = await bcrypt.hash(senha, 10);
        
        await pool.query(
            'UPDATE users SET senha = $1 WHERE id_user = $2',
            [senhaHash, id]
        );
        res.status(200).json({ mensagem: 'Senha do usuário atualizada.' });
    } catch(erro) {
        res.status(500).json({ erro: 'Erro ao atualizar senha: ' + erro.message });
    }
}); 

// rota para login de usuário
app.post('/api/login', async (req, res) => {
    try {
        const { email, senha } = req.body;

        const resultado = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (resultado.rows.length === 0) {
            return res.status(401).json({ erro: 'E-mail ou senha inválidos.' });
        }

        const usuario = resultado.rows[0];
        const senhaValida = await bcrypt.compare(senha, usuario.senha);

        if (!senhaValida) {
            return res.status(401).json({ erro: 'E-mail ou senha inválidos.' });
        }

        res.status(200).json({ mensagem: 'Login realizado com sucesso.', usuario: { id: usuario.id_user, nome: usuario.nome, email: usuario.email } });
    } catch(erro) {
        res.status(500).json({ erro: 'Erro ao fazer login: ' + erro.message });
    }
});