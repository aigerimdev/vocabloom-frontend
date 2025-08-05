import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './private_route';
import { useAuth as mockUseAuth } from '../context/useAuth';

jest.mock('../context/useAuth');

const MockChild = () => <div>Secret Page</div>;

describe('PrivateRoute', () => {
    it('shows loading when loading is true', () => {
        (mockUseAuth as jest.Mock).mockReturnValue({ isAuthenticated: false, loading: true });

        render(
            <MemoryRouter>
                <PrivateRoute>
                    <MockChild />
                </PrivateRoute>
            </MemoryRouter>
        );

        expect(screen.getByText(/loading.../i)).toBeInTheDocument();
    });

    it('renders children if authenticated', () => {
        (mockUseAuth as jest.Mock).mockReturnValue({ isAuthenticated: true, loading: false });

        render(
            <MemoryRouter>
                <PrivateRoute>
                    <MockChild />
                </PrivateRoute>
            </MemoryRouter>
        );

        expect(screen.getByText(/secret page/i)).toBeInTheDocument();
    });

    it('redirects to /login if not authenticated', () => {
        (mockUseAuth as jest.Mock).mockReturnValue({ isAuthenticated: false, loading: false });

        render(
            <MemoryRouter initialEntries={['/protected']}>
                <Routes>
                    <Route
                        path="/protected"
                        element={
                            <PrivateRoute>
                                <MockChild />
                            </PrivateRoute>
                        }
                    />
                    <Route path="/login" element={<div>Login Page</div>} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText(/login page/i)).toBeInTheDocument();
    });
});