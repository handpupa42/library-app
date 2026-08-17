import BookCard from '../BookCard/BookCard';
import type { IBook } from '../../../types/book.types';

interface BookListProps {
  books: IBook[];
}

const BookList = ({ books }: BookListProps) => {
  return (
    <div className="card-grid">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
};

export default BookList;
