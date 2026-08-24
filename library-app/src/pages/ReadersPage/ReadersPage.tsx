import { useState } from 'react';
import ReaderList from '../../components/readers/ReaderList/ReaderList';
import AddReaderModal from '../../components/readers/AddReaderModal/AddReaderModal';

const ReadersPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 className="page-title">Читатели библиотеки</h1>
        <button
          className="btn btn-primary"
          onClick={() => setIsModalOpen(true)}
        >
          + Зарегистрировать читателя
        </button>
      </div>
      <ReaderList />
      <AddReaderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ReadersPage;

