import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addBook } from '../../../store/books-slice';
import type { AppDispatch } from '../../../store/store';

type AddBookModalProps = {
  handleClose: () => void;
};

type FormErrors = {
  title?: string;
  author?: string;
  year?: string;
  genre?: string;
};

const AddBookModal = ({ handleClose }: AddBookModalProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('');
  const [genre, setGenre] = useState('');
  const [description, setDescription] = useState('');

  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Название книги обязательно';
    } else if (title.trim().length < 2) {
      newErrors.title = 'Название должно содержать минимум 2 символа';
    }

    if (!author.trim()) {
      newErrors.author = 'Имя автора обязательно';
    } else if (author.trim().length < 2) {
      newErrors.author = 'Имя автора должно содержать минимум 2 символа';
    }

    const currentYear = new Date().getFullYear();
    const parsedYear = Number(year);
    if (!year) {
      newErrors.year = 'Укажите год издания';
    } else if (isNaN(parsedYear) || parsedYear < 800 || parsedYear > currentYear) {
      newErrors.year = `Год должен быть от 800 до ${currentYear}`;
    }

    if (!genre.trim()) {
      newErrors.genre = 'Укажите жанр книги';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setServerError(null);

    if (!validate()) return;

    dispatch(
      addBook({
        title: title.trim(),
        author: author.trim(),
        year: Number(year),
        genre: genre.trim(),
        description: description.trim(),
      })
    )
      .unwrap()
      .then(() => {
        handleClose();
      })
      .catch((err) => {
        setServerError(String(err));
      });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Добавить книгу</h2>

        {serverError && <p style={{ color: 'red', marginBottom: '10px' }}>❌ {serverError}</p>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="title">Название книги *</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Название"
            />
            {errors.title && <span style={{ color: 'red', fontSize: '12px' }}>{errors.title}</span>}
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="author">Автор *</label>
            <input
              id="author"
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Автор"
            />
            {errors.author && <span style={{ color: 'red', fontSize: '12px' }}>{errors.author}</span>}
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="year">Год издания *</label>
            <input
              id="year"
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="Например, 1869"
            />
            {errors.year && <span style={{ color: 'red', fontSize: '12px' }}>{errors.year}</span>}
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="genre">Жанр *</label>
            <input
              id="genre"
              type="text"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="Роман, Детектив..."
            />
            {errors.genre && <span style={{ color: 'red', fontSize: '12px' }}>{errors.genre}</span>}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="description">Описание</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Краткое описание..."
              rows={3}
            />
          </div>

          <div className="modal-actions">
            <button type="submit" className="btn btn-primary">
              Сохранить
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleClose}>
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBookModal;