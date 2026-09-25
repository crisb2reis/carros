import React from 'react';
import Carros from './Carros';
import Vendedores from './Vendedores';
import Compradores from './Compradores';
import Teste from './Teste';
import '../App.css';

function Home() {
  return (
    <div className="landing-wrapper">
      {/* SEÇÃO 1: Navbar / Cabeçalho */}
      <nav className="navbar">
        <div className="nav-logo">Vanguarda Auto</div>
        <ul className="nav-links">
          <li><a href="#sobre">Sobre</a></li>
          <li><a href="#carros">Veículos</a></li>
          <li><a href="#equipe">Equipe</a></li>
          <li><a href="#clientes">Clientes</a></li>
        </ul>
      </nav>

      {/* SEÇÃO 2: Hero */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Sua Plataforma de Gestão Automotiva</h1>
          <p>Organize seus veículos, equipe de vendas e clientes em um único lugar. A solução completa para o mercado automotivo.</p>
          <a href="#carros" className="cta-button">Começar Agora</a>
        </div>
      </section>

      {/* SEÇÃO 3: Sobre */}
      <section id="sobre" className="about-section">
        <div className="container">
          <h2>Por que usar nossa plataforma?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Gestão de Estoque</h3>
              <p>Mantenha seu catálogo de veículos sempre atualizado e disponível para vendas.</p>
            </div>
            <div className="feature-card">
              <h3>Controle de Vendedores</h3>
              <p>Gerencie sua equipe de forma centralizada, monitorando contatos e acessos.</p>
            </div>
            <div className="feature-card">
              <h3>Carteira de Clientes</h3>
              <p>Fidelize seus compradores com um cadastro limpo e organizado.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 4: Carros (CRUD) */}
      <section id="carros" className="crud-container bg-light">
        <div className="container">
          <div className="section-header">
            <h2>Inventário de Veículos</h2>
            <p>Cadastre e gerencie a frota disponível para venda.</p>
          </div>
          <Carros />
        </div>
      </section>

      {/* SEÇÃO 5: Vendedores (CRUD) */}
      <section id="equipe" className="crud-container bg-white">
        <div className="container">
          <div className="section-header">
            <h2>Nossa Equipe de Vendas</h2>
            <p>Gerenciamento ativo dos seus vendedores e consultores.</p>
          </div>
          <Vendedores />
        </div>
      </section>

      {/* SEÇÃO 6: Compradores (CRUD) */}
      <section id="clientes" className="crud-container bg-light">
        <div className="container">
          <div className="section-header">
            <h2>Carteira de Compradores</h2>
            <p>Controle dos clientes e histórico de contatos.</p>
          </div>
          <Compradores />
        </div>
      </section>

      {/* SEÇÃO 7: Testes */}
      <section id="testes" className="crud-container bg-white">
        <Teste />
      </section>

      {/* SEÇÃO 8: Footer */}
      <footer className="footer-section">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Vanguarda Auto - Plataforma Educacional de Gestão</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;

