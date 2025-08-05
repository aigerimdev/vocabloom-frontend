import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TagBrowserPage from './TagBrowserPage';
import { get_tags, create_tag } from '../endpoints/api';
import { MemoryRouter } from 'react-router-dom';

const mockNavigate = jest.fn();

jest.mock('../endpoints/api', () => ({
    get_tags: jest.fn(),
    create_tag: jest.fn(),
}));

jest.mock('react-router-dom', () => {
    const actual = jest.requireActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('TagBrowserPage', () => {
    const mockTags = [
        { id: 1, name: 'Food' },
        { id: 2, name: 'Travel' },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        (get_tags as jest.Mock).mockResolvedValue(mockTags);
    });

    it('fetches and displays tags', async () => {
        render(<TagBrowserPage />, { wrapper: MemoryRouter });

        expect(await screen.findByText('Food')).toBeInTheDocument();
        expect(await screen.findByText('Travel')).toBeInTheDocument();
    });


    it('navigates when a tag is clicked', async () => {
        render(<TagBrowserPage />, { wrapper: MemoryRouter });

        const foodTag = await screen.findByText('Food');
        fireEvent.click(foodTag);


        expect(mockNavigate).toHaveBeenCalledWith('/my-words?tagId=1&tagName=Food');
    });

    it('shows input when "+" is clicked and adds new tag', async () => {
        render(<TagBrowserPage />, { wrapper: MemoryRouter });

        fireEvent.click(screen.getByText('+'));

        const input = screen.getByPlaceholderText(/enter tag/i);
        fireEvent.change(input, { target: { value: 'Work' } });

        (create_tag as jest.Mock).mockResolvedValueOnce({ id: 3, name: 'Work' });

        fireEvent.click(screen.getByText('✓'));

        await waitFor(() => {
            expect(screen.getByText('Work')).toBeInTheDocument();
        });
    });

    it('navigates back when "← Back" is clicked', () => {
        render(<TagBrowserPage />, { wrapper: MemoryRouter });

        fireEvent.click(screen.getByText(/← back/i));
        expect(mockNavigate).toHaveBeenCalledWith(-1);
    });
});
