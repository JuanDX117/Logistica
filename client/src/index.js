import React from 'react';
import ReactDOM from 'react-dom/client'; // Cambiar a react-dom/client
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')); // Usar createRoot
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
