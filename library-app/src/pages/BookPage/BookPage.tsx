import { useSelector } from 'react-redux';
import BookList from '../../components/books/BookList/BookList';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import AddBookModal from '../../components/books/AddBooksModal/AddBooksModal';
import { fetchBooks, selectAllBooks, selectBooksStatus } from '../../store/books-slice';
import type { AppDispatch } from '../../store/store';

const BooksPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const books = useSelector(selectAllBooks);
  const status = useSelector(selectBooksStatus);
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchBooks());
    }
  }, [status, dispatch]);

  return (
    <div>
      <div 
        className="page-header" 
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}
      >
        <h1 className="page-title">Каталог книг</h1>
        <button
          className="btn btn-primary"
          onClick={() => setIsModalOpen(true)}
        >
          + Добавить книгу
        </button>
      </div>
      {status === 'loading' && <p>⌛️ Загрузка книг с сервера...</p>}
      
      {status === 'succeeded' && <BookList books={books} />}
      {status === 'succeeded' && books.length === 0 && (
        <p>Книг пока нет. Добавьте первую книгу!</p>
      )}
      <AddBookModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default BooksPage;



