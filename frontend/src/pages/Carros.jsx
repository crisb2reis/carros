import React, { useState, useEffect } from 'react';
import axios from 'axios';

// ENDEREÇO DO BACKEND
// Esta é a URL (porta de entrada) do nosso servidor backend. 
// O frontend usa este endereço para saber para onde enviar os pedidos (buscar, salvar ou deletar dados).
const API_URL = 'http://localhost:8081';

function Carros() {
  const [carros, setCarros] = useState([]);
  const [novoCarro, setNovoCarro] = useState({ modelo: '', marca: '', ano: '', preco: '', imagem: '' });

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
          {carros.map(carro => (
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

      {/* CARROSSEL DE VEÍCULOS */}
      {/* Exibe os carros de forma visual logo abaixo do cadastro */}
      <div className="carousel-container">
        <h3 className="carousel-title">Galeria de Veículos</h3>
        <div className="carousel-track">
          {carros.map(carro => (
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
      </div>
    </main>
  );
}

export default Carros;

