import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { mockBooks } from '../mocks/books';
import type { IBook } from '../types/book.types';
import type { RootState } from './store';

const API_BASE_URL = 'http://localhost:3000';

export const fetchBooks = createAsyncThunk('books/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/books`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const addBook = createAsyncThunk('books/addBook', async (newBookData: any, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/books`, newBookData);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const booksSlice = createSlice({
  name: 'books',
  initialState: {
    items: mockBooks as IBook[],
    status: 'idle' as 'idle' | 'loading' | 'succeeded' | 'failed',
    error: null as string | null,
  },
  reducers: {
    setBookAvailability: (state, action: PayloadAction<{ id: string; isAvailable: boolean }>) => {
      const book = state.items.find((b) => b.id === action.payload.id);
      if (book) book.isAvailable = action.payload.isAvailable;
    },
    updateBook: (state, action: PayloadAction<IBook>) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) state.items[index] = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action: any) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addBook.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
  },
});

export const { setBookAvailability, updateBook } = booksSlice.actions;
export const getAllBooks = (state: RootState) => state.books.items;
export const selectAllBooks = (state: RootState) => state.books.items;
export const selectBooksStatus = (state: RootState) => state.books.status;
export const selectBooksError = (state: RootState) => state.books.error;
export default booksSlice.reducer;

