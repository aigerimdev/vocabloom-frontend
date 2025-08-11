import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WelcomePage from './WelcomePage';


const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

beforeEach(() => {
    jest.clearAllMocks();
});

test('renders title, subtitle, and footer', () => {
    render(<WelcomePage />);

    expect(
        screen.getByRole('heading', { name: /welcome to\s*vocabloom/i })
    ).toBeInTheDocument();

    expect(
        screen.getByText(/every word you learn is a seed for your future/i)
    ).toBeInTheDocument();

    expect(
        screen.getByText(/made with/i)
    ).toBeInTheDocument();

    expect(
        screen.getByRole('navigation', { name: /authentication/i })
    ).toBeInTheDocument();
});

test('clicking "Sign in" navigates to /login', async () => {
    const user = userEvent.setup();
    render(<WelcomePage />);

    await user.click(screen.getByRole('button', { name: /sign in/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/login');
});

test('clicking "Sign up" navigates to /signup', async () => {
    const user = userEvent.setup();
    render(<WelcomePage />);

    await user.click(screen.getByRole('button', { name: /sign up/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/signup');
});
