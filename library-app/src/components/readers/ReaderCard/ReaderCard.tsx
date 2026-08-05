import type { IReader } from '../../../types/reader.types';

interface ReaderCardProps {
  reader: IReader;
}

const ReaderCard = ({ reader }: ReaderCardProps) => {
  const { fullName, email, activeBooks } = reader;

  return (
    <div className="reader-card">
      <div className="reader-avatar">
        <span className="reader-avatar-emoji">👤</span>
      </div>
      <div className="reader-content">
        <h3 className="reader-name">{fullName}</h3>
        <p className="reader-email">{email}</p>
        <div className="reader-stats">
          <span className="reader-active-books">
            📚 Активных книг: <strong>{activeBooks.length}</strong>
          </span>
        </div>
        <button className="btn btn-primary">Профиль</button>
      </div>
    </div>
  );
};

export default ReaderCard;
