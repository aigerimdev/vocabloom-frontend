import * as RouterDom from 'react-router-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Logout from './Logout';
import { useAuth as mockUseAuth } from '../context/useAuth';

jest.mock('react-router-dom');                       // uses __mocks__/react-router-dom.tsx
jest.mock('../endpoints/api', () => ({ logout: jest.fn().mockResolvedValue(undefined) }));
jest.mock('../context/useAuth');                     // mock the auth hook

const nav = () => (RouterDom as any).useNavigate() as jest.Mock;

beforeEach(() => {
    nav().mockReset();
    (mockUseAuth as jest.Mock).mockReset();
    (require('../endpoints/api').logout as jest.Mock).mockClear();
});

test('clicking "Log out" calls API, clears auth, and navigates to /welcome', async () => {
    const setIsAuthenticated = jest.fn();
    (mockUseAuth as jest.Mock).mockReturnValue({ setIsAuthenticated });

    render(<Logout />);
    fireEvent.click(screen.getByRole('button', { name: /log out/i }));

    await waitFor(() => expect(require('../endpoints/api').logout).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(setIsAuthenticated).toHaveBeenCalledWith(false));
    await waitFor(() => expect(nav()).toHaveBeenCalledWith('/welcome'));
});