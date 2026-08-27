from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import models, schemas
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Guia de Compra de Carros API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# CARROS
@app.post("/carros/", response_model=schemas.Carro)
def criar_carro(carro: schemas.CarroCreate, db: Session = Depends(get_db)):
    db_carro = models.Carro(**carro.dict())
    db.add(db_carro)
    db.commit()
    db.refresh(db_carro)
    return db_carro

@app.get("/carros/", response_model=list[schemas.Carro])
def listar_carros(db: Session = Depends(get_db)):
    return db.query(models.Carro).all()

@app.delete("/carros/{carro_id}")
def deletar_carro(carro_id: int, db: Session = Depends(get_db)):
    carro = db.query(models.Carro).filter(models.Carro.id == carro_id).first()
    if not carro:
        raise HTTPException(status_code=404, detail="Carro não encontrado")
    db.delete(carro)
    db.commit()
    return {"mensagem": "Carro deletado com sucesso"}

# VENDEDORES
@app.post("/vendedores/", response_model=schemas.Vendedor)
def criar_vendedor(vendedor: schemas.VendedorCreate, db: Session = Depends(get_db)):
    db_vendedor = models.Vendedor(**vendedor.dict())
    db.add(db_vendedor)
    db.commit()
    db.refresh(db_vendedor)
    return db_vendedor

@app.get("/vendedores/", response_model=list[schemas.Vendedor])
def listar_vendedores(db: Session = Depends(get_db)):
    return db.query(models.Vendedor).all()

@app.delete("/vendedores/{vendedor_id}")
def deletar_vendedor(vendedor_id: int, db: Session = Depends(get_db)):
    vendedor = db.query(models.Vendedor).filter(models.Vendedor.id == vendedor_id).first()
    if not vendedor:
        raise HTTPException(status_code=404, detail="Vendedor não encontrado")
    db.delete(vendedor)
    db.commit()
    return {"mensagem": "Vendedor deletado com sucesso"}

# COMPRADORES
@app.post("/compradores/", response_model=schemas.Comprador)
def criar_comprador(comprador: schemas.CompradorCreate, db: Session = Depends(get_db)):
    db_comprador = models.Comprador(**comprador.dict())
    db.add(db_comprador)
    db.commit()
    db.refresh(db_comprador)
    return db_comprador

@app.get("/compradores/", response_model=list[schemas.Comprador])
def listar_compradores(db: Session = Depends(get_db)):
    return db.query(models.Comprador).all()

@app.delete("/compradores/{comprador_id}")
def deletar_comprador(comprador_id: int, db: Session = Depends(get_db)):
    comprador = db.query(models.Comprador).filter(models.Comprador.id == comprador_id).first()
    if not comprador:
        raise HTTPException(status_code=404, detail="Comprador não encontrado")
    db.delete(comprador)
    db.commit()
    return {"mensagem": "Comprador deletado com sucesso"}
