import ReaderList from '../../components/readers/ReaderList/ReaderList';
import { mockReaders } from '../../mocks/readers';
const ReadersPage = () => {
  return (
    <div>
      <h1 className="page-title">Читатели библиотеки</h1>
      <p className="page-subtitle">
        Всего читателей: <strong>{mockReaders.length}</strong>
      </p>
      <ReaderList readers={mockReaders} />
    </div>
  );
};

export default ReadersPage;