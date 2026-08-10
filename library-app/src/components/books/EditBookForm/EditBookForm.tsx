import { useState } from 'react';
import { useDispatch } from 'react-redux';
import type { IBook } from '../../../types/book.types';
import type { AppDispatch } from '../../../store/store';
import { updateBook } from '../../../store/books-slice';
type EditBookFormProps = {
  book: IBook;
  onCancel: () => void;
};
const EditBookForm = ({ book, onCancel }: EditBookFormProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [title, setTitle] = useState(book.title);
  const [author, setAuthor] = useState(book.author);
  const [year, setYear] = useState(String(book.year)); 
  const [genre, setGenre] = useState(book.genre);
  const [description, setDescription] = useState(book.description || '');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim() || !author.trim() || !genre.trim() || !year) {
      alert('Заполните обязательные поля: Название, Автор, Год, Жанр');
      return;
    }
    const parsedYear = Number(year);
    if (isNaN(parsedYear) || parsedYear < 1000 || parsedYear > new Date().getFullYear()) {
      alert('Введите корректный год (например, 2023)');
      return;
    }
    dispatch(
      updateBook({
        id: book.id,
        title: title.trim(),
        author: author.trim(),
        year: parsedYear,
        genre: genre.trim(),
        description: description.trim(),
      })
    );
    onCancel(); 
  };
  return (
    <form className="edit-book-form" onSubmit={handleSubmit}>
      <h2>Редактирование книги</h2>
      <label htmlFor="book-title">Название книги</label>
      <input
        id="book-title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <label htmlFor="book-author">Автор</label>
      <input
        id="book-author"
        type="text"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        required
      />
      <label htmlFor="book-year">Год издания</label>
      <input
        id="book-year"
        type="number"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        required
      />
      <label htmlFor="book-genre">Жанр</label>
      <input
        id="book-genre"
        type="text"
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
        required
      />
      <label htmlFor="book-description">Описание (необязательно)</label>
      <textarea
        id="book-description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
      />
      <div className="edit-book-actions">
        <button type="submit" className="btn btn-primary">
          Сохранить
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Отмена
        </button>
      </div>
    </form>
  );
};
export default EditBookForm;
