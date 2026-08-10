import { useState } from 'react';
import { useSelector } from 'react-redux';
import BookList from '../../components/books/BookList/BookList';
import AddBookModal from '../../components/books/AddBooksModal/AddBooksModal';
import { getAllBooks } from '../../store/books-slice';
const BooksPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const books = useSelector(getAllBooks);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h1 className="page-title">Каталог книг</h1>

      <p className="page-subtitle">
        Всего книг: <strong>{books.length}</strong>
      </p>

      <button
        type="button"
        className="btn btn-primary"
        onClick={() => setIsModalOpen(true)}
      >
        + Добавить книгу
      </button>

      <div className="page-toolbar">
        <div className="book-search">
          <input
            type="text"
            className="book-search-input"
            placeholder="🔍 Поиск по названию или автору..."
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
        <span className="search-result-count">
          Найдено: {filteredBooks.length}
        </span>
      </div>
      <BookList books={filteredBooks} />
      {isModalOpen && (
        <AddBookModal
          handleClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};
export default BooksPage;

