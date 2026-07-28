import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CarFormModal from './CarFormModal';
import type { Car } from '../services/api';

const mockOnClose = vi.fn();
const mockOnSubmit = vi.fn();

const sampleCar: Car = {
  id: 1,
  make: 'Honda',
  model: 'Civic',
  year: 2023,
  price: 24500,
  mileage: 12000,
  status: 'available',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

describe('CarFormModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockOnSubmit.mockResolvedValue(undefined);
  });

  // ─── Add Mode ──────────────────────────────────────────────

  describe('Add Mode (no car prop)', () => {
    it('displays "Add New Car" title when opened without a car', () => {
      render(
        <CarFormModal open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} car={null} />
      );

      expect(screen.getByText('Add New Car')).toBeInTheDocument();
    });

    it('renders all form fields', () => {
      render(
        <CarFormModal open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} car={null} />
      );

      expect(screen.getByLabelText(/make/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/model/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/year/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/mileage/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    });

    it('shows "Add Car" on the submit button', () => {
      render(
        <CarFormModal open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} car={null} />
      );

      expect(screen.getByRole('button', { name: /add car/i })).toBeInTheDocument();
    });

    it('has empty fields in add mode', () => {
      render(
        <CarFormModal open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} car={null} />
      );

      expect(screen.getByLabelText(/make/i)).toHaveValue('');
      expect(screen.getByLabelText(/model/i)).toHaveValue('');
    });

    it('calls onClose when Cancel is clicked', async () => {
      const user = userEvent.setup();
      render(
        <CarFormModal open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} car={null} />
      );

      await user.click(screen.getByRole('button', { name: /cancel/i }));

      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  // ─── Edit Mode ─────────────────────────────────────────────

  describe('Edit Mode (car prop provided)', () => {
    it('displays "Edit Car" title when opened with a car', () => {
      render(
        <CarFormModal open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} car={sampleCar} />
      );

      expect(screen.getByText('Edit Car')).toBeInTheDocument();
    });

    it('shows "Save Changes" on the submit button', () => {
      render(
        <CarFormModal open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} car={sampleCar} />
      );

      expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
    });

    it('pre-fills the form with the car data', () => {
      render(
        <CarFormModal open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} car={sampleCar} />
      );

      expect(screen.getByLabelText(/make/i)).toHaveValue('Honda');
      expect(screen.getByLabelText(/model/i)).toHaveValue('Civic');
      expect(screen.getByLabelText(/year/i)).toHaveValue(2023);
      expect(screen.getByLabelText(/price/i)).toHaveValue(24500);
      expect(screen.getByLabelText(/mileage/i)).toHaveValue(12000);
    });
  });

  // ─── Closed State ──────────────────────────────────────────

  describe('Closed State', () => {
    it('does not render the dialog content when closed', () => {
      render(
        <CarFormModal open={false} onClose={mockOnClose} onSubmit={mockOnSubmit} car={null} />
      );

      expect(screen.queryByText('Add New Car')).not.toBeInTheDocument();
    });
  });
});
