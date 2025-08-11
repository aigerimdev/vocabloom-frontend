import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

export const renderWithRouter = (ui: React.ReactElement, route = '/') =>
    render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>);
