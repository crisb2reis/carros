// function MyButton() {
//   return (
//     <button type="button" className="pagination-btn">
//       I'm a button
//     </button>
//   );
// }

// function Teste() {
//   return (
//     <div>
//       <h1 className="display-10"> Welcome to my app</h1>
//       <MyButton />
//     </div>
//   );
// }

// const user = {
//   name: 'Hedy Lamarr',
//   imageUrl: 'https://react.dev/images/docs/scientists/yXOvdOSs.jpg',
//   imageSize: 200,
// };

// function Teste() {
//   return (
//     <>
//       <h1>{user.name}</h1>
//       <h2>{user.imageUrl}</h2>
//       <img
//         className="avatar"
//         src={user.imageUrl}
//         alt={'Photo of ' + user.name}
//         style={{
//           width: user.imageSize,
//           height: user.imageSize
//         }}
//       />
//     </>
//   );
// }

import React, { useState } from 'react';
import './Teste.css';

const products = [
  { title: 'Cabbage', isFruit: false, id: 1 },
  { title: 'Garlic', isFruit: false, id: 2 },
  { title: 'Apple', isFruit: true, id: 3 },
];

function Teste() {
  // Estado para armazenar o número de itens (começa zerado/escondido)
  const [quantidade, setQuantidade] = useState(null);

  // 1. Estado para armazenar e controlar o status atual (inicializa como 'Inativo')
  const [status, setStatus] = useState('Inativo');

  const listItems = products.map(product =>
    <li
      key={product.id}
      className={product.isFruit ? 'item-fruit' : 'item-vegetable'}
    >
      {product.id} - {product.title}
    </li>
  );

  // Função disparada ao clicar no botão de contagem
  const contarItens = () => {
    setQuantidade(products.length); // Guarda o tamanho do array no estado
  };

  // 2. Função para alternar o status entre 'Inativo' e 'Ativo'
  const alterarStatus = () => {
    setStatus(prevStatus => (prevStatus === 'Inativo' ? 'Ativo' : 'Inativo'));
  };

  return (
    <div className="container">
      <h3>Seção de Testes</h3>
      <ul>{listItems}</ul>
      
      <div className="button-group">
        <button onClick={contarItens} className="count-button">
          Contar Itens
        </button>

        {/* 3. Botão que dispara a função alterarStatus ao ser clicado */}
        <button 
          onClick={alterarStatus} 
          className={`status-button ${status === 'Ativo' ? 'btn-active' : 'btn-inactive'}`}
        >
          {status === 'Inativo' ? 'Ativar Status' : 'Desativar Status'}
        </button>
      </div>

      {/* Renderização condicional: só mostra a mensagem se 'quantidade' não for nula */}
      {quantidade !== null && (
        <p className="total-message">
          Total: Existem {quantidade} itens na lista!
        </p>
      )}

      {/* 4. Exibição visual do status atual */}
      <div className="status-box">
        <span>Status Atual: </span>
        <strong className={`status-badge ${status === 'Ativo' ? 'badge-active' : 'badge-inactive'}`}>
          {status}
        </strong>
      </div>
    </div>
  );
}

export default Teste;


