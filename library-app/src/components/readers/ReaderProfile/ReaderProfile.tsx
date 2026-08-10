import React, { useState } from 'react';
import type { IReader } from '../../../types/reader.types';
import type { IBook } from '../../../types/book.types';

interface ReaderProfileProps {
  reader: IReader;
  allBooks: IBook[];
  onBack: () => void;
  onIssue: (bookId: string, title: string, author: string) => void;
  onReturn: (bookId: string) => void;
}

const ReaderProfile: React.FC<ReaderProfileProps> = ({
  reader,
  allBooks,
  onBack,
  onIssue,
  onReturn,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const availableBooks = allBooks.filter((book) => {
    const isAlreadyActive = reader.activeBooks.some((ab) => ab.bookId === book.id);
    return book.isAvailable && !isAlreadyActive;
  });
  const foundBooks = searchQuery.trim() === ''
    ? []
    : availableBooks.filter((book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <div className="profile-wrapper">
      <button onClick={onBack} className="btn btn-secondary" style={{ marginBottom: '20px' }}>
        ← Назад к списку читателей
      </button>
      <div className="profile-header">
        <div className="profile-avatar">
          <span className="profile-avatar-emoji">👤</span>
        </div>
        <div className="profile-info">
          <h1 className="profile-name">{reader.fullName}</h1>
          <div className="profile-details">
            <span>✉️ {reader.email}</span>
            <span>📞 {reader.phone}</span>
            <span>📅 Регистрация: {new Date(reader.registrationDate).toLocaleDateString()}</span>
          </div>
          <div className="profile-stats">
            <span>📚 Всего книг в истории: <strong>{reader.booksHistory.length}</strong></span>
            <span>📖 Активных на руках: <strong>{reader.activeBooks.length}</strong></span>
          </div>
        </div>
      </div>
      <section className="profile-section">
        <h2 className="profile-section-title">📖 Активные книги</h2>
        <div className="active-books-list">
          {reader.activeBooks.length > 0 ? (
            reader.activeBooks.map((book) => (
              <div 
                key={book.bookId} 
                className="active-book-item" 
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}
              >
                <span>
                  "{book.title}" <span className="active-book-author">({book.author})</span>
                </span>
                <button 
                  onClick={() => onReturn(book.bookId)} 
                  className="btn btn-secondary" 
                  style={{ padding: '4px 8px', fontSize: '12px' }}
                >
                  Вернуть
                </button>
              </div>
            ))
          ) : (
            <p className="no-books-msg">Нет активных книг на руках.</p>
          )}
        </div>
      </section>
      <section className="profile-section" style={{ marginTop: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h2 className="profile-section-title" style={{ marginTop: 0 }}>📚 Выдача книг</h2>
        <div className="book-search" style={{ marginBottom: '15px' }}>
          <input
            type="text"
            className="book-search-input"
            placeholder="Поиск по названию..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        {searchQuery.trim() !== '' && (
          <div>
            <p style={{ fontSize: '14px', color: '#666' }}>Найдено: {foundBooks.length}</p>
            <div className="search-results" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {foundBooks.length > 0 ? (
                foundBooks.map((book) => (
                  <div 
                    key={book.id} 
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', border: '1px solid #eee', borderRadius: '4px' }}
                  >
                    <span><strong>"{book.title}"</strong> — {book.author}</span>
                    <button 
                      onClick={() => {
                        onIssue(book.id, book.title, book.author);
                        setSearchQuery('');
                      }} 
                      className="btn btn-primary"
                      style={{ padding: '4px 12px' }}
                    >
                      Выдать
                    </button>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: '14px', color: '#999' }}>Доступных книг не найдено</p>
              )}
            </div>
          </div>
        )}
      </section>
      <section className="profile-section" style={{ marginTop: '30px' }}>
        <h2 className="profile-section-title">📚 История чтения</h2>
        <div className="history-list">
          {reader.booksHistory.map((item, index) => {
            const isActive = !item.returnedDate;
            return (
              <div key={index} className="history-item">
                <span className="history-book">{item.title}</span>
                <span className="history-date">
                  Взята: {new Date(item.issuedDate).toLocaleDateString()}
                  {isActive 
                    ? ' (активна)' 
                    : `, Возвращена: ${new Date(item.returnedDate!).toLocaleDateString()}`
                  }
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default ReaderProfile;
