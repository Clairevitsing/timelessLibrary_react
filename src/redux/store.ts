import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../slices/cartSlice';
import booksReducer from '../slices/booksSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    books: booksReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
