import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignUpPage from './SingUpPage'; // keep your actual filename
import { useAuth as mockUseAuth } from '../context/useAuth';

const mockRegisterUser = jest.fn();
const mockNavigate = jest.fn();

// Mock only what the component uses; do NOT requireActual.
jest.mock('../context/useAuth');
jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

const renderUI = () => render(<SignUpPage />);

beforeEach(() => {
    jest.clearAllMocks();
    (mockUseAuth as unknown as jest.Mock).mockReturnValue({
        register_user: mockRegisterUser,
    });
});

it('fills and submits the form (success)', async () => {
    const user = userEvent.setup();
    mockRegisterUser.mockResolvedValueOnce({});

    renderUI();

    await user.type(screen.getByPlaceholderText(/first name/i), 'Aigerim');
    await user.type(screen.getByPlaceholderText(/last name/i), 'Doe');
    await user.type(screen.getByPlaceholderText(/email/i), 'aigerim@example.com');
    await user.type(screen.getByPlaceholderText(/username/i), 'aigerimdoe');
    await user.type(screen.getByPlaceholderText(/^password$/i), 'password123');
    await user.type(screen.getByPlaceholderText(/confirm password/i), 'password123');

    await user.click(screen.getByRole('button', { name: /sign up/i }));

    expect(mockRegisterUser).toHaveBeenCalledWith(
        'Aigerim',
        'Doe',
        'aigerim@example.com',
        'aigerimdoe',
        'password123',
        'password123'
    );
    expect(mockNavigate).toHaveBeenCalledWith('/signup');
});

it('navigates to login when "Log in" is clicked', async () => {
    const user = userEvent.setup();
    renderUI();

    await user.click(screen.getByRole('button', { name: /log in/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/login');
});
