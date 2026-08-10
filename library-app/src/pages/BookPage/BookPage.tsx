import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import BookList from '../../components/books/BookList/BookList';
import AddBookModal from '../../components/books/AddBooksModal/AddBooksModal';

import {
  fetchBooks,
  getAllBooks, // Берем все книги
  selectBooksError,
  selectBooksStatus,
} from '../../store/books-slice';

import type {
  AppDispatch
} from '../../store/store';
const BooksPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const books = useSelector(getAllBooks);
  const status = useSelector(selectBooksStatus);
  const error = useSelector(selectBooksError);
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchBooks());
    }
  }, [status, dispatch]);
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );
  if (status === 'loading') {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '50px 0' }}>
        <h2>⌛ Загрузка каталога...</h2>
      </div>
    );
  }
  if (status === 'failed') {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '50px 0' }}>
        <h2>❌ Ошибка загрузки: {error}</h2>
        <p>Пожалуйста, убедитесь, что json-server запущен на порту 3000.</p>
      </div>
    );
  }
  return (
    <div className="container">
      <h1 className="page-title">Каталог книг</h1>

      <p className="page-subtitle">
        Всего книг в базе: <strong>{books.length}</strong>
      </p>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => setIsModalOpen(true)}
        style={{ marginBottom: '20px' }}
      >
        + Добавить книгу
      </button>
      <div className="page-toolbar">
        <div className="book-search">
          <input
            type="text"
            className="book-search-input"
            placeholder="🔍 Поиск по названию, автору или жанру..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="book-search-clear"
              onClick={() => setSearchQuery('')}
            >
              ✕
            </button>
          )}
        </div>
        <span className="search-result-count">Найдено: {filteredBooks.length}</span>
      </div>
      {status === 'succeeded' && books.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '30px 0' }}>
          <h3>Нет книг для отображения.</h3>
          <p>Попробуйте добавить новую книгу.</p>
        </div>
      ) : (
        <BookList books={filteredBooks} />
      )}
      {isModalOpen && (
        <AddBookModal handleClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};
export default BooksPage;



