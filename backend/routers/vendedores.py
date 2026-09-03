from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import models, schemas
from database import get_db

router = APIRouter(
    prefix="/vendedores",
    tags=["Vendedores"]
)

@router.post("/", response_model=schemas.Vendedor)
def criar_vendedor(vendedor: schemas.VendedorCreate, db: Session = Depends(get_db)):
    # RECEBIMENTO (Frontend -> Backend)
    # O FastAPI recebe os dados do novo vendedor via POST e os valida.
    
    # BANCO DE DADOS (Salvando)
    # 1. Converte para o modelo que o banco entende.
    db_vendedor = models.Vendedor(**vendedor.dict())
    
    # 2. Adiciona os dados na sessao atual do banco.
    db.add(db_vendedor)
    
    # 3. Executa o comando de INSERT e salva efetivamente no disco.
    db.commit()
    
    # 4. Atualiza os dados locais para obter o ID que foi gerado no banco.
    db.refresh(db_vendedor)
    
    # RESPOSTA (Backend -> Frontend)
    # Retorna o vendedor recem-criado para quem fez a chamada.
    return db_vendedor

@router.get("/", response_model=list[schemas.Vendedor])
def listar_vendedores(db: Session = Depends(get_db)):
    # RECEBIMENTO: Recebida requisicao GET para listar todos.
    # BANCO DE DADOS: Roda o comando equivalente a SELECT * FROM vendedores.
    # RESPOSTA: Entrega os dados formatados em JSON automaticamente.
    return db.query(models.Vendedor).all()

@router.delete("/{vendedor_id}")
def deletar_vendedor(vendedor_id: int, db: Session = Depends(get_db)):
    # RECEBIMENTO: Captura o ID fornecido no endereco (URL) para a exclusao.
    
    # BANCO DE DADOS: Procura no banco de dados se esse vendedor existe.
    vendedor = db.query(models.Vendedor).filter(models.Vendedor.id == vendedor_id).first()
    if not vendedor:
        raise HTTPException(status_code=404, detail="Vendedor não encontrado")
        
    # BANCO DE DADOS: Se existir, envia a instrucao de DELETE e confirma a transacao.
    db.delete(vendedor)
    db.commit() 
    
    # RESPOSTA: Envia status e mensagem de sucesso para a origem.
    return {"mensagem": "Vendedor deletado com sucesso"}
