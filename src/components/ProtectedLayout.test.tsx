import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedLayout from './ProtectedLayout';

jest.mock('./Navbar', () => () => <div>Mock Navbar</div>);

describe('ProtectedLayout', () => {
    it('renders Navbar and child route content', () => {
        render(
            <MemoryRouter initialEntries={['/dashboard']}>
                <Routes>
                    <Route element={<ProtectedLayout />}>
                        <Route path="/dashboard" element={<div>Child Page</div>} />
                    </Route>
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText(/mock navbar/i)).toBeInTheDocument();
        expect(screen.getByText(/child page/i)).toBeInTheDocument();
    });
});
