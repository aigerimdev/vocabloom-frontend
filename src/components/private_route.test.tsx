import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './private_route';


const mockAuth: { isAuthenticated?: boolean; loading?: boolean } = {};
jest.mock('../context/useAuth', () => ({
    useAuth: () => ({
        isAuthenticated: mockAuth.isAuthenticated ?? false,
        loading: mockAuth.loading ?? false,
    }),
}));

function AppUnderTest() {
    return (
        <Routes>
            <Route
                path="/protected"
                element={
                    <PrivateRoute>
                        <h1>Secret</h1>
                    </PrivateRoute>
                }
            />
            <Route path="/" element={<h1>Public</h1>} />
        </Routes>
    );
}

const renderAt = (path: string) =>
    render(
        <MemoryRouter initialEntries={[path]}>
            <AppUnderTest />
        </MemoryRouter>
    );

beforeEach(() => {
    mockAuth.isAuthenticated = false;
    mockAuth.loading = false;
});

test('shows loading when loading', () => {
    mockAuth.loading = true;
    renderAt('/protected');
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
});

test('renders children when authenticated', () => {
    mockAuth.isAuthenticated = true;
    renderAt('/protected');
    expect(screen.getByText('Secret')).toBeInTheDocument();
});

test('redirects to "/" when not authenticated', () => {
    mockAuth.isAuthenticated = false;
    renderAt('/protected');
    expect(screen.getByText('Public')).toBeInTheDocument();
});
