# Guia de Compra de Carros - Aplicação Fullstack
# 🚗 Guia de Compra de Carros - Projeto Educacional

Este projeto é uma plataforma integrada de Landing Page e sistema CRUD (Carros, Vendedores e Compradores), desenvolvido utilizando **React (Vite) no Frontend**, **FastAPI no Backend** e **MySQL** como banco de dados relacional.
Bem-vindos(as) ao repositório do **Sistema de Gestão Automotiva**, um projeto desenvolvido com fins didáticos para demonstrar o fluxo completo de uma aplicação Web moderna: desde o clique do usuário na tela até a gravação da informação no Banco de Dados.

---
## 🎯 Objetivo da Aplicação
Este sistema serve para gerenciar o catálogo de veículos, a equipe de vendedores e a carteira de clientes de uma concessionária de automóveis. O projeto utiliza uma arquitetura separada em duas partes principais: **Frontend** e **Backend**.

## 🛠 Pré-requisitos

Certifique-se de ter os seguintes componentes instalados no seu ambiente de desenvolvimento:

* **Python 3.8+**: [Download Python](https://www.python.org/downloads/)
* **Node.js 16+ (com npm)**: [Download Node.js](https://nodejs.org/)
* **MySQL Server**: [Download MySQL](https://dev.mysql.com/downloads/)

---

## 🗄️ 1. Configuração do Banco de Dados (MySQL)
## 🛠️ Tecnologias Utilizadas

O primeiro passo é garantir que o banco de dados esteja rodando e pronto para receber conexões.
### Frontend (O "Rosto" da Aplicação)
O Frontend é a parte visual com a qual o usuário interage.
* **React:** Biblioteca JavaScript para construção da interface.
* **Vite:** Ferramenta ultra-rápida de construção do projeto React.
* **Axios:** Cliente HTTP responsável por fazer o papel de "mensageiro", levando os dados da tela para o servidor e vice-versa.

### No Windows:
Certifique-se de que o serviço do MySQL está em execução (você pode verificar abrindo o aplicativo `Serviços` do Windows e procurando por "MySQL").
### Backend (O "Cérebro" da Aplicação)
O Backend é a sala de máquinas. Fica escondido do usuário, toma decisões lógicas e conversa com o Banco de Dados.
* **Python:** Linguagem de programação escolhida pela sua clareza.
* **FastAPI:** Framework moderno e veloz para construção de APIs (as "portas de comunicação").
* **SQLAlchemy:** Tradutor (ORM) que transforma código Python em instruções que o banco de dados SQL entende.
* **Pydantic:** O "fiscal de segurança", responsável por garantir que o formato das informações (JSON) enviadas pelo frontend estejam estritamente corretas.

### No Linux (Ubuntu/Debian):
Inicie e habilite o serviço do MySQL com os comandos:
```bash
sudo systemctl start mysql
sudo systemctl enable mysql
```
### Banco de Dados (A "Memória" da Aplicação)
* **MySQL:** Banco de Dados Relacional onde as tabelas de Carros, Vendedores e Compradores são armazenadas no disco rígido.

### Criação do Banco:
Acesse o terminal do MySQL (via linha de comando ou ferramentas como DBeaver/MySQL Workbench) e execute:
```sql
CREATE DATABASE guia_carros;
```

**Configurando as credenciais:**
Abra o arquivo `backend/database.py` e edite a string de conexão na linha 5. Substitua `usuario` e `senha` pelas suas credenciais locais do banco:
```python
SQLALCHEMY_DATABASE_URL = "mysql+pymysql://usuario:senha@localhost/guia_carros"
```

---

## ⚙️ 2. Executando o Backend (FastAPI)
## 🏗️ Estrutura do Projeto e Fluxo de Dados

O backend fará a criação automática das tabelas assim que for iniciado pela primeira vez.
Uma das grandes lições deste projeto é entender como a informação flui:

### No Windows:
Abra o terminal (PowerShell ou CMD), navegue até a pasta `backend` e execute:
1. **O Usuário** clica em "Cadastrar" no formulário React (`Carros.jsx`).
2. O **Axios** (Frontend) dispara uma requisição HTTP do tipo POST para a URL do Backend.
3. As rotas no **FastAPI** (`routers/carros.py`) recebem essa requisição.
4. O **Pydantic** (`schemas.py`) fiscaliza os dados.
5. Se tudo estiver correto, o **SQLAlchemy** (`models.py`) monta o comando `INSERT` e envia para o MySQL.
6. O **MySQL** salva e retorna o sucesso. O Backend repassa esse sucesso para o Frontend, que finalmente exibe o carro na tela!

```powershell
# 1. Navegue até a pasta do backend
cd backend
*(Você encontrará comentários didáticos linha a linha nos códigos do projeto explicando este fluxo exato!)*

# 2. Crie o ambiente virtual
python3 -m venv venv

# 3. Ative o ambiente virtual
.\venv\Scripts\activate

# 4. Instale as dependências
pip install -r requirements.txt

# 5. Inicie o servidor
uvicorn main:app --reload
```

### No Linux:
Abra o terminal, navegue até a pasta `backend` e execute:

```bash
# 1. Navegue até a pasta do backend
cd backend

# 2. Crie o ambiente virtual (pode ser necessário instalar o pacote python3-venv)
python3 -m venv venv

# 3. Ative o ambiente virtual
source venv/bin/activate

# 4. Instale as dependências
pip install -r requirements.txt

# 5. Inicie o servidor
uvicorn main:app --reload
```

> **Acesso à API:** O backend estará disponível em `http://localhost:8000`. A documentação interativa (Swagger UI) pode ser acessada em `http://localhost:8000/docs`.

---

## 💻 3. Executando o Frontend (React + Vite)
## 🚀 Como Executar o Projeto Localmente

A inicialização do frontend é igual para ambos os sistemas operacionais.
Para rodar o projeto no seu computador, você precisará inicializar as duas partes (Backend e Frontend) em terminais separados.

Abra um **novo terminal** (mantenha o terminal do backend em execução), navegue até a pasta `frontend` e execute:
### 1. Preparando e Rodando o Backend (Python)
1. Navegue até a pasta do backend:
   ```bash
   cd backend
   ```
2. Ative o ambiente virtual (se estiver usando um):
   ```bash
   source venv/bin/activate
   ```
3. Instale as dependências necessárias:
   ```bash
   pip install fastapi uvicorn sqlalchemy pymysql
   ```
4. **IMPORTANTE**: Certifique-se de ter um banco MySQL rodando na sua máquina (ou via Docker) com o banco de dados `guia_carros` criado e atualize suas credenciais no arquivo `database.py`.
5. Inicie o servidor:
   ```bash
   uvicorn main:app --port 8081 --reload
   ```
   *(A flag `--reload` faz o servidor reiniciar automaticamente se você mudar o código!)*

```bash
# 1. Navegue até a pasta do frontend
cd frontend
### 2. Rodando o Frontend (React)
1. Abra **um novo terminal** (mantenha o backend rodando no outro) e vá para a pasta do frontend:
   ```bash
   cd frontend
   ```
2. Instale as bibliotecas Javascript do projeto:
   ```bash
   npm install
   ```
3. Inicie a interface do usuário:
   ```bash
   npm run dev
   ```
4. O terminal fornecerá um endereço (ex: `http://localhost:5173`). Abra este link no seu navegador para ver a aplicação em funcionamento!

# 2. Instale todas as dependências do Node
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

> **Acesso à Interface:** O Vite iniciará o servidor frontend, geralmente acessível em `http://localhost:5173`. Clique no link exibido no terminal.

---

## 🏗️ Arquitetura do Projeto

* **`frontend/`**: Aplicação SPA (Single Page Application) construída com React. Gerencia a interface, os formulários e utiliza o `axios` para comunicação com a API.
* **`backend/`**: API RESTful utilizando FastAPI.
  * **`main.py`**: Ponto de entrada, configuração do CORS e mapeamento das rotas (Endpoints).
  * **`database.py`**: Configuração da engine do SQLAlchemy e controle de sessões do MySQL.
  * **`models.py`**: Definição declarativa das tabelas (Carros, Vendedores, Compradores) usando o ORM do SQLAlchemy.
  * **`schemas.py`**: Definição dos contratos de dados (DTOs) usando Pydantic, garantindo validação rígida de entrada/saída.
*Projeto construído especialmente para o aprendizado da turma. Explore o código, modifique os arquivos e bons estudos!* 🎓👨‍💻