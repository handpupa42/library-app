import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { mockReaders } from '../mocks/readers';
import type { IReader } from '../types/reader.types';
import type { RootState } from './store'; 

type ReaderSlice = {
  readers: IReader[];
  error: string;
}
const initialState: ReaderSlice = {
  readers: mockReaders,
  error: '',
};
export const readerSlice = createSlice({
  name: 'readers',
  initialState,
  reducers: {
    
    addReader: (state, action: PayloadAction<{ fullName: string; email: string; phone: string; }>) => {
      const newReader: IReader = {
        id: Date.now().toString(),
        fullName: action.payload.fullName,
        email: action.payload.email,
        phone: action.payload.phone,
        registrationDate: new Date('2026-07-28'), 
        booksHistory: [],
        activeBooks: [],
      };
      state.readers.push(newReader);
      console.log(action); 
    },
    issueBook: (state, action: PayloadAction<{ readerId: string; bookId: string; title: string; author: string }>) => {
      const { readerId, bookId, title, author } = action.payload;
      const reader = state.readers.find(r => r.id === readerId);
      if (reader) {
        reader.activeBooks.push({ bookId, title, author, issuedDate: new Date() });
        reader.booksHistory.push({ bookId, title, author, issuedDate: new Date() });
      }
    },
    returnBook: (state, action: PayloadAction<{ readerId: string; bookId: string }>) => {
      const { readerId, bookId } = action.payload;
      const reader = state.readers.find(r => r.id === readerId);
      if (reader) {
        reader.activeBooks = reader.activeBooks.filter(b => b.bookId !== bookId);
        const historyEntry = reader.booksHistory.find(h => h.bookId === bookId && !h.returnedDate);
        if (historyEntry) {
          historyEntry.returnedDate = new Date();
        }
      }
  }
}})
export const { addReader, issueBook, returnBook } = readerSlice.actions;
export const getCountReaders = (state: RootState) => state.readers.readers.length;
export const getAllReaders = (state: RootState) => state.readers.readers;
export default readerSlice.reducer;
