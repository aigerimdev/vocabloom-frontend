import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../useAuth';
import { MemoryRouter } from 'react-router-dom';

const TestComponent = () => {
    const { isAuthenticated, loading } = useAuth();

    return (
        <div>
            <p>Authenticated: {isAuthenticated ? 'yes' : 'no'}</p>
            <p>Loading: {loading ? 'yes' : 'no'}</p>
        </div>
    );
};

describe('AuthProvider', () => {
    test('provides default auth values', async () => {
        render(
            <MemoryRouter>
                <AuthProvider>
                    <TestComponent />
                </AuthProvider>
            </MemoryRouter>
        );

        expect(screen.getByText(/Loading:/i)).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText(/Authenticated:/i)).toBeInTheDocument();
        });
    });
});
