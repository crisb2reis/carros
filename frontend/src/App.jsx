import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; 

const API_URL = 'http://localhost:8000';

function App() {
  const [carros, setCarros] = useState([]);
  const [novoCarro, setNovoCarro] = useState({ modelo: '', marca: '', ano: '', preco: '' });

  useEffect(() => {
    carregarCarros();
  }, []);

  const carregarCarros = async () => {
    try {
      const resposta = await axios.get(`${API_URL}/carros/`);
      setCarros(resposta.data);
    } catch (error) {
      console.error("Erro ao buscar carros:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      await axios.post(`${API_URL}/carros/`, novoCarro);
      setNovoCarro({ modelo: '', marca: '', ano: '', preco: '' }); 
      carregarCarros(); 
    } catch (error) {
      console.error("Erro ao cadastrar carro:", error);
    }
  };

  const deletarCarro = async (id) => {
    try {
      await axios.delete(`${API_URL}/carros/${id}`);
      carregarCarros();
    } catch (error) {
      console.error("Erro ao deletar carro:", error);
    }
  };

  return (
    <div className="landing-page">
      <header className="hero">
        <h1>Guia Definitivo de Compra de Carros</h1>
        <p>Acelere suas vendas e encontre o carro dos seus sonhos em nossa plataforma integrada.</p>
      </header>

      <main className="crud-section">
        <h2>Gerenciar Catálogo de Carros</h2>
        
        <form onSubmit={handleSubmit} className="crud-form">
          <input type="text" placeholder="Marca" value={novoCarro.marca} onChange={e => setNovoCarro({...novoCarro, marca: e.target.value})} required />
          <input type="text" placeholder="Modelo" value={novoCarro.modelo} onChange={e => setNovoCarro({...novoCarro, modelo: e.target.value})} required />
          <input type="number" placeholder="Ano" value={novoCarro.ano} onChange={e => setNovoCarro({...novoCarro, ano: e.target.value})} required />
          <input type="number" placeholder="Preço" value={novoCarro.preco} onChange={e => setNovoCarro({...novoCarro, preco: e.target.value})} required />
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
      </main>
    </div>
  );
}

export default App;
