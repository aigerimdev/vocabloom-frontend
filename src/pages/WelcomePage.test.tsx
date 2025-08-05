import { render, screen, fireEvent } from '@testing-library/react';
import WelcomePage from './WelcomePage';
import { MemoryRouter } from 'react-router-dom';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => {
    const actual = jest.requireActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('WelcomePage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders title, subtitle, and footer', () => {
        render(<WelcomePage />, { wrapper: MemoryRouter });

        expect(screen.getByText(/welcome to/i)).toBeInTheDocument();
        expect(screen.getByText(/VocaBloom/i)).toBeInTheDocument();
        expect(screen.getByText(/every word you learn/i)).toBeInTheDocument();
        expect(screen.getByText(/made with/i)).toBeInTheDocument();
        expect(screen.getByText(/ada developers academy/i)).toBeInTheDocument();
        expect(screen.getByText(/2025/i)).toBeInTheDocument();
    });

    it('navigates to login when "Sign in" is clicked', () => {
        render(<WelcomePage />, { wrapper: MemoryRouter });

        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    it('navigates to signup when "Sign up" is clicked', () => {
        render(<WelcomePage />, { wrapper: MemoryRouter });

        fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
        expect(mockNavigate).toHaveBeenCalledWith('/signup');
    });
});
