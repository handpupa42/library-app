
import { useState } from 'react';
import type { IReader } from '../../../types/reader.types';
import type { IBook } from '../../../types/book.types';

interface ReaderProfileProps {
  reader: IReader;
  allBooks: IBook[];
  onBack: () => void;
  onIssue: (bookId: string) => void;
  onReturn: (bookId: string) => void;
}
const ReaderProfile = ({ reader, allBooks, onBack, onIssue, onReturn }: ReaderProfileProps) => {
  const [query, setQuery] = useState('');
  const availableBooks = allBooks.filter(b => b.isAvailable && !reader.activeBooks.includes(b.id));
  const found = query.trim() ? availableBooks.filter(b => b.title.toLowerCase().includes(query.toLowerCase())) : [];

  return (
    <div className="profile-wrapper">
      <button onClick={onBack} className="btn btn-secondary" style={{ marginBottom: '20px' }}>← Назад</button>
      
      <div className="profile-header">
        <h1>{reader.fullName}</h1>
        <p>✉️ {reader.email} | 📞 {reader.phone}</p>
      </div>

      <section className="profile-section">
        <h2>📖 Активные книги</h2>
        {reader.activeBooks.map(id => {
          const book = allBooks.find(b => b.id === id);
          return (
            <div key={id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>{book ? `"${book.title}" (${book.author})` : 'Загрузка...'}</span>
              <button onClick={() => onReturn(id)} className="btn btn-secondary">Вернуть</button>
            </div>
          );
        })}
      </section>

      <section className="profile-section" style={{ border: '1px solid #ddd', padding: '15px', marginTop: '20px' }}>
        <h2>📚 Выдача книг</h2>
        <input type="text" placeholder="Поиск..." value={query} onChange={e => setQuery(e.target.value)} style={{ width: '100%', padding: '8px' }} />
        {found.map(b => (
          <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
            <span>"{b.title}" — {b.author}</span>
            <button onClick={() => { onIssue(b.id); setQuery(''); }} className="btn btn-primary">Выдать</button>
          </div>
        ))}
      </section>
    </div>
  );
};

export default ReaderProfile;

