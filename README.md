# Sistema de Autenticação com Express e PostgreSQL

![Exemplo de execução](/image/example.gif)

## 📌 Descrição do Projeto
Este é um sistema simples de autenticação construído com Node.js, Express, PostgreSQL e bcrypt para hash de senhas. Ele permite que os usuários se registrem e façam login com segurança.

## 🚀 Tecnologias Utilizadas
- **Node.js** - Ambiente de execução backend;
- **Express.js** - Framework web para Node.js;
- **PostgreSQL** - Banco de dados relacional;
- **bcrypt** - Hash de senhas;
- **EJS** - Motor de template;
- **body-parser** - Middleware para manipulação de dados de formulários;
- **express-session** - Gerenciamento de sessões;
- **passport.js** - Autenticação de usuários;
- **dotenv** - Módulo de dependência zero que carrega variáveis ​​de ambiente de um arquivo .env para process.env.

## 📂 Funcionalidades
- Registro de usuário com hash de senha
- Autenticação de login com bcrypt e Passport.js
- Integração com PostgreSQL para armazenamento de usuários
- Proteção de rotas para acesso autenticado

## 🔧 Instalação e Execução
### Pré-requisitos
Certifique-se de ter os seguintes itens instalados:
- **Node.js**
- **PostgreSQL**

### Passos
1. Clone o repositório:
   ```sh
   git clone https://github.com/Kiy0p0N/authentication-system.git
   cd seu-repositório
   ```
2. Instale as dependências:
   ```sh
   npm install
   ```
3. Configure o banco de dados PostgreSQL:
   ```sql
   CREATE DATABASE secrets;
   CREATE TABLE users (
       id SERIAL PRIMARY KEY,
       email VARCHAR(255) UNIQUE NOT NULL,
       password TEXT NOT NULL
   );
   ```
4. Configure as credenciais do banco de dados no código.
5. Inicie o servidor:
   ```sh
   node app.js
   ```
6. Abra `http://localhost:3000/` no seu navegador.

---
Sinta-se à vontade para contribuir! 🚀
