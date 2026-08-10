import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks, selectAllBooks, selectBooksStatus, selectBooksError } from '../../store/books-slice';
import BookList from '../../components/books/BookList/BookList';
import type { AppDispatch } from '../../store/store';

const BooksPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const books = useSelector(selectAllBooks);
  const status = useSelector(selectBooksStatus);
  const error = useSelector(selectBooksError);

  useEffect(() => {
    if (status === 'idle') dispatch(fetchBooks());
  }, [status, dispatch]);

  if (status === 'loading') return <div>Загрузка...</div>;
  if (status === 'failed') return <div>Ошибка: {error}</div>;

  return (
    <div className="container">
      <h1>Каталог книг</h1>
      <BookList books={books} />
    </div>
  );
};
export default BooksPage;


