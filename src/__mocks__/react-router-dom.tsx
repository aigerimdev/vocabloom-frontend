import React from 'react';

const navigate = jest.fn();
export const useNavigate = () => navigate;
export const __navigateMock = navigate; // to access in tests if needed

export const Link = ({ to, children, ...rest }: any) => (
    <a href={to} {...rest}>{children}</a>
);

export const Navigate = ({ to }: { to: string }) => (
    <div data-testid="navigate" data-to={to} />
);

export const Outlet = () => <div data-testid="outlet" />;

// Light-weight shells so components render
export const MemoryRouter = ({ children }: any) => <div data-testid="memory-router">{children}</div>;
export const Routes = ({ children }: any) => <>{children}</>;
export const Route = ({ element }: any) => <>{element}</>;
