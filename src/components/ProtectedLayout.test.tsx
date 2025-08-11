import { render, screen } from '@testing-library/react';
import ProtectedLayout from './ProtectedLayout';

jest.mock('react-router-dom');
jest.mock('./Navbar', () => () => <div data-testid="navbar-stub" />);

test('renders Navbar and outlet content area', () => {
    render(<ProtectedLayout />);
    expect(screen.getByTestId('navbar-stub')).toBeInTheDocument();
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
});