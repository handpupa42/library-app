import { useParams, useNavigate } from 'react-router-dom';
import { mockBooks } from '../../mocks/books';

const BookDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const book = mockBooks.find((b) => b.id === id);

  if (!book) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <h2>Книга не найдена</h2>
        <button onClick={() => navigate('/books')} className="btn btn-secondary">
          Назад к каталогу
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px 0' }}>
      <button onClick={() => navigate(-1)} className="btn btn-secondary" style={{ marginBottom: '20px' }}>
        ← Назад
      </button>

      <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
        <div className="book-cover-placeholder" style={{ width: '200px', height: '260px', fontSize: '60px' }}>
          📖
        </div>
        <div>
          <h1 className="page-title" style={{ textAlign: 'left', marginBottom: '10px' }}>
            {book.title}
          </h1>
          <p style={{ fontSize: '18px', color: '#666', marginBottom: '15px' }}>
            Автор: <strong>{book.author}</strong>
          </p>
          <div className="book-meta" style={{ marginBottom: '15px' }}>
            <span>Год: {book.year}</span>
            <span>Жанр: {book.genre}</span>
            <span className={`badge ${book.isAvailable ? 'badge-available' : 'badge-unavailable'}`}>
              {book.isAvailable ? 'Доступна' : 'Выдана'}
            </span>
          </div>
          <p style={{ fontSize: '16px', lineHeight: '1.6', marginTop: '20px' }}>
            {book.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;