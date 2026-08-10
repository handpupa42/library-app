import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ReaderProfile from '../../components/readers/ReaderProfile/ReaderProfile';
import { getAllReaders, issueBook, returnBook } from '../../store/readers-slice';
import { getAllBooks, setBookAvailability } from '../../store/books-slice';
import type { RootState, AppDispatch } from '../../store/store';

const ReaderProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const readers = useSelector(getAllReaders);
  const books = useSelector(getAllBooks);
  
  const reader = readers.find((r) => r.id === id);

  if (!reader) return <div>Читатель не найден</div>;

  const handleIssue = (bookId: string) => {
    dispatch(issueBook({ readerId: reader.id, bookId }));
    dispatch(setBookAvailability({ id: bookId, isAvailable: false }));
  };

  const handleReturn = (bookId: string) => {
    if (window.confirm('Принять возврат?')) {
      dispatch(returnBook({ readerId: reader.id, bookId }));
      dispatch(setBookAvailability({ id: bookId, isAvailable: true }));
    }
  };

  return (
    <ReaderProfile
      reader={reader}
      allBooks={books}
      onBack={() => navigate(-1)}
      onIssue={handleIssue}
      onReturn={handleReturn}
    />
  );
};
export default ReaderProfilePage;

