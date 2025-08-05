import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HomePage from './HomePage';
import { getWordData } from '../api/dictionary';
import { get_tags } from '../endpoints/api';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../api/dictionary');
jest.mock('../endpoints/api');

// Mock child components
jest.mock('../components/SearchBar', () => ({ value, onChange, onSearch }: any) => (
    <div>
        <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Search"
        />
        <button onClick={onSearch}>Search</button>
    </div>
));

jest.mock('../components/WordResultCard', () => ({ data }: any) => (
    <div>Word Card: {data.word}</div>
));

describe('HomePage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
        (get_tags as jest.Mock).mockResolvedValue([{ id: 1, name: 'Test' }]);
    });

    it('renders homepage with title', () => {
        render(<HomePage />, { wrapper: MemoryRouter });
        expect(screen.getByText(/vocabloom/i)).toBeInTheDocument();
    });

    it('calls getWordData on search and shows word card', async () => {
        (getWordData as jest.Mock).mockResolvedValueOnce({ word: 'apple' });

        render(<HomePage />, { wrapper: MemoryRouter });

        const input = screen.getByPlaceholderText('Search');
        fireEvent.change(input, { target: { value: 'apple' } });
        fireEvent.click(screen.getByText('Search'));

        await waitFor(() => {
            expect(screen.getByText(/word card: apple/i)).toBeInTheDocument();
        });
    });

    it('shows not found message if getWordData fails', async () => {
        (getWordData as jest.Mock).mockRejectedValueOnce(new Error('not found'));

        render(<HomePage />, { wrapper: MemoryRouter });

        const input = screen.getByPlaceholderText('Search');
        fireEvent.change(input, { target: { value: 'xyz' } });
        fireEvent.click(screen.getByText('Search'));

        await waitFor(() => {
            expect(screen.getByText(/word not found/i)).toBeInTheDocument();
        });
    });
});
