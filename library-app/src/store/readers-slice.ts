import { createSlice } from '@reduxjs/toolkit';
import { mockReaders } from '../mocks/readers';
import type { IReader } from '../types/reader.types';
export const getCountReaders = (state: any) => state.readers.readers.length;
export const getAllReaders = (state: any) => state.readers.readers;
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
    addReader: (state, action) => {
      const newReader = action.payload;
      newReader.registrationDate = '2026-07-28';
      newReader.booksHistory = [];
      newReader.activeBooks = [];
      state.readers.push(newReader);
      console.log(action);
    }
  }
});

export const { addReader } = readerSlice.actions;
export default readerSlice.reducer;

