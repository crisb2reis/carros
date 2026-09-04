import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

// 🌐 ENDEREÇO DO BACKEND
// Esta é a URL (porta de entrada) do nosso servidor backend. 
// O frontend usa este endereço para saber para onde enviar os pedidos (buscar, salvar ou deletar dados).
const API_URL = 'http://localhost:8081';

function Vendedores() {
  const [vendedores, setVendedores] = useState([]);
  const [novoVendedor, setNovoVendedor] = useState({ nome: '', email: '', telefone: '' });

  useEffect(() => {
    carregarVendedores();
  }, []);

  const carregarVendedores = async () => {
    try {
      // 🔄 PASSO 1: TRANSIÇÃO FRONTEND -> BACKEND (Leitura / GET)
      // Aqui usamos o Axios, que age como um "mensageiro" HTTP. 
      // Ele pega a nossa requisição (GET) e a transporta pela rede até a porta do Backend (API_URL/vendedores/).
      // O Backend atende a requisição, se conecta ao BANCO DE DADOS e executa uma query (ex: SELECT * FROM vendedores).
      // Em seguida, o Backend pega as informações do banco, converte para um formato que o frontend entenda (JSON),
      // e entrega de volta na variável 'resposta'.
      const resposta = await axios.get(`${API_URL}/vendedores/`);
      
      // O frontend recebe os dados enviados pelo banco via backend e atualiza a interface gráfica.
      setVendedores(resposta.data);
    } catch (error) {
      console.error("Erro ao buscar vendedores:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      // 🚀 PASSO 2: TRANSIÇÃO FRONTEND -> BACKEND -> BANCO DE DADOS (Criação / POST)
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
      // 🗑️ PASSO 3: TRANSIÇÃO FRONTEND -> BACKEND -> BANCO DE DADOS (Exclusão / DELETE)
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

  return (
    <div className="crud-section">
      <h2>Gerenciar Vendedores</h2>
      
      <form onSubmit={handleSubmit} className="crud-form">
        <input type="text" placeholder="Nome" value={novoVendedor.nome} onChange={e => setNovoVendedor({...novoVendedor, nome: e.target.value})} required />
        <input type="email" placeholder="Email" value={novoVendedor.email} onChange={e => setNovoVendedor({...novoVendedor, email: e.target.value})} required />
        <input type="text" placeholder="Telefone" value={novoVendedor.telefone} onChange={e => setNovoVendedor({...novoVendedor, telefone: e.target.value})} required />
        <button type="submit">Cadastrar Vendedor</button>
      </form>

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
    </div>
  );
}

export default Vendedores;

