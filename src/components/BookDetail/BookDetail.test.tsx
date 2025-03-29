import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent, { UserEvent } from '@testing-library/user-event';
import { act } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import BookDetail from '../BookDetail/BookDetail';
import { fetchBookDetails, deleteBook } from '../../services/BookService';
import { useAuth } from '../../context/useAuth';

// Mock external modules
jest.mock('../../services/BookService');
jest.mock('../../context/useAuth');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '1' }),
  useNavigate: () => jest.fn(),
}));

// Type for the mock store that implements Redux Store interface
type MockStore = {
  getState: () => any;
  dispatch: jest.Mock;
  getActions: () => any[];
  clearActions: () => void;
  subscribe: jest.Mock;
  replaceReducer: jest.Mock;
  [Symbol.observable]: () => any;
};

// Create a mock store compatible with Provider
function createMockStore(initialState: any): MockStore {
  const actions: any[] = [];
  return {
    getState: () => initialState,
    dispatch: jest.fn(action => {
      actions.push(action);
      return action;
    }),
    getActions: () => actions,
    clearActions: () => actions.splice(0, actions.length),
    subscribe: jest.fn(),
    replaceReducer: jest.fn(),
    [Symbol.observable]: () => ({
      subscribe: jest.fn(),
      [Symbol.observable]: jest.fn()
    })
  };
}

// Mock data
const mockBook = {
  id: 1,
  title: 'Test Book',
  ISBN: '1234567890',
  description: 'Test description',
  image: null,
  available: true,
  publishedYear: new Date(),
  authors: [{ id: 1, firstName: 'John', lastName: 'Doe' }],
  category: { id: 1, name: 'Fiction' }
};

describe('BookDetail Component', () => {
  let store: MockStore;
  let user: UserEvent;

  beforeEach(() => {
    // Initialize userEvent
    user = userEvent.setup();
    
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock fetchBookDetails to return book data
    (fetchBookDetails as jest.Mock).mockResolvedValue(mockBook);
    
    // Mock the useAuth hook
    (useAuth as jest.Mock).mockReturnValue({
      user: { roles: ['ROLE_USER'] }
    });
    
    // Configure Redux store with our simplified mock
    store = createMockStore({
      cart: {
        cartBookIds: [],
        cartBooks: []
      }
    });
  });

  test('renders loading state initially', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <BookDetail />
        </MemoryRouter>
      </Provider>
    );
    
    expect(screen.getByText('Loading book details...')).toBeInTheDocument();
  });

  test('renders book details after loading', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <BookDetail />
        </MemoryRouter>
      </Provider>
    );
    
    // Wait for book data to load
    await waitFor(() => {
      expect(screen.getByText('Test Book')).toBeInTheDocument();
    });
    
    // Check book details
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Available')).toBeInTheDocument();
    
    // Use getByText instead of getByRole because the button has a different aria-label
    expect(screen.getByText('Add to Cart')).toBeInTheDocument();
  });

  test('shows admin actions when user is admin', async () => {
    // Modify the mock for an admin user
    (useAuth as jest.Mock).mockReturnValue({
      user: { roles: ['ROLE_ADMIN'] }
    });
    
    render(
      <Provider store={store}>
        <MemoryRouter>
          <BookDetail />
        </MemoryRouter>
      </Provider>
    );
    
    // Wait for book data to load
    await waitFor(() => {
      expect(screen.getByText('Test Book')).toBeInTheDocument();
    });
    
    // Use getByText instead of getByRole
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  test('calls addToCart when Add to Cart button is clicked', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <BookDetail />
        </MemoryRouter>
      </Provider>
    );
    
    // Wait for book data to load
    await waitFor(() => {
      expect(screen.getByText('Test Book')).toBeInTheDocument();
    });
    
    // Click the Add to Cart button using getByText
    const addButton = screen.getByText('Add to Cart');
    
    // Use act to wrap state updates
    await act(async () => {
      await user.click(addButton);
    });
    
    // Verify that the action was dispatched to the store
    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ 
        type: 'cart/addToCart'
      })
    );
  });

  test('renders error message when fetching book fails', async () => {
    // Modify the mock to simulate an error
    (fetchBookDetails as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));
    
    render(
      <Provider store={store}>
        <MemoryRouter>
          <BookDetail />
        </MemoryRouter>
      </Provider>
    );
    
    // Wait for the error to be displayed
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch')).toBeInTheDocument();
    });
    
    // Verify that the "Back to Books" link is present
    expect(screen.getByText('Back to Books')).toBeInTheDocument();
  });

  test('shows Unavailable button when book is not available', async () => {
    // Modify the mock for an unavailable book
    (fetchBookDetails as jest.Mock).mockResolvedValue({
      ...mockBook,
      available: false
    });
    
    render(
      <Provider store={store}>
        <MemoryRouter>
          <BookDetail />
        </MemoryRouter>
      </Provider>
    );
    
    // Wait for book data to load
    await waitFor(() => {
      expect(screen.getByText('Test Book')).toBeInTheDocument();
    });
    
    // Get all elements containing the text "Unavailable"
    const unavailableElements = screen.getAllByText('Unavailable');
    
    // Find the button specifically
    const unavailableButton = unavailableElements.find(
      element => element.tagName.toLowerCase() === 'button'
    );
    
    // Verify that the button is present
    expect(unavailableButton).toBeInTheDocument();
    
    // Verify that the button is disabled
    expect(unavailableButton).toBeDisabled();
  });

  test('calls deleteBook when Delete button is clicked and confirmed', async () => {
    // Configure the mock for window.confirm
    const originalConfirm = window.confirm;
    window.confirm = jest.fn().mockReturnValue(true);
    
    try {
      // Modify the mock for an admin user
      (useAuth as jest.Mock).mockReturnValue({
        user: { roles: ['ROLE_ADMIN'] }
      });
      
      render(
        <Provider store={store}>
          <MemoryRouter>
            <BookDetail />
          </MemoryRouter>
        </Provider>
      );
      
      // Wait for book data to load
      await waitFor(() => {
        expect(screen.getByText('Test Book')).toBeInTheDocument();
      });
      
      // Click the Delete button using getByText
      const deleteButton = screen.getByText('Delete');
      
      // Use act to wrap state updates
      await act(async () => {
        await user.click(deleteButton);
      });
      
      // Verify that window.confirm was called
      expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this book?');
      
      // Verify that deleteBook was called
      expect(deleteBook).toHaveBeenCalledWith(1);
    } finally {
      // Restore the original function
      window.confirm = originalConfirm;
    }
  });
});