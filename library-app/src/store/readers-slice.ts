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
  }
});
export const { addReader } = readerSlice.actions;
export const getCountReaders = (state: RootState) => state.readers.readers.length;
export const getAllReaders = (state: RootState) => state.readers.readers;
export default readerSlice.reducer;