import { render, screen } from '@testing-library/react';
import App from './App';

test('renders backend status message', () => {
  render(<App />);
  // Test for loading state first
  const loadingElement = screen.getByText(/loading/i);
  expect(loadingElement).toBeInTheDocument();
});

test('renders voice chat toggle button', () => {
  render(<App />);
  const toggleButton = screen.getByText(/show voice chat/i);
  expect(toggleButton).toBeInTheDocument();
});
