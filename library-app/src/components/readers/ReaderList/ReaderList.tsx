import { useSelector } from "react-redux";
import type { IReader } from "../../../types/reader.types";
import ReaderCard from "../ReaderCard/ReaderCard";
import { getAllReaders } from "../../../store/readers-slice";

const ReaderList = () => {
  const readers: IReader[] = useSelector(getAllReaders);
  return (
    <div className="reader-list">
      {readers.map(reader => {
        return (
          <ReaderCard reader={reader} key={reader.id} />
        );
      })}
    </div>
  );
};
export default ReaderList;

