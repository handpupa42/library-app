import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReaderProfile from '../../components/readers/ReaderProfile/ReaderProfile';
import { mockReaders } from '../../mocks/readers';
import { mockBooks } from '../../mocks/books';

const ReaderProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const initialReader = mockReaders.find((r) => r.id === id) || mockReaders[0];
  const [reader, setReader] = useState(initialReader);

  if (!reader) return <div>Читатель не найден</div>;
  const handleIssueBook = (bookId: string, title: string, author: string) => {
    const today = new Date();

    const newActiveBook = { bookId, title, author, issuedDate: today };
    const newHistoryEntry = { bookId, title, author, issuedDate: today };

    setReader({
      ...reader,
      activeBooks: [...reader.activeBooks, newActiveBook],
      booksHistory: [...reader.booksHistory, newHistoryEntry],
    });
  };
  const handleReturnBook = (bookId: string) => {
    if (window.confirm('Принять возврат книги?')) {
      const today = new Date();
      setReader({
        ...reader,
        activeBooks: reader.activeBooks.filter((b) => b.bookId !== bookId),
        booksHistory: reader.booksHistory.map((h) =>
          h.bookId === bookId && !h.returnedDate
            ? { ...h, returnedDate: today }
            : h
        ),
      });
    }
  };

  return (
    <ReaderProfile
      reader={reader}
      allBooks={mockBooks}
      onBack={() => navigate(-1)}
      onIssue={handleIssueBook}
      onReturn={handleReturnBook}
    />
  );
};
export default ReaderProfilePage;