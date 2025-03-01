import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartState {
  cartBookIds: number[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CartState = {
  cartBookIds: [],
  status: 'idle',
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<number>) => {
      if (!state.cartBookIds.includes(action.payload)) {
        state.cartBookIds.push(action.payload);
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.cartBookIds = state.cartBookIds.filter(id => id !== action.payload);
    },
    clearCart: (state) => {
      state.cartBookIds = [];
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;


