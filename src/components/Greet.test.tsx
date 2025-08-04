import { render, screen } from '@testing-library/react';
import Greet from './Greet';

test('renders greeting message', () => {
    render(<Greet />);
    const heading = screen.getByText(/hello, ada/i);
    expect(heading).toBeInTheDocument();
});
