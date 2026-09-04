from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import models, schemas
from database import get_db

router = APIRouter(
    prefix="/compradores",
    tags=["Compradores"]
)

@router.post("/", response_model=schemas.Comprador)
def criar_comprador(comprador: schemas.CompradorCreate, db: Session = Depends(get_db)):
    # RECEBIMENTO (Frontend -> Backend)
    # O FastAPI recebe os dados do novo comprador via POST e os valida.
    
    # BANCO DE DADOS (Salvando)
    # 1. Converte para o modelo que o banco entende.
    db_comprador = models.Comprador(**comprador.dict())
    
    # 2. Adiciona os dados na sessao atual do banco.
    db.add(db_comprador)
    
    # 3. Executa o comando de INSERT e salva efetivamente no disco.
    db.commit()
    
    # 4. Atualiza os dados locais para obter o ID que foi gerado no banco.
    db.refresh(db_comprador)
    
    # RESPOSTA (Backend -> Frontend)
    # Retorna o comprador recem-criado para quem fez a chamada.
    return db_comprador

@router.get("/", response_model=list[schemas.Comprador])
def listar_compradores(db: Session = Depends(get_db)):
    # RECEBIMENTO: Recebida requisicao GET para listar todos.
    # BANCO DE DADOS: Roda o comando equivalente a SELECT * FROM compradores.
    # RESPOSTA: Entrega os dados formatados em JSON automaticamente.
    return db.query(models.Comprador).all()

@router.delete("/{comprador_id}")
def deletar_comprador(comprador_id: int, db: Session = Depends(get_db)):
    # RECEBIMENTO: Captura o ID fornecido no endereco (URL) para a exclusao.
    
    # BANCO DE DADOS: Procura no banco de dados se esse comprador existe.
    comprador = db.query(models.Comprador).filter(models.Comprador.id == comprador_id).first()
    if not comprador:
        raise HTTPException(status_code=404, detail="Comprador não encontrado")
        
    # BANCO DE DADOS: Se existir, envia a instrucao de DELETE e confirma a transacao.
    db.delete(comprador)
    db.commit() 
    
    # RESPOSTA: Envia status e mensagem de sucesso para a origem.
    return {"mensagem": "Comprador deletado com sucesso"}
