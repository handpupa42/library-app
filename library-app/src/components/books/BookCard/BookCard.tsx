import type { IBook } from '../../../types/book.types';

interface BookCardProps {
  book: IBook;
}

const BookCard = ({ book }: BookCardProps) => {
  const { title, author, year, genre, isAvailable, description } = book;

  const statusClass = isAvailable ? 'badge-available' : 'badge-unavailable';
  const statusText = isAvailable ? 'Доступна' : 'Выдана';

  return (
    <article className="book-card">
      <div className="book-cover">
        <div className="book-cover-placeholder">
          <span className="book-cover-emoji">📖</span>
        </div>
        <span className={`book-status-badge badge ${statusClass}`}>
          {statusText}
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
        <button className="btn btn-primary btn-block">Подробнее</button>
      </div>
    </article>
  );
};

export default BookCard;
