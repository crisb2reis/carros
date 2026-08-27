from sqlalchemy import Column, Integer, String, Float, ForeignKey
from database import Base

class Carro(Base):
    __tablename__ = "carros"
    id = Column(Integer, primary_key=True, index=True)
    modelo = Column(String(100), index=True)
    marca = Column(String(100))
    ano = Column(Integer)
    preco = Column(Float)

class Vendedor(Base):
    __tablename__ = "vendedores"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(150), index=True)
    email = Column(String(100), unique=True, index=True)
    telefone = Column(String(20))

class Comprador(Base):
    __tablename__ = "compradores"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(150), index=True)
    cpf = Column(String(14), unique=True, index=True)
