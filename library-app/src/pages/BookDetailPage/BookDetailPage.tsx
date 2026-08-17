import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getBookById } from '../../store/books-slice';
import type { RootState } from '../../store/store';
import EditBookForm from '../../components/books/EditBookForm/EditBookForm';

const BookDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const book = useSelector((state: RootState) => getBookById(state, id));
  const [isEditMode, setIsEditMode] = useState(false);
  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/books');
    }
  };
  if (!book) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '50px 0' }}>
        <h1>Книга не найдена</h1>
        <button type="button" className="btn btn-secondary" onClick={() => navigate('/books')}>
          Назад к каталогу
        </button>
      </div>
    );
  }
  if (isEditMode) {
    return (
      <div className="container" style={{ padding: '20px 0' }}>
        <EditBookForm book={book} onCancel={() => setIsEditMode(false)} />
      </div>
    );
  }
  return (
    <div className="container" style={{ padding: '20px 0' }}>
      <button
        type="button"
        className="btn btn-secondary"
        onClick={handleGoBack}
        style={{ marginBottom: '20px' }}
      >
        ← Назад
      </button>
      <div className="book-detail" style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
        <div className="book-cover-placeholder" style={{ width: '200px', height: '260px', fontSize: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f0f0', borderRadius: '8px' }}>
          📖
        </div>
        <div className="book-detail-content">
          <h1>{book.title}</h1>
          <p><strong>Автор:</strong> {book.author}</p>
          <p><strong>Год издания:</strong> {book.year}</p>
          <p><strong>Жанр:</strong> {book.genre}</p>
          <p><strong>Статус:</strong> {book.isAvailable ? 'Доступна' : 'Выдана'}</p>
          {book.description && (
            <p style={{ marginTop: '15px' }}><strong>Описание:</strong> {book.description}</p>
          )}
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsEditMode(true)}
            style={{ marginTop: '20px' }}
          >
            Редактировать книгу
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;
