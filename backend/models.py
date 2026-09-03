from sqlalchemy import Column, Integer, String, Float
from database import Base

# O models.py e responsavel por representar fisicamente o Banco de Dados.
# Cada classe aqui representa uma tabela real no MySQL. O SQLAlchemy le estas 
# classes e traduz tudo para comandos SQL automaticamente.

class Carro(Base):
    # __tablename__ define o nome real da tabela dentro do banco de dados
    __tablename__ = "carros"
    
    # As variaveis abaixo sao as colunas da tabela
    # primary_key=True indica que o 'id' e unico e o identificador principal
    # index=True cria um indice no banco, deixando as buscas mais rapidas
    id = Column(Integer, primary_key=True, index=True)
    modelo = Column(String(100), index=True)
    marca = Column(String(100))
    ano = Column(Integer)
    preco = Column(Float)
    
    # Coluna adicionada para armazenar o link da imagem (URL)
    # nullable=True significa que este campo nao e obrigatorio (pode ser vazio)
    imagem = Column(String(500), nullable=True)

class Vendedor(Base):
    __tablename__ = "vendedores"
    
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(150), index=True)
    
    # unique=True impede que o banco aceite dois e-mails identicos (evita duplicidade)
    email = Column(String(100), unique=True, index=True)
    telefone = Column(String(20))

class Comprador(Base):
    __tablename__ = "compradores"
    
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(150), index=True)
    
    # O CPF tambem e marcado como unico, ja que nao existem duas pessoas com o mesmo CPF
    cpf = Column(String(14), unique=True, index=True)
