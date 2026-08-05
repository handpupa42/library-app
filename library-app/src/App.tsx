import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/common/Layout/Layout';
import BooksPage from './pages/BookPage/BookPage';
import ReadersPage from './pages/ReadersPage/ReadersPage';
import ReaderProfilePage from './pages/ReaderProfilePage/ReaderProfilePage';
import NotFound from './pages/NotFound/NotFound';

function App() {
  return (
    <Routes>   {/* ← Контейнер маршрутов */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/books" replace />} />
        <Route path="books" element={<BooksPage />} />
        <Route path="readers" element={<ReadersPage />} />
        <Route path="reader/:id" element={<ReaderProfilePage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
export default App;