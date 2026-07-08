#Cotahub#

Projeto desenvolvido para aprender conceitos de desenvolvimento de aplicações utilizando *Node.js# como:

- Criação de endpoints.
- Tratamento de dados.
- Dockeirização.
- Deploy de aplicações com docker.

Endpoints criados utilizando a api publica https://dolarapi.com/docs/ que disponibiliza atualizações em tempo real do valor das principais moedas usadas na América do Sul:

- Dolar:

- Euro:

- Peso Argentino:

- Peso Chileno:

- Peso Uruguaio;

Os endpoints devolvem os dados em json:

[
  {
    "compra": 0,
    "venda": 0,
    "fechoAnterior": 0,
    "nome": "string",
    "moeda": "string",
    "dataAtualizacao": "string"
  }
]