from pydantic import BaseModel
from typing import Optional

# O schemas.py e o "fiscal de seguranca" e "tradutor" do nosso projeto.
# Usando o Pydantic, ele garante que os dados vindos do frontend estao no formato correto
# (exemplo: se o frontend enviar um texto onde deveria ser um numero, o schema bloqueia).

# --- SCHEMAS DE CARROS ---

class CarroBase(BaseModel):
    # Classe base que define os dados essenciais de um carro. 
    # Ela sera usada tanto para criar (POST) quanto para responder (GET).
    modelo: str
    marca: str
    ano: int
    preco: float
    # Optional[str] significa que o campo pode ser uma String (texto) ou None (vazio).
    imagem: Optional[str] = None

class CarroCreate(CarroBase):
    # Usado exclusivamente na hora de CADASTRAR um carro (no metodo POST).
    # Como ele herda de CarroBase, recebe os mesmos atributos, porem sem o 'id', 
    # ja que o 'id' e criado apenas no momento que o banco de dados salva a informacao.
    pass

class Carro(CarroBase):
    # Usado para RESPONDER (GET). Aqui o carro ja existe no banco, portanto possui um 'id'.
    id: int
    
    class Config:
        # O orm_mode=True diz ao Pydantic para entender o formato interno do SQLAlchemy (models).
        # Sem isso, ele tentaria ler os dados como se fossem um dicionario comum do Python e falharia.
        orm_mode = True

# --- SCHEMAS DE VENDEDORES ---

class VendedorBase(BaseModel):
    nome: str
    email: str
    telefone: str

class VendedorCreate(VendedorBase):
    pass

class Vendedor(VendedorBase):
    id: int
    
    class Config:
        orm_mode = True

class VendedorPaginado(BaseModel):
    # Schema utilizado para responder ao frontend com a lista filtrada/paginada e metadados.
    itens: list[Vendedor]
    total: int
    pagina: int
    limite: int
    total_paginas: int

    class Config:
        orm_mode = True

# --- SCHEMAS DE COMPRADORES ---

class CompradorBase(BaseModel):
    nome: str
    cpf: str

class CompradorCreate(CompradorBase):
    pass

class Comprador(CompradorBase):
    id: int
    
    class Config:
        orm_mode = True
