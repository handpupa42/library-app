import { useRef } from 'react';
import type { FormEventHandler } from 'react';
import { useDispatch } from 'react-redux';
import { addBook } from '../../../store/books-slice';
import type {AppDispatch,} from '../../../store/store';
type AddBookModalProps = {
  handleClose: () => void;
};
const AddBookModal = ({
  handleClose,
}: AddBookModalProps) => {
  const titleRef = useRef<HTMLInputElement>(null);
  const authorRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);
  const genreRef = useRef<HTMLInputElement>(null);
  const descriptionRef =
    useRef<HTMLTextAreaElement>(null);

  const dispatch = useDispatch<AppDispatch>();

  const submitHandler: FormEventHandler<
    HTMLFormElement
  > = async (event) => {
    event.preventDefault();

    const title =
      titleRef.current?.value.trim() || '';

    const author =
      authorRef.current?.value.trim() || '';

    const year = Number(
      yearRef.current?.value
    );

    const genre =
      genreRef.current?.value.trim() || '';

    const description =
      descriptionRef.current?.value.trim() || '';

    if (!title || !author || !year || !genre) {
      alert('Заполните обязательные поля');
      return;
    }

    try {
      dispatch(addBook({
        title,
        author,
        year,
        genre,
        description,
      }));

      handleClose();
    } catch (error) {
      alert(String(error));
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Добавить книгу</h2>

        <form onSubmit={submitHandler}>
          <label htmlFor="title">
            Название книги
          </label>

          <input
            id="title"
            ref={titleRef}
            type="text"
            placeholder="Название книги"
          />

          <label htmlFor="author">
            Автор
          </label>

          <input
            id="author"
            ref={authorRef}
            type="text"
            placeholder="Автор книги"
          />

          <label htmlFor="year">
            Год издания
          </label>

          <input
            id="year"
            ref={yearRef}
            type="number"
            placeholder="2026"
          />

          <label htmlFor="genre">
            Жанр
          </label>

          <input
            id="genre"
            ref={genreRef}
            type="text"
            placeholder="Роман"
          />

          <label htmlFor="description">
            Описание
          </label>

          <textarea
            id="description"
            ref={descriptionRef}
            placeholder="Описание книги"
          />

          <button
            type="submit"
            className="btn btn-primary"
          >
            Сохранить
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleClose}
          >
            Отмена
          </button>
        </form>
      </div>
    </div>
  );
};
export default AddBookModal;

