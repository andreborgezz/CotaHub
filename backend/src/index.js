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
        "dataAtualizacao": new Date(resposta.data.dataAtualizacao).toLocaleString('pt-BR', {timeZone: 'America/Sao_Paulo'}) 
        //formatando a data pra voltar como: "08/07/2026, 11:02:00"
        });
    } catch(erro) {
        res.status(500).json({erro: 'Erro ao consultar cotação: Dolar $'})
}
});

// rota EURO: 
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
app.listen(3000, () => {
    console.log("backend rodando na porta 3000");
    
})
