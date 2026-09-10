import React, { useState, useEffect } from 'react';
import axios from 'axios';

// ENDEREÇO DO BACKEND
// Esta é a URL (porta de entrada) do nosso servidor backend. 
// O frontend usa este endereço para saber para onde enviar os pedidos (buscar, salvar ou deletar dados).
const API_URL = 'http://localhost:8081';

function Carros() {
  const [carros, setCarros] = useState([]);
  const [novoCarro, setNovoCarro] = useState({ modelo: '', marca: '', ano: '', preco: '', imagem: '' });

  // PASSO 4: ESTADO DOS FILTROS (Gerenciamento de Entradas de Busca)
  // Criamos um objeto de estado para guardar os critérios selecionados/digitados pelo usuário na tela.
  // Sempre que o usuário altera um campo de filtro, o React re-renderiza o componente com o novo estado.
  const [filtros, setFiltros] = useState({
    busca: '',
    marca: '',
    precoMaximo: '',
    anoMinimo: ''
  });

  useEffect(() => {
    carregarCarros();
  }, []);

  const carregarCarros = async () => {
    try {
      // PASSO 1: TRANSIÇÃO FRONTEND -> BACKEND (Leitura / GET)
      // Aqui usamos o Axios, que age como um "mensageiro" HTTP. 
      // Ele pega a nossa requisição (GET) e a transporta pela rede até a porta do Backend (API_URL/carros/).
      // O Backend atende a requisição, se conecta ao BANCO DE DADOS e executa uma query (ex: SELECT * FROM carros).
      // Em seguida, o Backend pega as informações do banco, converte para um formato que o frontend entenda (JSON),
      // e entrega de volta na variável 'resposta'.
      const resposta = await axios.get(`${API_URL}/carros/`);
      
      // O frontend recebe os dados enviados pelo banco via backend e atualiza a interface gráfica.
      setCarros(resposta.data);
    } catch (error) {
      console.error("Erro ao buscar carros:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      // PASSO 2: TRANSIÇÃO FRONTEND -> BACKEND -> BANCO DE DADOS (Criação / POST)
      // 1. FRONTEND: Empacota os dados digitados pelo usuário que estão no estado 'novoCarro'.
      // 2. REDE: O Axios envia esse "pacote" via HTTP POST para a URL do Backend.
      // 3. BACKEND: Recebe o pacote (no body da requisição), verifica se está no formato correto e conecta ao banco de dados.
      // 4. BANCO DE DADOS: O Backend executa uma instrução (ex: INSERT INTO carros...) para salvar definitivamente os dados no disco.
      await axios.post(`${API_URL}/carros/`, novoCarro);
      
      setNovoCarro({ modelo: '', marca: '', ano: '', preco: '', imagem: '' }); // Limpa o formulário na tela
      carregarCarros(); // Pede ao backend a lista recém-atualizada do banco de dados para mostrar na tela
    } catch (error) {
      console.error("Erro ao cadastrar carro:", error);
    }
  };

  const deletarCarro = async (id) => {
    try {
      // PASSO 3: TRANSIÇÃO FRONTEND -> BACKEND -> BANCO DE DADOS (Exclusão / DELETE)
      // 1. FRONTEND: Envia o pedido HTTP indicando o método DELETE e passa na própria URL o identificador (id) do carro.
      // 2. BACKEND: Recebe esse ID na sua rota de exclusão e se conecta ao Banco de Dados.
      // 3. BANCO DE DADOS: O backend traduz o pedido para um comando SQL (ex: DELETE FROM carros WHERE id = X) e remove o registro.
      // 4. Após o banco deletar, o backend devolve uma resposta de sucesso para o frontend.
      await axios.delete(`${API_URL}/carros/${id}`);
      
      // Assim que o carro é excluído no backend/banco, pedimos a lista atualizada para refazer a tela sem ele.
      carregarCarros();
    } catch (error) {
      console.error("Erro ao deletar carro:", error);
    }
  };

  // MANIPULAÇÃO DE MUDANÇA NOS CAMPOS DE FILTRO
  // Atualiza dinamicamente o estado 'filtros' com base no 'name' e 'value' do input que disparou o evento.
  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prevFiltros => ({
      ...prevFiltros,
      [name]: value
    }));
  };

  // LIMPEZA DOS FILTROS
  // Reseta todos os campos de filtro para o valor inicial (vazio).
  const limparFiltros = () => {
    setFiltros({
      busca: '',
      marca: '',
      precoMaximo: '',
      anoMinimo: ''
    });
  };

  // PASSO 5: ESTADO DERIVADO (Filtragem Dinâmica com Array.prototype.filter)
  // CONCEITO IMPORTANTE PARA OS ALUNOS:
  // Não criamos um segundo useState para salvar os carros filtrados.
  // Em React, sempre que puder calcular um valor com base nos estados existentes (carros + filtros),
  // calcule-o diretamente durante a renderização. Isso é chamado de "Estado Derivado" (Derived State).
  // Isso economiza memória, evita desassincronismo de dados e mantém o código limpo.
  const carrosFiltrados = carros.filter(carro => {
    // 1. Filtro por Busca Geral (pesquisa termo na marca ou modelo, ignorando maiúsculas/minúsculas)
    const atendeBusca = !filtros.busca || 
      carro.marca.toLowerCase().includes(filtros.busca.toLowerCase()) ||
      carro.modelo.toLowerCase().includes(filtros.busca.toLowerCase());

    // 2. Filtro por Marca Específica
    const atendeMarca = !filtros.marca || 
      carro.marca.toLowerCase() === filtros.marca.toLowerCase();

    // 3. Filtro por Preço Máximo
    const atendePreco = !filtros.precoMaximo || 
      Number(carro.preco) <= Number(filtros.precoMaximo);

    // 4. Filtro por Ano Mínimo
    const atendeAno = !filtros.anoMinimo || 
      Number(carro.ano) >= Number(filtros.anoMinimo);

    // Retorna true somente se o objeto 'carro' atender a TODAS as condições ativas.
    return atendeBusca && atendeMarca && atendePreco && atendeAno;
  });

  // Extrai uma lista de marcas únicas já cadastradas para popular o campo de seleção (select).
  const marcasUnicas = [...new Set(carros.map(c => c.marca).filter(Boolean))];

  return (
    <main className="crud-section">
      <h2>Gerenciar Catálogo de Carros</h2>
      
      <form onSubmit={handleSubmit} className="crud-form">
        <input type="text" placeholder="Marca" value={novoCarro.marca} onChange={e => setNovoCarro({...novoCarro, marca: e.target.value})} required />
        <input type="text" placeholder="Modelo" value={novoCarro.modelo} onChange={e => setNovoCarro({...novoCarro, modelo: e.target.value})} required />
        <input type="number" placeholder="Ano" value={novoCarro.ano} onChange={e => setNovoCarro({...novoCarro, ano: e.target.value})} required />
        <input type="number" placeholder="Preço" value={novoCarro.preco} onChange={e => setNovoCarro({...novoCarro, preco: e.target.value})} required />
        <input type="text" placeholder="URL da Imagem" value={novoCarro.imagem} onChange={e => setNovoCarro({...novoCarro, imagem: e.target.value})} />
        <button type="submit">Cadastrar Carro</button>
      </form>

      {/* SEÇÃO DE FILTROS DE BUSCA */}
      {/* Interface interativa que captura as opções de filtro do usuário */}
      <div className="filters-section">
        <div className="filters-header">
          <h3>Filtrar Catálogo</h3>
          <button type="button" className="btn-clear-filters" onClick={limparFiltros}>
            Limpar Filtros
          </button>
        </div>

        <div className="filters-grid">
          <div className="filter-group">
            <label htmlFor="filter-busca">Busca por Texto:</label>
            <input 
              id="filter-busca"
              type="text" 
              name="busca" 
              placeholder="Buscar por marca ou modelo..." 
              value={filtros.busca} 
              onChange={handleFiltroChange} 
            />
          </div>

          <div className="filter-group">
            <label htmlFor="filter-marca">Marca:</label>
            <select 
              id="filter-marca"
              name="marca" 
              value={filtros.marca} 
              onChange={handleFiltroChange}
            >
              <option value="">Todas as marcas</option>
              {marcasUnicas.map(marca => (
                <option key={marca} value={marca}>{marca}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="filter-preco">Preço Máximo (R$):</label>
            <input 
              id="filter-preco"
              type="number" 
              name="precoMaximo" 
              placeholder="Ex: 80000" 
              value={filtros.precoMaximo} 
              onChange={handleFiltroChange} 
            />
          </div>

          <div className="filter-group">
            <label htmlFor="filter-ano">Ano Mínimo:</label>
            <input 
              id="filter-ano"
              type="number" 
              name="anoMinimo" 
              placeholder="Ex: 2018" 
              value={filtros.anoMinimo} 
              onChange={handleFiltroChange} 
            />
          </div>
        </div>
      </div>

      {/* RENDERIZAÇÃO DA TABELA (Exibe apenas os carros filtrados) */}
      {carrosFiltrados.length === 0 ? (
        <p className="no-results">Nenhum veículo encontrado com os filtros selecionados.</p>
      ) : (
        <table className="crud-table">
          <thead>
            <tr>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Ano</th>
              <th>Preço (R$)</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {carrosFiltrados.map(carro => (
              <tr key={carro.id}>
                <td>{carro.marca}</td>
                <td>{carro.modelo}</td>
                <td>{carro.ano}</td>
                <td>{carro.preco}</td>
                <td>
                  <button onClick={() => deletarCarro(carro.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* CARROSSEL DE VEÍCULOS */}
      {/* Exibe visualmente os veículos que atendem aos filtros */}
      <div className="carousel-container">
        <h3 className="carousel-title">Galeria de Veículos</h3>
        {carrosFiltrados.length === 0 ? (
          <p className="no-results">Nenhum veículo para exibir na galeria.</p>
        ) : (
          <div className="carousel-track">
            {carrosFiltrados.map(carro => (
              <div className="carousel-card" key={`card-${carro.id}`}>
                <div className="carousel-image">
                  {carro.imagem ? (
                    <img src={carro.imagem} alt={`${carro.marca} ${carro.modelo}`} />
                  ) : (
                    <div className="no-image">Sem foto</div>
                  )}
                </div>
                <div className="carousel-info">
                  <h4>{carro.marca} {carro.modelo}</h4>
                  <p className="car-year">Ano: {carro.ano}</p>
                  <p className="car-price">R$ {carro.preco}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default Carros;

