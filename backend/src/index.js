const express = require('express');
const axios = require('axios');
const cors = require('cors') // liberando acesso das rotas

const app = express();
app.use = (cors());

//rota para todas as cotações
//    /api/cotacoes/geral
app.get('/api/cotacoes/geral', async(req,res) => {
    try{
        const resposta = await axios.get('https://br.dolarapi.com/v1/cotacoes');
        
        res.json(resposta.data);
} catch(erro) {
        res.status(500).json({erro: 'Erro ao consultar cotações'})
    }
});


// rota DOLAR: 
app.get('/api/cotacoes/dolar', async(req,res) => {
    try{
        const resposta = await axios.get('https://br.dolarapi.com/v1/cotacoes/usd');

        res.json({
        "moeda": resposta.data.moeda,
        "nome": resposta.data.nome,
        "compra": resposta.data.compra,
        "venda": resposta.data.venda,
        "fechoAnterior": resposta.data.fechoAnterior,
        "dataAtualizacao": resposta.data.dataAtualizacao,
        });
    } catch(erro) {
        res.status(500).json({erro: 'Erro ao consultar cotação: USD'})
}
});


app.listen(3000, () => {
    console.log("backend rodando na porta 3000");
    
})
