import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignUpPage from './SingUpPage';
import { MemoryRouter } from 'react-router-dom';
import { useAuth as mockUseAuth } from '../context/useAuth';

const mockRegisterUser = jest.fn();
const mockNavigate = jest.fn();

jest.mock('../context/useAuth');
jest.mock('react-router-dom', () => {
    const actual = jest.requireActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('SignUpPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (mockUseAuth as jest.Mock).mockReturnValue({
            register_user: mockRegisterUser,
        });
    });

    it('fills out and submits the sign-up form', async () => {
        mockRegisterUser.mockResolvedValueOnce({});

        render(<SignUpPage />, { wrapper: MemoryRouter });

        fireEvent.change(screen.getByPlaceholderText(/first name/i), {
            target: { value: 'Aigerim' },
        });
        fireEvent.change(screen.getByPlaceholderText(/last name/i), {
            target: { value: 'Doe' },
        });
        fireEvent.change(screen.getByPlaceholderText(/email/i), {
            target: { value: 'aigerim@example.com' },
        });
        fireEvent.change(screen.getByPlaceholderText(/username/i), {
            target: { value: 'aigerimdoe' },
        });
        fireEvent.change(screen.getByPlaceholderText(/^password$/i), {
            target: { value: 'password123' },
        });
        fireEvent.change(screen.getByPlaceholderText(/confirm password/i), {
            target: { value: 'password123' },
        });

        fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

        await waitFor(() => expect(mockRegisterUser).toHaveBeenCalled());

        expect(mockRegisterUser).toHaveBeenCalledWith(
            'Aigerim',
            'Doe',
            'aigerim@example.com',
            'aigerimdoe',
            'password123',
            'password123'
        );

        expect(mockNavigate).toHaveBeenCalledWith('/welcome');
    });

    it('navigates to login when "Log in" button is clicked', () => {
        render(<SignUpPage />, { wrapper: MemoryRouter });

        fireEvent.click(screen.getByRole('button', { name: /log in/i }));

        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
});