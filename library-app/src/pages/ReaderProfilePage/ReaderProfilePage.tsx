import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ReaderProfile from '../../components/readers/ReaderProfile/ReaderProfile';
import { getAllReaders } from '../../store/readers-slice';
import { mockBooks } from '../../mocks/books';

const ReaderProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const readers = useSelector(getAllReaders);
  const reader = readers.find((r) => r.id === id);
  if (!reader) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '50px 0' }}>
        <h2>Читатель не найден</h2>
        <p style={{ margin: '15px 0' }}>Пользователь с таким ID не существует.</p>
        <button onClick={() => navigate('/readers')} className="btn btn-secondary">
          Назад к списку читателей
        </button>
      </div>
    );
  }

  return (
    <ReaderProfile
      reader={reader}
      allBooks={mockBooks}
      onBack={() => navigate(-1)}
      onIssue={() => {}} 
      onReturn={() => {}}
    />
  );
};
export default ReaderProfilePage;