import Header from '../../components/common/Header/Header';
import Footer from '../../components/common/Footer/Footer';
import ReaderProfile from '../../components/readers/ReaderProfile/ReaderProfile';
import { mockReaders } from '../../mocks/readers';

const ReaderProfilePage = () => {
  const currentReader = mockReaders[0];

  return (
    <div className="page-wrapper">
      <Header />
      <main className="main-content">
        <div className="container">
          <ReaderProfile reader={currentReader} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ReaderProfilePage;