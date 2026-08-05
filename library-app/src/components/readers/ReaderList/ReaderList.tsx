import ReaderCard from '../ReaderCard/ReaderCard';
import type { IReader } from '../../../types/reader.types';

interface ReaderListProps {
  readers: IReader[];
}

const ReaderList = ({ readers }: ReaderListProps) => {
  return (
    <div className="reader-list">
      {readers.map((reader) => (
        <ReaderCard key={reader.id} reader={reader} />
      ))}
    </div>
  );
};

export default ReaderList;

