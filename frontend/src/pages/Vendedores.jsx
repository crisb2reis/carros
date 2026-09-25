import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

// ENDEREÇO DO BACKEND
// Esta é a URL (porta de entrada) do nosso servidor backend. 
// O frontend usa este endereço para saber para onde enviar os pedidos.
// Agora o endereço está sendo puxado do arquivo .env de forma segura!
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

// CONSTANTE DE PAGINAÇÃO
// Define o número máximo de itens exibidos por página.
const ITENS_POR_PAGINA = 10;

function Vendedores() {
  const [vendedores, setVendedores] = useState([]);
  const [novoVendedor, setNovoVendedor] = useState({ nome: '', email: '', telefone: '' });

  // PASSO 4: ESTADO DOS FILTROS E METADADOS DA PAGINAÇÃO NO FRONTEND
  // Em vez de filtrar no navegador, guardamos os filtros e as informacoes de pagina enviadas pelo Backend.
  const [filtros, setFiltros] = useState({
    busca: ''
  });

  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalRegistros, setTotalRegistros] = useState(0);

  // O useEffect re-executa a busca no Backend sempre que a 'paginaAtual' ou o termo 'filtros.busca' mudam.
  useEffect(() => {
    carregarVendedores();
  }, [paginaAtual, filtros.busca]);

  const carregarVendedores = async () => {
    try {
      // PASSO 1: TRANSIÇÃO FRONTEND -> BACKEND (HTTP GET com Query Parameters / Params)
      // Enviamos os parametros 'busca', 'pagina' e 'limite' para o servidor através de Query Parameters.
      // O Axios monta a URL automaticamente: http://localhost:8081/vendedores/?busca=...&pagina=1&limite=10
      const resposta = await axios.get(`${API_URL}/vendedores/`, {
        params: {
          busca: filtros.busca,
          pagina: paginaAtual,
          limite: ITENS_POR_PAGINA
        }
      });
      
      // O Backend (FastAPI + SQLAlchemy) realiza o filtro SQL (ILIKE) e traz apenas os 10 itens fatiados (LIMIT/OFFSET).
      // Atualizamos nossos estados locais com o pacote de resposta fornecido pelo servidor.
      setVendedores(resposta.data.itens);
      setTotalPaginas(resposta.data.total_paginas);
      setTotalRegistros(resposta.data.total);
    } catch (error) {
      console.error("Erro ao buscar vendedores:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      // PASSO 2: TRANSIÇÃO FRONTEND -> BACKEND -> BANCO DE DADOS (Criação / POST)
      // 1. FRONTEND: Empacota os dados digitados pelo usuário que estão no estado 'novoVendedor'.
      // 2. REDE: O Axios envia esse "pacote" via HTTP POST para a URL do Backend.
      // 3. BACKEND: Recebe o pacote (no body da requisição), verifica se está no formato correto e conecta ao banco de dados.
      // 4. BANCO DE DADOS: O Backend executa uma instrução (ex: INSERT INTO vendedores...) para salvar definitivamente os dados no disco.
      await axios.post(`${API_URL}/vendedores/`, novoVendedor);
      
      setNovoVendedor({ nome: '', email: '', telefone: '' }); // Limpa o formulário na tela
      carregarVendedores(); // Pede ao backend a lista recém-atualizada do banco de dados para mostrar na tela
    } catch (error) {
      console.error("Erro ao cadastrar vendedor:", error);
    }
  };

  const deletarVendedor = async (id) => {
    try {
      // PASSO 3: TRANSIÇÃO FRONTEND -> BACKEND -> BANCO DE DADOS (Exclusão / DELETE)
      // 1. FRONTEND: Envia o pedido HTTP indicando o método DELETE e passa na própria URL o identificador (id) do vendedor.
      // 2. BACKEND: Recebe esse ID na sua rota de exclusão e se conecta ao Banco de Dados.
      // 3. BANCO DE DADOS: O backend traduz o pedido para um comando SQL (ex: DELETE FROM vendedores WHERE id = X) e remove o registro.
      // 4. Após o banco deletar, o backend devolve uma resposta de sucesso para o frontend.
      await axios.delete(`${API_URL}/vendedores/${id}`);
      
      // Assim que o vendedor é excluído no backend/banco, pedimos a lista atualizada para refazer a tela sem ele.
      carregarVendedores();
    } catch (error) {
      console.error("Erro ao deletar vendedor:", error);
    }
  };

  // MANIPULAÇÃO DE FILTROS
  // Ao alterar o filtro, voltamos para a primeira página (paginaAtual = 1) para evitar pedir dados de paginas inexistentes.
  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
    setPaginaAtual(1);
  };

  const limparFiltros = () => {
    setFiltros({ busca: '' });
    setPaginaAtual(1);
  };

  // NAVEGAÇÃO DE PÁGINAS (Dispara a busca de uma nova página no Backend)
  const mudarPagina = (novaPagina) => {
    if (novaPagina >= 1 && novaPagina <= totalPaginas) {
      setPaginaAtual(novaPagina);
    }
  };

  return (
    <div className="crud-section">
      <h2>Gerenciar Vendedores</h2>
      
      <form onSubmit={handleSubmit} className="crud-form">
        <input type="text" placeholder="Nome" value={novoVendedor.nome} onChange={e => setNovoVendedor({...novoVendedor, nome: e.target.value})} required />
        <input type="email" placeholder="Email" value={novoVendedor.email} onChange={e => setNovoVendedor({...novoVendedor, email: e.target.value})} required />
        <input type="text" placeholder="Telefone" value={novoVendedor.telefone} onChange={e => setNovoVendedor({...novoVendedor, telefone: e.target.value})} required />
        <button type="submit">Cadastrar Vendedor</button>
      </form>

      {/* SEÇÃO DE FILTROS (SERVER-SIDE) */}
      <div className="filters-section">
        <div className="filters-header">
          <h3>Filtrar Vendedores</h3>
          <button type="button" className="btn-clear-filters" onClick={limparFiltros}>
            Limpar Filtros
          </button>
        </div>

        <div className="filters-grid">
          <div className="filter-group">
            <label htmlFor="filter-vendedor-busca">Busca Geral:</label>
            <input 
              id="filter-vendedor-busca"
              type="text" 
              name="busca" 
              placeholder="Buscar por nome, email ou telefone..." 
              value={filtros.busca} 
              onChange={handleFiltroChange} 
            />
          </div>
        </div>
      </div>

      {/* TABELA PAGINADA DE VENDEDORES (SERVER-SIDE) */}
      {vendedores.length === 0 ? (
        <p className="no-results">Nenhum vendedor encontrado com os filtros selecionados.</p>
      ) : (
        <>
          <table className="crud-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Telefone</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {vendedores.map(vendedor => (
                <tr key={vendedor.id}>
                  <td>{vendedor.nome}</td>
                  <td>{vendedor.email}</td>
                  <td>{vendedor.telefone}</td>
                  <td>
                    <button onClick={() => deletarVendedor(vendedor.id)}>Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* CONTROLES DE PAGINAÇÃO */}
          <div className="pagination-container">
            <button 
              type="button" 
              className="pagination-btn"
              disabled={paginaAtual === 1}
              onClick={() => mudarPagina(paginaAtual - 1)}
            >
              Anterior
            </button>
            
            <span className="pagination-info">
              Página {paginaAtual} de {totalPaginas} ({totalRegistros} vendedor{totalRegistros !== 1 ? 'es' : ''})
            </span>

            <button 
              type="button" 
              className="pagination-btn"
              disabled={paginaAtual === totalPaginas}
              onClick={() => mudarPagina(paginaAtual + 1)}
            >
              Próxima
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Vendedores;

