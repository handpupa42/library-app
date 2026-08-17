import { Link } from 'react-router-dom';
import type { IBook } from '../../../types/book.types';
interface BookCardProps {
  book: IBook;
}
const BookCard = ({ book }: BookCardProps) => {
  const { id, title, author, year, genre, isAvailable, description } = book;
  return (
    <article className="book-card">
      <div className="book-cover">
        <div className="book-cover-placeholder">
          <span className="book-cover-emoji">📖</span>
        </div>
        <span
          className={`book-status-badge badge ${
            isAvailable ? 'badge-available' : 'badge-unavailable'
          }`}
        >
          {isAvailable ? 'Доступна' : 'Выдана'}
        </span>
      </div>
      <div className="book-content">
        <h3 className="book-title">{title}</h3>
        <p className="book-author">{author}</p>
        <div className="book-meta">
          <span className="book-year">{year}</span>
          <span className="book-genre">{genre}</span>
        </div>
        {description && <p className="book-description">{description}</p>}
        <Link to={`/book/${id}`} className="btn btn-primary btn-block">
          Подробнее
        </Link>
      </div>
    </article>
  );
};
export default BookCard;
