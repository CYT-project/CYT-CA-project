import { render, screen } from '@testing-library/react';
import App from './App';

test('renders navbar brand and home page hero title', () => {
  render(<App />);

  expect(screen.getByText(/MarketForge/i)).toBeInTheDocument();
  expect(
    screen.getByText(/Discover Amazing Digital Assets/i)
  ).toBeInTheDocument();
});
