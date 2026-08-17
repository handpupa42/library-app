import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import type { IBook } from '../types/book.types';
import type { RootState } from './store';

const API_BASE_URL = 'http://localhost:3000';
type NewBookData = {
  title: string;
  author: string;
  year: number;
  genre: string;
  description?: string;
};
type UpdateBookData = NewBookData & {
  id: string;
};

interface BooksState {
  items: IBook[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: BooksState = {
  items: [],
  status: 'idle',
  error: null,
};
export const fetchBooks = createAsyncThunk<IBook[], void, { rejectValue: string }>(
  'books/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<IBook[]>(`${API_BASE_URL}/books`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка при загрузке книг');
    }
  }
);
export const addBook = createAsyncThunk<IBook, NewBookData, { rejectValue: string }>(
  'books/addBook',
  async (newBookData, { rejectWithValue }) => {
    try {
      const response = await axios.post<IBook>(`${API_BASE_URL}/books`, {
        ...newBookData,
        isAvailable: true,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка при добавлении книги');
    }
  }
);
export const updateBook = createAsyncThunk<IBook, UpdateBookData, { rejectValue: string }>(
  'books/updateBook',
  async (updatedData, { rejectWithValue }) => {
    try {
      const response = await axios.put<IBook>(
        `${API_BASE_URL}/books/${updatedData.id}`,
        updatedData
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка при обновлении книги');
    }
  }
);
export const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    clearBooksError: (state) => {
      state.error = null;
    },
    setBookAvailability: (state, action: PayloadAction<{ id: string; isAvailable: boolean }>) => {
      const book = state.items.find((b) => b.id === action.payload.id);
      if (book) {
        book.isAvailable = action.payload.isAvailable;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Не удалось загрузить книги';
      })
      .addCase(addBook.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addBook.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
      })
      .addCase(addBook.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Не удалось добавить книгу';
      })
      .addCase(updateBook.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateBook.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.items.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateBook.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Не удалось обновить книгу';
      });
  },
});

export const { clearBooksError, setBookAvailability } = booksSlice.actions;

export const getAllBooks = (state: RootState) => state.books.items;
export const selectAllBooks = (state: RootState) => state.books.items;
export const getBookById = (state: RootState, id: string | undefined) =>
  state.books.items.find((b) => b.id === id);
export const selectBooksStatus = (state: RootState) => state.books.status;
export const selectBooksError = (state: RootState) => state.books.error;
export default booksSlice.reducer;

