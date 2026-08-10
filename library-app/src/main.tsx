import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/style.css';
import './styles/books.css';
import './styles/readers.css';
import './styles/profile.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>   {/* ← Оборачиваем всё приложение */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);