# 📊 CotaHub

O **CotaHub** é uma aplicação web full-stack desenvolvida para gerenciamento, acompanhamento e visualização de cotações. A plataforma conta com controle de autenticação de usuários, dashboard interativo e integração direta com banco de dados em ambiente conteinerizado via Docker.

---

## 🚀 Funcionalidades

- **Autenticação & Controle de Acesso:**
  - Cadastro de novos usuários.
  - Login seguro com persistência de sessão.
- **Dashboard Dinâmico:**
  - Visualização centralizada de métricas e cotações.
  - Consumo de dados em tempo real via API backend.
- **Arquitetura Pronta para Produção:**
  - Backend modularizado em Node.js.
  - Suporte completo a Docker e Docker Compose para banco de dados e aplicação.

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5 & CSS3:** Interface estruturada e responsiva (`style.css`).
- **JavaScript (Vanilla/ES6):** Manipulação de DOM e consumo assíncrono de APIs REST (`api.js`, `login.js`, `cadastro.js`, `dashboard.js`).

### Backend
- **Node.js & Express:** Servidor de rotas e lógica de negócios (`index.js`).
- **Banco de Dados:** Conexão configurada em `database.js` via variáveis de ambiente.

### DevOps & Ambiente
- **Docker & Docker Compose:** Orquestração de contêineres e banco de dados.

---

## 📁 Estrutura de Arquivos

```text
CotaHub/
├── backend/
│   ├── src/
│   │   ├── database.js          # Configuração e pool de conexão com o banco
│   │   └── index.js             # Ponto de entrada (servidor Express e endpoints)
│   ├── docker-compose.yml       # Orquestração do backend e serviços (ex: banco de dados)
│   ├── dockerfile               # Imagem da aplicação backend
│   ├── .dockerignore
│   ├── .gitignore
│   ├── package.json             # Dependências e scripts do Node.js
│   └── package-lock.json
│
└── frontend/
    ├── css/
    │   └── style.css            # Folha de estilo unificada
    ├── js/
    │   ├── api.js               # Camada centralizada de chamadas HTTP (Fetch API)
    │   ├── login.js             # Lógica da tela de login
    │   ├── cadastro.js          # Lógica da tela de cadastro de usuários
    │   └── dashboard.js         # Manipulação dos dados e renderização do dashboard
    ├── index.html               # Página inicial / Login
    ├── cadastro.html            # Tela de criação de conta
    └── dashboard.html           # Painel principal
```

---

## ⚙️ Pré-requisitos

Antes de iniciar, certifique-se de ter instalado:
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/) (opcional, caso queira rodar via contêiner)

---

## 🔧 Como Executar o Projeto

### Opção 1: Execução com Docker (Recomendado)

1. Clone o repositório:
   ```bash
   git clone https://github.com/andreborgezz/CotaHub.git
   cd CotaHub/backend
   ```

2. Crie o arquivo de variáveis de ambiente:
   Crie um arquivo `.env` dentro da pasta `backend/` seguindo as variáveis necessárias (ex.: portas, credenciais do banco).

3. Suba os contêineres:
   ```bash
   docker-compose up --build
   ```

O backend estará ativo e pronto para receber requisições.

---

### Opção 2: Execução Manual (Local)

#### 1. Iniciar o Backend

```bash
# Entre na pasta do backend
cd backend

# Instale as dependências
npm install

# Inicie o servidor
npm start
# ou, se disponível em ambiente de desenvolvimento:
npm run dev
```

O servidor iniciará normalmente na porta configurada: `http://localhost:3000`.

#### 2. Executar o Frontend

O frontend é composto por arquivos estáticos (`HTML/CSS/JS`). Você pode executá-lo de duas formas:

- **Via extensão Live Server (VS Code):** Abra a pasta `frontend` e inicie a extensão no arquivo `index.html`.

Acesse a URL indicada no terminal para navegar pela aplicação.

---

## 👨‍💻 Autor

Desenvolvido por **[André Borges](https://github.com/andreborgezz)**.
