import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { mockReaders } from '../mocks/readers';
import type { IReader } from '../types/reader.types';
import type { RootState } from './store';

export const readerSlice = createSlice({
  name: 'readers',
  initialState: {
    readers: mockReaders as IReader[],
  },
  reducers: {
    addReader: (state, action: PayloadAction<any>) => {
      state.readers.push({
        ...action.payload,
        id: Date.now().toString(),
        registrationDate: new Date(),
        booksHistory: [],
        activeBooks: [],
      });
    },
    issueBook: (state, action: PayloadAction<{ readerId: string; bookId: string }>) => {
      const { readerId, bookId } = action.payload;
      const reader = state.readers.find(r => r.id === readerId);
      if (reader) {
        reader.activeBooks.push(bookId);
        reader.booksHistory.push({ bookId, takenAt: new Date() });
      }
    },
    returnBook: (state, action: PayloadAction<{ readerId: string; bookId: string }>) => {
      const { readerId, bookId } = action.payload;
      const reader = state.readers.find(r => r.id === readerId);
      if (reader) {
        reader.activeBooks = reader.activeBooks.filter(id => id !== bookId);
        const history = reader.booksHistory.find(h => h.bookId === bookId && !h.returnedAt);
        if (history) history.returnedAt = new Date();
      }
    }
  }
});

export const { addReader, issueBook, returnBook } = readerSlice.actions;
export const getAllReaders = (state: RootState) => state.readers.readers;
export const getCountReaders = (state: RootState) => state.readers.readers.length;
export default readerSlice.reducer;

