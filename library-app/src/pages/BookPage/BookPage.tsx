import BookList from '../../components/books/BookList/BookList';
import { mockBooks } from '../../mocks/books';
const BooksPage = () => {
  return (
    <div>
      <h1 className="page-title">Каталог книг</h1>
      <p className="page-subtitle">
        Всего книг: <strong>{mockBooks.length}</strong>
      </p>
      <BookList books={mockBooks} />
    </div>
  );
};
export default BooksPage;
