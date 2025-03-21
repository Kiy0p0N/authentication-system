# Sistema de Autenticação com Express e PostgreSQL  

![Exemplo de execução](/image/example.gif)  

## 📌 Descrição do Projeto  
Este é um sistema completo de autenticação de usuários construído com Node.js, Express e PostgreSQL. Ele permite que os usuários se registrem, façam login com credenciais locais (e-mail e senha) ou utilizem autenticação via Google OAuth.  

## 🚀 Tecnologias Utilizadas  
- **Node.js** - Ambiente de execução backend  
- **Express.js** - Framework web para Node.js  
- **PostgreSQL** - Banco de dados relacional  
- **bcrypt** - Hash e verificação de senhas  
- **EJS** - Motor de template para renderizar páginas dinâmicas  
- **body-parser** - Middleware para manipulação de dados de formulários  
- **express-session** - Gerenciamento de sessões de usuário  
- **passport.js** - Middleware de autenticação  
- **passport-local** - Estratégia de autenticação com e-mail e senha  
- **passport-google-oauth2** - Estratégia de autenticação via Google OAuth  
- **dotenv** - Gerenciamento de variáveis de ambiente  

## 📂 Funcionalidades  
✔ Registro de usuário com hash de senha seguro (bcrypt)  
✔ Login de usuário com autenticação local via Passport.js  
✔ Login via Google OAuth2  
✔ Persistência de sessão para usuários autenticados  
✔ Proteção de rotas para impedir acesso não autorizado  
✔ Armazenamento seguro de segredos no banco de dados 

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
       password TEXT NOT NULL,
       secret TEXT
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
