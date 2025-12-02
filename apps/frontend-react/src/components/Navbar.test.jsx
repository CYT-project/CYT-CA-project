import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import Navbar from './Navbar';

test('renders main navigation links', () => {
  render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );

  expect(screen.getByText(/MarketForge/i)).toBeInTheDocument();
  expect(screen.getByText(/Marketplace/i)).toBeInTheDocument();
  expect(screen.getByText(/Categories/i)).toBeInTheDocument();
  expect(screen.getByText(/Sellers/i)).toBeInTheDocument();
});
