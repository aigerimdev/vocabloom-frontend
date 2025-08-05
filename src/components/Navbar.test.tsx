import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';
import { AuthProvider } from '../context/useAuth';

describe('Navbar component', () => {
    const renderWithRouter = () =>
        render(
            <MemoryRouter>
                <AuthProvider>
                    <Navbar />
                </AuthProvider>
            </MemoryRouter>
        );

    it('renders the main title', () => {
        renderWithRouter();
        expect(screen.getByText(/vocabloom/i)).toBeInTheDocument();
    });

    it('renders the Home link', () => {
        renderWithRouter();
        const homeLink = screen.getByRole('link', { name: /home/i });
        expect(homeLink).toBeInTheDocument();
        expect(homeLink).toHaveAttribute('href', '/');
    });

    it('renders the Logout button', () => {
        renderWithRouter();
        const logoutButton = screen.getByRole('button', { name: /log out/i });
        expect(logoutButton).toBeInTheDocument();
    });
});