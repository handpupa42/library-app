import { useState } from 'react';
import { useDispatch } from 'react-redux';
import type { IBook } from '../../../types/book.types';
import type { AppDispatch } from '../../../store/store';
import { updateBook } from '../../../store/books-slice';

type EditBookFormProps = {
  book: IBook;
  onCancel: () => void;
};

type FormErrors = {
  title?: string;
  author?: string;
  year?: string;
  genre?: string;
};

const EditBookForm = ({ book, onCancel }: EditBookFormProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const [title, setTitle] = useState(book.title);
  const [author, setAuthor] = useState(book.author);
  const [year, setYear] = useState(String(book.year));
  const [genre, setGenre] = useState(book.genre);
  const [description, setDescription] = useState(book.description || '');

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
      updateBook({
        id: book.id,
        title: title.trim(),
        author: author.trim(),
        year: Number(year),
        genre: genre.trim(),
        description: description.trim(),
      })
    )
      .unwrap()
      .then(() => {
        onCancel();
      })
      .catch((err) => {
        setServerError(String(err));
      });
  };

  return (
    <form className="edit-book-form" onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2>Редактирование книги</h2>

      {serverError && <p style={{ color: 'red', marginBottom: '10px' }}>❌ {serverError}</p>}

      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="edit-title">Название книги *</label>
        <input
          id="edit-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {errors.title && <span style={{ color: 'red', fontSize: '12px' }}>{errors.title}</span>}
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="edit-author">Автор *</label>
        <input
          id="edit-author"
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        {errors.author && <span style={{ color: 'red', fontSize: '12px' }}>{errors.author}</span>}
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="edit-year">Год издания *</label>
        <input
          id="edit-year"
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        {errors.year && <span style={{ color: 'red', fontSize: '12px' }}>{errors.year}</span>}
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="edit-genre">Жанр *</label>
        <input
          id="edit-genre"
          type="text"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        />
        {errors.genre && <span style={{ color: 'red', fontSize: '12px' }}>{errors.genre}</span>}
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="edit-description">Описание</label>
        <textarea
          id="edit-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
      </div>

      <div className="edit-book-actions" style={{ display: 'flex', gap: '10px' }}>
        <button type="submit" className="btn btn-primary">
          Сохранить изменения
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Отмена
        </button>
      </div>
    </form>
  );
};

export default EditBookForm;
