from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models
from database import engine

# Importando nossos "módulos" separados (routers)
from routers import carros, vendedores, compradores

# Cria as tabelas no banco de dados
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Guia de Compra de Carros API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Conectando as "tomadas" (rotas) no aplicativo principal
app.include_router(carros.router)
app.include_router(vendedores.router)
app.include_router(compradores.router)
