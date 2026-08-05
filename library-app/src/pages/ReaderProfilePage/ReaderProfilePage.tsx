import { useParams } from 'react-router-dom';
import ReaderProfile from '../../components/readers/ReaderProfile/ReaderProfile';
import { mockReaders } from '../../mocks/readers';
const ReaderProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const reader = mockReaders.find((r) => r.id === id);

  if (!reader) {
    return (
      <div className="not-found" style={{ textAlign: 'center', padding: '40px 0' }}>
        <h1>Читатель не найден</h1>
        <p>Пользователь с ID "{id}" не существует</p>
      </div>
    );
  }

  return <ReaderProfile reader={reader} />;
};
export default ReaderProfilePage;