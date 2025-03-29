import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from './App';

// Create a simplified Redux store for testing
const mockStore = configureStore({
  reducer: {
    cart: (state = { cartBookIds: [], cartBooks: [] }, action) => state,
  }
});

test('renders application container', () => {
  render(
    <Provider store={mockStore}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  );
  
  // Look for something that definitely exists in the application
  const logoText = screen.getByText("Timeless Library");
  expect(logoText).toBeInTheDocument();
  
  // add other assertions to verify that other important if other elements are present, such as navigation
  const homeLink = screen.getByText("Home");
  expect(homeLink).toBeInTheDocument();
  
  const booksLink = screen.getByText("Books");
  expect(booksLink).toBeInTheDocument();
});