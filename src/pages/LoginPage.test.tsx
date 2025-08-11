import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from './LoginPage';
import { useAuth as mockUseAuth } from '../context/useAuth';

const mockNavigate = jest.fn();
const mockLogin = jest.fn();

jest.mock('../context/useAuth');
jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

const renderUI = () => render(<LoginPage />);

beforeEach(() => {
    jest.clearAllMocks();
    (mockUseAuth as unknown as jest.Mock).mockReturnValue({
        login_user: mockLogin,
    });
});

test('successful login submits credentials and navigates to "/"', async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValueOnce({});

    renderUI();

    await user.type(screen.getByLabelText(/username/i), 'aigerim');
    await user.type(screen.getByLabelText(/password/i), 'Secret123!');
    await user.click(screen.getByRole('button', { name: /log in/i }));

    expect(mockLogin).toHaveBeenCalledWith('aigerim', 'Secret123!');
    expect(mockNavigate).toHaveBeenCalledWith('/');
    expect(screen.queryByText(/invalid username or password/i)).not.toBeInTheDocument();
});

test('failed login shows error and does not navigate', async () => {
    const user = userEvent.setup();
    mockLogin.mockRejectedValueOnce(new Error('bad creds'));

    renderUI();

    await user.type(screen.getByLabelText(/username/i), 'aigerim');
    await user.type(screen.getByLabelText(/password/i), 'wrongpass');
    await user.click(screen.getByRole('button', { name: /log in/i }));

    expect(mockLogin).toHaveBeenCalledWith('aigerim', 'wrongpass');
    expect(await screen.findByText(/invalid username or password/i)).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalledWith('/');
});

test('clicking "Sign up" navigates to /signup', async () => {
    const user = userEvent.setup();
    renderUI();

    await user.click(screen.getByRole('button', { name: /sign up/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/signup');
});

test('pressing Enter/Space on "Sign up" navigates to /signup', async () => {
    const user = userEvent.setup();
    renderUI();

    const signUpBtn = screen.getByRole('button', { name: /sign up/i });
    signUpBtn.focus();
    await user.keyboard('{Enter}');
    expect(mockNavigate).toHaveBeenCalledWith('/signup');

    jest.clearAllMocks();
    signUpBtn.focus();
    await user.keyboard(' ');
    expect(mockNavigate).toHaveBeenCalledWith('/signup');
});
