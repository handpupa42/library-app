import { configureStore } from '@reduxjs/toolkit';
import readerReducer from './readers-slice';
import bookReducer from './books-slice';
export const store = configureStore({
  reducer: {
    readers: readerReducer,
    books: bookReducer, 
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
