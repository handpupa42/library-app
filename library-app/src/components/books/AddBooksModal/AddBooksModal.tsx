import { useState } from 'react';
interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const AddBookModal = ({ isOpen, onClose }: AddBookModalProps) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('');
  const [genre, setGenre] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Название обязательно';
    if (!author.trim()) newErrors.author = 'Автор обязателен';
    if (!year.trim()) newErrors.year = 'Год обязателен';
    if (!genre.trim()) newErrors.genre = 'Жанр обязателен';
    return newErrors;
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log({ title, author, year, genre });

    setTitle('');
    setAuthor('');
    setYear('');
    setGenre('');
    setErrors({});
    onClose();
  };

  const handleClose = () => {
    setTitle('');
    setAuthor('');
    setYear('');
    setGenre('');
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Добавить книгу</h2>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Название *</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={errors.title ? 'error' : ''}
            />
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="author">Автор *</label>
            <input
              id="author"
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className={errors.author ? 'error' : ''}
            />
            {errors.author && <span className="error-text">{errors.author}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="year">Год издания *</label>
            <input
              id="year"
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className={errors.year ? 'error' : ''}
            />
            {errors.year && <span className="error-text">{errors.year}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="genre">Жанр *</label>
            <input
              id="genre"
              type="text"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className={errors.genre ? 'error' : ''}
            />
            {errors.genre && <span className="error-text">{errors.genre}</span>}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={handleClose}>
              Отмена
            </button>
            <button type="submit" className="btn btn-primary">
              Добавить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBookModal;