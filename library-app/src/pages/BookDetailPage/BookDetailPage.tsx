import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getBookById } from '../../store/books-slice';
import type { RootState } from '../../store/store';
import EditBookForm from '../../components/books/EditBookForm/EditBookForm';
const BookDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const book = useSelector((state: RootState) => {
    return getBookById(state, id);
  });
  
  const [isEditMode, setIsEditMode] = useState(false);
  if (!book) {
    return (
      <div className="not-found">
        <h1>Книга не найдена</h1>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate('/books')}
        >
          Назад к каталогу
        </button>
      </div>
    );
  }

  if (isEditMode) {
    return (
      <div className="book-detail-page">
        <EditBookForm
          book={book}
          onCancel={() => setIsEditMode(false)}
        />
      </div>
    );
  }
  return (
    <div className="book-detail-page">
      <button
        type="button"
        className="btn btn-secondary"
        onClick={() => navigate(-1)}
      >
        ← Назад
      </button>

      <div className="book-detail">
        <div className="book-cover-placeholder">
          <span className="book-cover-emoji">📖</span>
        </div>

        <div className="book-detail-content">
          <h1>{book.title}</h1>

          <p>
            <strong>Автор:</strong> {book.author}
          </p>

          <p>
            <strong>Год издания:</strong> {book.year}
          </p>

          <p>
            <strong>Жанр:</strong> {book.genre}
          </p>

          <p>
            <strong>Статус:</strong>{' '}
            {book.isAvailable ? 'Доступна' : 'Выдана'}
          </p>

          {book.description && (
            <p>
              <strong>Описание:</strong>{' '}
              {book.description}
            </p>
          )}

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsEditMode(true)}
          >
            Редактировать книгу
          </button>
        </div>
      </div>
    </div>
  );
};
export default BookDetailPage;