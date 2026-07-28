import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from './LoginPage';

// Mock react-router-dom's useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock the API service
vi.mock('../services/api', () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
  },
  ApiError: class ApiError extends Error {
    status: number;
    constructor(status: number, message: string) {
      super(message);
      this.status = status;
      this.name = 'ApiError';
    }
  },
}));

import { authApi } from '../services/api';

const renderLoginPage = () => {
  return render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>
  );
};

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  // ─── Rendering ──────────────────────────────────────────────

  it('renders the login form with email and password fields', () => {
    renderLoginPage();

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('renders the AutoVault branding', () => {
    renderLoginPage();

    expect(screen.getByText('AutoVault')).toBeInTheDocument();
    expect(screen.getByText('Car Dealership Management')).toBeInTheDocument();
  });

  it('shows "Welcome Back" title in login mode', () => {
    renderLoginPage();

    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
  });

  // ─── Form Toggle ───────────────────────────────────────────

  it('toggles to register mode when "Sign Up" link is clicked', async () => {
    const user = userEvent.setup();
    renderLoginPage();

    await user.click(screen.getByRole('button', { name: /sign up/i }));

    expect(screen.getByText('Create Account')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  // ─── Input Handling ────────────────────────────────────────

  it('accepts email and password input', async () => {
    const user = userEvent.setup();
    renderLoginPage();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(emailInput, 'test@dealer.com');
    await user.type(passwordInput, 'MyPassword123');

    expect(emailInput).toHaveValue('test@dealer.com');
    expect(passwordInput).toHaveValue('MyPassword123');
  });

  // ─── Login Submit ──────────────────────────────────────────

  it('calls authApi.login and navigates on successful login', async () => {
    const user = userEvent.setup();
    vi.mocked(authApi.login).mockResolvedValue({ token: 'mock-jwt-token' });

    renderLoginPage();

    await user.type(screen.getByLabelText(/email/i), 'test@dealer.com');
    await user.type(screen.getByLabelText(/password/i), 'MyPassword123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(authApi.login).toHaveBeenCalledWith('test@dealer.com', 'MyPassword123');
    });

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('mock-jwt-token');
      expect(mockNavigate).toHaveBeenCalledWith('/inventory');
    });
  });

  // ─── Register Submit ───────────────────────────────────────

  it('calls authApi.register when in register mode', async () => {
    const user = userEvent.setup();
    vi.mocked(authApi.register).mockResolvedValue({ token: 'new-user-token' });

    renderLoginPage();

    // Switch to register mode
    await user.click(screen.getByRole('button', { name: /sign up/i }));

    await user.type(screen.getByLabelText(/email/i), 'new@dealer.com');
    await user.type(screen.getByLabelText(/password/i), 'NewPass456');

    // The submit button should now say "Sign Up" — find it among the buttons
    const buttons = screen.getAllByRole('button');
    const submitButton = buttons.find((btn) => btn.getAttribute('type') === 'submit');
    expect(submitButton).toBeDefined();
    await user.click(submitButton!);

    await waitFor(() => {
      expect(authApi.register).toHaveBeenCalledWith('new@dealer.com', 'NewPass456');
    });
  });

  // ─── Error Handling ────────────────────────────────────────

  it('displays an error message when login fails', async () => {
    const user = userEvent.setup();

    const { ApiError } = await import('../services/api');
    vi.mocked(authApi.login).mockRejectedValue(new ApiError(401, 'Invalid credentials'));

    renderLoginPage();

    await user.type(screen.getByLabelText(/email/i), 'bad@dealer.com');
    await user.type(screen.getByLabelText(/password/i), 'wrong');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });
});
