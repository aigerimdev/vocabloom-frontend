import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Logout from './Logout';
import { logout as mockLogout } from '../endpoints/api';

const mockSetIsAuthenticated = jest.fn();
const mockNavigate = jest.fn();

jest.mock('../endpoints/api', () => ({
    logout: jest.fn(),
}));

jest.mock('../context/useAuth', () => ({
    useAuth: () => ({
        setIsAuthenticated: mockSetIsAuthenticated,
    }),
}));

jest.mock('react-router-dom', () => {
    const actual = jest.requireActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('Logout', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders log out button', () => {
        render(<Logout />);
        expect(screen.getByRole('button', { name: /log out/i })).toBeInTheDocument();
    });

    it('logs out and navigates on click', async () => {
        render(<Logout />);
        fireEvent.click(screen.getByText(/log out/i));

        await waitFor(() => expect(mockLogout).toHaveBeenCalled());

        expect(mockSetIsAuthenticated).toHaveBeenCalledWith(false);
        expect(mockNavigate).toHaveBeenCalledWith('/welcome');
    });
});