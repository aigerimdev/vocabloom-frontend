import { render, screen, fireEvent } from '@testing-library/react';
import LoginPage from './LoginPage';
import { MemoryRouter } from 'react-router-dom';
import { useAuth as mockUseAuth } from '../context/useAuth';

const mockLoginUser = jest.fn();
const mockNavigate = jest.fn();

jest.mock('../context/useAuth', () => ({
    useAuth: () => ({ login_user: mockLoginUser }),
}));

jest.mock('react-router-dom', () => {
    const actual = jest.requireActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('LoginPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders form inputs and login button', () => {
        render(<LoginPage />, { wrapper: MemoryRouter });

        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
    });

    it('calls login_user on form submit', () => {
        render(<LoginPage />, { wrapper: MemoryRouter });

        fireEvent.change(screen.getByLabelText(/username/i), {
            target: { value: 'testuser' },
        });
        fireEvent.change(screen.getByLabelText(/password/i), {
            target: { value: 'password123' },
        });

        fireEvent.click(screen.getByRole('button', { name: /log in/i }));

        expect(mockLoginUser).toHaveBeenCalledWith('testuser', 'password123');
    });

    it('navigates to signup when button is clicked', () => {
        render(<LoginPage />, { wrapper: MemoryRouter });

        fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

        expect(mockNavigate).toHaveBeenCalledWith('/signup');
    });
});