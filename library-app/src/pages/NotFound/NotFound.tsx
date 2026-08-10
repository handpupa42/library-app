import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', padding: '50px 0' }}>
      <h1>404 — Страница не найдена</h1>
      <p style={{ marginBottom: '20px' }}>К сожалению, запрашиваемая страница не существует.</p>
      <Link to="/books" className="btn btn-primary">
        Вернуться в каталог книг
      </Link>
    </div>
  );
};

export default NotFound;