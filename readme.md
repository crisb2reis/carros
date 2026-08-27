# Guia de Compra de Carros - Aplicação Fullstack

Este projeto é uma plataforma integrada de Landing Page e sistema CRUD (Carros, Vendedores e Compradores), desenvolvido utilizando **React (Vite) no Frontend**, **FastAPI no Backend** e **MySQL** como banco de dados relacional.

---

## 🛠 Pré-requisitos

Certifique-se de ter os seguintes componentes instalados no seu ambiente de desenvolvimento:

* **Python 3.8+**: [Download Python](https://www.python.org/downloads/)
* **Node.js 16+ (com npm)**: [Download Node.js](https://nodejs.org/)
* **MySQL Server**: [Download MySQL](https://dev.mysql.com/downloads/)

---

## 🗄️ 1. Configuração do Banco de Dados (MySQL)

O primeiro passo é garantir que o banco de dados esteja rodando e pronto para receber conexões.

### No Windows:
Certifique-se de que o serviço do MySQL está em execução (você pode verificar abrindo o aplicativo `Serviços` do Windows e procurando por "MySQL").

### No Linux (Ubuntu/Debian):
Inicie e habilite o serviço do MySQL com os comandos:
```bash
sudo systemctl start mysql
sudo systemctl enable mysql
```

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

O backend fará a criação automática das tabelas assim que for iniciado pela primeira vez.

### No Windows:
Abra o terminal (PowerShell ou CMD), navegue até a pasta `backend` e execute:

```powershell
# 1. Navegue até a pasta do backend
cd backend

# 2. Crie o ambiente virtual
python -m venv venv

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

A inicialização do frontend é igual para ambos os sistemas operacionais.

Abra um **novo terminal** (mantenha o terminal do backend em execução), navegue até a pasta `frontend` e execute:

```bash
# 1. Navegue até a pasta do frontend
cd frontend

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