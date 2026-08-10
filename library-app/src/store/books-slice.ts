import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { mockBooks } from '../mocks/books';
import type { IBook } from '../types/book.types';
interface BooksState {
  books: IBook[];
}
const initialState: BooksState = {
  books: mockBooks,
};
export const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    addBook: (state, action: PayloadAction<Omit<IBook, 'id' | 'isAvailable'>>) => {
      const newBook: IBook = {
        ...action.payload,
        id: Date.now().toString(),
        isAvailable: true,
      };
      state.books.push(newBook);
    },
  },
});
export const { addBook } = booksSlice.actions;
export const getAllBooks = (state: any) => state.books.books;
export default booksSlice.reducer;