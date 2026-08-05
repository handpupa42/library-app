import Header from '../../components/common/Header/Header';
import Footer from '../../components/common/Footer/Footer';
import BookList from '../../components/books/BookList/BookList';
import { mockBooks } from '../../mocks/books';

const BooksPage = () => {
  return (
    <div className="page-wrapper">
      <Header />
      <main className="main-content">
        <div className="container">
          <h1 className="page-title">Каталог книг</h1>
          <p className="page-subtitle">
            Всего книг: <strong>{mockBooks.length}</strong>
          </p>
          <BookList books={mockBooks} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BooksPage;
