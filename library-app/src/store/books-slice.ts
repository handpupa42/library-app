import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { mockBooks } from '../mocks/books';
import type { IBook } from '../types/book.types';
import type { RootState } from './store'; 

type BooksState = {
  books: IBook[];
};
type NewBookPayload = { 
  title: string;
  author: string;
  year: number;
  genre: string;
  description: string;
};
type UpdateBookPayload = { 
  id: string;
  title: string;
  author: string;
  year: number;
  genre: string;
  description: string;
};
const initialState: BooksState = {
  books: mockBooks,
};
export const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    addBook: (state, action: PayloadAction<NewBookPayload>) => {
      const newBook: IBook = {
        id: Date.now().toString(),
        title: action.payload.title,
        author: action.payload.author,
        year: action.payload.year,
        genre: action.payload.genre,
        description: action.payload.description,
        isAvailable: true,
      };
      state.books.push(newBook);
    },
    updateBook: (state, action: PayloadAction<UpdateBookPayload>) => {
      const book = state.books.find((item) => item.id === action.payload.id);
      if (book) {
        book.title = action.payload.title;
        book.author = action.payload.author;
        book.year = action.payload.year;
        book.genre = action.payload.genre;
        book.description = action.payload.description;
      }
    },
  },
});
export const { addBook, updateBook } = booksSlice.actions;
export const getAllBooks = (state: RootState) => state.books.books;
export const getBookById = (state: RootState, bookId: string | undefined) =>
  state.books.books.find((book) => book.id === bookId);
export default booksSlice.reducer;
