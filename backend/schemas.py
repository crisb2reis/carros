from pydantic import BaseModel

class CarroBase(BaseModel):
    modelo: str
    marca: str
    ano: int
    preco: float

class CarroCreate(CarroBase):
    pass

class Carro(CarroBase):
    id: int
    class Config:
        orm_mode = True

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

class CompradorBase(BaseModel):
    nome: str
    cpf: str

class CompradorCreate(CompradorBase):
    pass

class Comprador(CompradorBase):
    id: int
    class Config:
        orm_mode = True
