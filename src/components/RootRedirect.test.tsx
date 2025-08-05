import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import RootRedirect from './RootRedirect';
import { useAuth as mockUseAuth } from '../context/useAuth';

jest.mock('../context/useAuth');
jest.mock('../pages/WelcomePage', () => () => <div>Welcome Page</div>);

describe('RootRedirect', () => {
    it('shows loading initially', () => {
        (mockUseAuth as jest.Mock).mockReturnValue({ isAuthenticated: false, loading: true });

        render(
            <MemoryRouter>
                <RootRedirect />
            </MemoryRouter>
        );

        expect(screen.getByText(/loading.../i)).toBeInTheDocument();
    });

    it('redirects to /home if authenticated', async () => {
        (mockUseAuth as jest.Mock).mockReturnValue({ isAuthenticated: true, loading: false });

        render(
            <MemoryRouter initialEntries={['/']}>
                <Routes>
                    <Route path="/" element={<RootRedirect />} />
                    <Route path="/home" element={<div>Home Page</div>} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/home page/i)).toBeInTheDocument();
        });
    });

    it('shows WelcomePage if not authenticated', async () => {
        (mockUseAuth as jest.Mock).mockReturnValue({ isAuthenticated: false, loading: false });

        render(
            <MemoryRouter>
                <RootRedirect />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/welcome page/i)).toBeInTheDocument();
        });
    });
});