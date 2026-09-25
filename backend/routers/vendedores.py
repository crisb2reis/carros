from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Optional
import math
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

@router.get("/", response_model=schemas.VendedorPaginado)
def listar_vendedores(
    busca: Optional[str] = Query(None, description="Termo para busca em nome, email ou telefone"),
    pagina: int = Query(1, ge=1, description="Numero da pagina a ser exibida (minimo 1)"),
    limite: int = Query(10, ge=1, description="Quantidade de registros por pagina"),
    db: Session = Depends(get_db)
):
    # PASSO 1: CONSTRUÇÃO DA CONSULTA BASE (SQLAlchemy)
    # Inicializamos a query sem executar no banco ainda.
    query = db.query(models.Vendedor)
    
    # PASSO 2: FILTRAGEM NO BANCO DE DADOS (Server-Side Filtering)
    # Se o frontend enviou um termo de busca, adicionamos as condicoes WHERE (LIKE/ILIKE) na query.
    if busca and busca.strip():
        termo = f"%{busca.strip()}%"
        query = query.filter(
            or_(
                models.Vendedor.nome.ilike(termo),
                models.Vendedor.email.ilike(termo),
                models.Vendedor.telefone.ilike(termo)
            )
        )
    
    # PASSO 3: CONTAGEM TOTAL DE REGISTROS FILTRADOS (SQL COUNT)
    # Contamos quantos registros atendem ao filtro antes de aplicar o corte de pagina.
    total = query.count()
    
    # PASSO 4: CALCULO DE OFFSET E LIMIT (Server-Side Pagination)
    # Exemplo: Para pagina=2 e limite=10 -> offset = (2 - 1) * 10 = 10 (pula os 10 primeiros)
    offset = (pagina - 1) * limite
    vendedores = query.offset(offset).limit(limite).all()
    
    # PASSO 5: CALCULO DO TOTAL DE PAGINAS
    total_paginas = math.ceil(total / limite) if total > 0 else 1
    
    # RESPOSTA (Backend -> Frontend)
    # Retorna a lista da pagina atual junto com os metadados de paginacao.
    return {
        "itens": vendedores,
        "total": total,
        "pagina": pagina,
        "limite": limite,
        "total_paginas": total_paginas
    }

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
