import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import InventoryPage from './InventoryPage';
import type { Car } from '../services/api';

// Mock navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock the API
vi.mock('../services/api', () => ({
  carsApi: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  ApiError: class ApiError extends Error {
    status: number;
    constructor(status: number, message: string) {
      super(message);
      this.status = status;
    }
  },
}));

import { carsApi } from '../services/api';

const mockCars: Car[] = [
  {
    id: 1,
    make: 'Toyota',
    model: 'Camry',
    year: 2024,
    price: 28999,
    mileage: 15000,
    status: 'available',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    make: 'Honda',
    model: 'Civic',
    year: 2023,
    price: 24500,
    mileage: 20000,
    status: 'sold',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 3,
    make: 'Ford',
    model: 'Mustang',
    year: 2024,
    price: 42000,
    mileage: 5000,
    status: 'pending',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 4,
    make: 'Toyota',
    model: 'RAV4',
    year: 2023,
    price: 32000,
    mileage: 18000,
    status: 'available',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

const renderInventoryPage = () => {
  return render(
    <MemoryRouter>
      <InventoryPage />
    </MemoryRouter>
  );
};

describe('InventoryPage — Search & Filter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem('token', 'mock-jwt-token');
    vi.mocked(carsApi.getAll).mockResolvedValue(mockCars);
  });

  // ─── Search by Text ────────────────────────────────────────

  it('renders the search input and status filter', async () => {
    renderInventoryPage();

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/search by make or model/i)).toBeInTheDocument();
    });

    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
  });

  it('displays all cars initially', async () => {
    renderInventoryPage();

    await waitFor(() => {
      expect(screen.getByText(/Camry/)).toBeInTheDocument();
    });

    expect(screen.getByText(/Civic/)).toBeInTheDocument();
    expect(screen.getByText(/Mustang/)).toBeInTheDocument();
    expect(screen.getByText(/RAV4/)).toBeInTheDocument();
  });

  it('filters cars by make when typing in search', async () => {
    const user = userEvent.setup();
    renderInventoryPage();

    await waitFor(() => {
      expect(screen.getByText(/Camry/)).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search by make or model/i);
    await user.type(searchInput, 'Honda');

    // Honda Civic should be visible
    expect(screen.getByText(/Civic/)).toBeInTheDocument();

    // Toyota and Ford cars should be hidden
    expect(screen.queryByText(/Camry/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Mustang/)).not.toBeInTheDocument();
    expect(screen.queryByText(/RAV4/)).not.toBeInTheDocument();
  });

  it('filters cars by model when typing in search', async () => {
    const user = userEvent.setup();
    renderInventoryPage();

    await waitFor(() => {
      expect(screen.getByText(/Mustang/)).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search by make or model/i);
    await user.type(searchInput, 'Mustang');

    expect(screen.getByText(/Mustang/)).toBeInTheDocument();
    expect(screen.queryByText(/Camry/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Civic/)).not.toBeInTheDocument();
  });

  it('search is case-insensitive', async () => {
    const user = userEvent.setup();
    renderInventoryPage();

    await waitFor(() => {
      expect(screen.getByText(/Camry/)).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search by make or model/i);
    await user.type(searchInput, 'toyota');

    // Both Toyota cars should be visible
    expect(screen.getByText(/Camry/)).toBeInTheDocument();
    expect(screen.getByText(/RAV4/)).toBeInTheDocument();

    // Non-Toyota cars hidden
    expect(screen.queryByText(/Civic/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Mustang/)).not.toBeInTheDocument();
  });

  it('shows "No cars found" when search matches nothing', async () => {
    const user = userEvent.setup();
    renderInventoryPage();

    await waitFor(() => {
      expect(screen.getByText(/Camry/)).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search by make or model/i);
    await user.type(searchInput, 'Lamborghini');

    expect(screen.getByText(/no cars found/i)).toBeInTheDocument();
    expect(screen.getByText(/try adjusting/i)).toBeInTheDocument();
  });

  // ─── Filter by Status ─────────────────────────────────────

  it('filters by status when selecting from dropdown', async () => {
    const user = userEvent.setup();
    renderInventoryPage();

    await waitFor(() => {
      expect(screen.getByText(/Camry/)).toBeInTheDocument();
    });

    // Open the Status select dropdown
    const statusSelect = screen.getByLabelText(/status/i);
    await user.click(statusSelect);

    // Select "Sold" from the dropdown listbox
    const listbox = within(screen.getByRole('listbox'));
    await user.click(listbox.getByText(/^Sold$/));

    // Only the sold car (Honda Civic) should remain
    expect(screen.getByText(/Civic/)).toBeInTheDocument();
    expect(screen.queryByText(/Camry/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Mustang/)).not.toBeInTheDocument();
    expect(screen.queryByText(/RAV4/)).not.toBeInTheDocument();
  });

  // ─── Combined Search + Filter ─────────────────────────────

  it('applies both search and status filter together', async () => {
    const user = userEvent.setup();
    renderInventoryPage();

    await waitFor(() => {
      expect(screen.getByText(/Camry/)).toBeInTheDocument();
    });

    // Type "Toyota" in search — should show Camry (available) and RAV4 (available)
    const searchInput = screen.getByPlaceholderText(/search by make or model/i);
    await user.type(searchInput, 'Toyota');

    expect(screen.getByText(/Camry/)).toBeInTheDocument();
    expect(screen.getByText(/RAV4/)).toBeInTheDocument();

    // Now filter by "Available" — both Toyotas are available, so both stay
    const statusSelect = screen.getByLabelText(/status/i);
    await user.click(statusSelect);
    const listbox = within(screen.getByRole('listbox'));
    await user.click(listbox.getByText(/^Available$/));

    expect(screen.getByText(/Camry/)).toBeInTheDocument();
    expect(screen.getByText(/RAV4/)).toBeInTheDocument();
  });

  it('shows "No cars found" when combined search + filter matches nothing', async () => {
    const user = userEvent.setup();
    renderInventoryPage();

    await waitFor(() => {
      expect(screen.getByText(/Camry/)).toBeInTheDocument();
    });

    // Search for "Honda" — only Civic (sold)
    const searchInput = screen.getByPlaceholderText(/search by make or model/i);
    await user.type(searchInput, 'Honda');

    // Filter by "Available" — Honda Civic is sold, so no matches
    const statusSelect = screen.getByLabelText(/status/i);
    await user.click(statusSelect);
    const listbox = within(screen.getByRole('listbox'));
    await user.click(listbox.getByText(/^Available$/));

    expect(screen.getByText(/no cars found/i)).toBeInTheDocument();
  });
});
