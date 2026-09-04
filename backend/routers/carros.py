from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import models, schemas
from database import get_db

router = APIRouter(
    prefix="/carros",
    tags=["Carros"]
)

@router.post("/", response_model=schemas.Carro)
def criar_carro(carro: schemas.CarroCreate, db: Session = Depends(get_db)):
    # RECEBIMENTO (Frontend -> Backend)
    # O FastAPI pega o pacote JSON que o Axios enviou no POST e valida usando o 'schemas.CarroCreate'.
    
    # BANCO DE DADOS (Salvando)
    # 1. Prepara a entidade convertendo os dados para o formato do banco (models.Carro).
    db_carro = models.Carro(**carro.dict())
    
    # 2. Adiciona à "fila" de salvamento.
    db.add(db_carro)
    
    # 3. Confirma a transação, executando de fato o "INSERT INTO carros..." no banco MySQL.
    db.commit()
    
    # 4. Atualiza a variável para carregar o novo ID gerado pelo banco.
    db.refresh(db_carro)
    
    # RESPOSTA (Backend -> Frontend)
    # Devolve o carro (agora com ID) como JSON para o frontend.
    return db_carro

@router.get("/", response_model=list[schemas.Carro])
def listar_carros(db: Session = Depends(get_db)):
    # RECEBIMENTO: O Frontend bateu na porta GET "/carros/".
    # BANCO DE DADOS: O SQLAlchemy executa um "SELECT * FROM carros".
    # RESPOSTA: O FastAPI automaticamente converte a lista do banco em JSON e manda pro Frontend.
    return db.query(models.Carro).all()

@router.delete("/{carro_id}")
def deletar_carro(carro_id: int, db: Session = Depends(get_db)):
    # RECEBIMENTO: O Frontend enviou um pedido DELETE passando o ID do carro na própria URL.
    
    # BANCO DE DADOS: Primeiro, tentamos localizar (SELECT) o carro com esse ID.
    carro = db.query(models.Carro).filter(models.Carro.id == carro_id).first()
    if not carro:
        raise HTTPException(status_code=404, detail="Carro não encontrado")
        
    # BANCO DE DADOS: Encontrado o carro, executamos o comando de DELETE no banco.
    db.delete(carro)
    db.commit() # Efetiva a exclusão no disco.
    
    # RESPOSTA: Retorna uma mensagem de sucesso para o Frontend (que por sua vez, vai recarregar a tela).
    return {"mensagem": "Carro deletado com sucesso"}

