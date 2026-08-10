import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { mockBooks } from '../mocks/books';
import type { IBook } from '../types/book.types';
import type { RootState } from './store';
const API_BASE_URL = 'http://localhost:3000';
export const fetchBooks = createAsyncThunk(
  'books/fetchAll', 
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/books`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const addBook = createAsyncThunk(
  'books/addBook', 
  async (
    newBookData: {
      title: string;
      author: string;
      year: number;
      genre: string;
      description: string;
    }, 
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/books`, newBookData);
      return response.data; 
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
const initialState = {
  items: mockBooks as IBook[],
  status: 'idle' as 'idle' | 'loading' | 'succeeded' | 'failed',
  error: null as string | null,
};

export const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    clearBooks: (state) => {
      state.items = [];
      state.status = 'idle';
      state.error = null;
    },
    setBookAvailability: (state, action: PayloadAction<{ id: string; isAvailable: boolean }>) => {
      const book = state.items.find((b) => b.id === action.payload.id);
      if (book) {
        book.isAvailable = action.payload.isAvailable;
      }
    },
    updateBook: (state, action: PayloadAction<IBook>) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    }
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
      .addCase(fetchBooks.rejected, (state, action: any) => {
        state.status = 'failed';
        state.error = action.payload || 'Произошла ошибка загрузки';
      })

      .addCase(addBook.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addBook.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
      })
      .addCase(addBook.rejected, (state, action: any) => {
        state.status = 'failed';
        state.error = action.payload || 'Произошла ошибка добавления';
      });
  },
});


export const { clearBooks, setBookAvailability, updateBook } = booksSlice.actions;
export const getAllBooks = (state: RootState) => state.books.items;
export const getBookById = (state: RootState, id: string | undefined) => 
  state.books.items.find(b => b.id === id); 

export const selectBooksStatus = (state: RootState) => state.books.status;
export const selectBooksError = (state: RootState) => state.books.error;
export default booksSlice.reducer;

