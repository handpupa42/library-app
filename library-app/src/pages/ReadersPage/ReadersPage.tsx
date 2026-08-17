import { useState } from 'react';
import { useSelector } from 'react-redux';
import { getCountReaders } from '../../store/readers-slice';
import ReaderList from '../../components/readers/ReaderList/ReaderList';
import AddReaderModal from '../../components/readers/AddReaderModal/AddReaderModal';

const ReadersPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const count = useSelector(getCountReaders);
  return (
    <div>
      <h1 className="page-title">Читатели библиотеки</h1>
      <p className="page-subtitle">
        Всего читателей: <strong>{count}</strong>
      </p>
      <button 
        onClick={() => setIsModalOpen(true)} 
        className="btn btn-primary"
        style={{ marginBottom: '20px' }}
      >
        + Добавить читателя
      </button>
      <ReaderList />
      {isModalOpen && (
        <AddReaderModal handleClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default ReadersPage;
