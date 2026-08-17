import { configureStore } from '@reduxjs/toolkit';
import readerReducer from './readers-slice';
import booksReducer from './books-slice';
export const store = configureStore({
  reducer: {
    readers: readerReducer,
    books: booksReducer,
  },
});
export type RootState = ReturnType<
  typeof store.getState
>;
export type AppDispatch = typeof store.dispatch;

