import type { IReader } from '../../../types/reader.types';

interface ReaderProfileProps {
  reader: IReader;
}

const ReaderProfile = ({ reader }: ReaderProfileProps) => {
  const { fullName, email, phone, registrationDate, booksHistory, activeBooks } = reader;

  return (
    <div className="profile-wrapper">
      <div className="profile-header">
        <div className="profile-avatar">
          <span className="profile-avatar-emoji">👤</span>
        </div>
        <div className="profile-info">
          <h1 className="profile-name">{fullName}</h1>
          <div className="profile-details">
            <span>✉️ {email}</span>
            <span>📞 {phone}</span>
            <span>📅 Регистрация: {registrationDate.toLocaleDateString()}</span>
          </div>
          <div className="profile-stats">
            <span>📚 Прочитано книг: <strong>{booksHistory.length}</strong></span>
            <span>📖 Активных книг: <strong>{activeBooks.length}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReaderProfile;
