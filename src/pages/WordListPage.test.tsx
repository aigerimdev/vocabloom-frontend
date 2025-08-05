import { render, screen } from '@testing-library/react';
import WordListPage from './WordListPage';
import { get_saved_words } from '../endpoints/api';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../endpoints/api', () => ({
    get_saved_words: jest.fn(),
}));

describe('WordListPage', () => {
    const mockWords = [
        { id: 1, word: 'apple', tag: 1, phonetic: '', audio: '', meanings: [] },
        { id: 2, word: 'banana', tag: 2, phonetic: '', audio: '', meanings: [] },
    ];

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('displays loading state first', async () => {
        (get_saved_words as jest.Mock).mockResolvedValue(mockWords);

        render(<WordListPage />, { wrapper: MemoryRouter });
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('shows all saved words when no tagId is in query', async () => {
        (get_saved_words as jest.Mock).mockResolvedValue(mockWords);

        render(<WordListPage />, {
            wrapper: ({ children }) => (
                <MemoryRouter initialEntries={['/my-words']}>{children}</MemoryRouter>
            ),
        });

        expect(await screen.findByText(/my word list/i)).toBeInTheDocument();
        expect(await screen.findByText('apple')).toBeInTheDocument();
        expect(await screen.findByText('banana')).toBeInTheDocument();
    });

    it('filters words by tagId in query', async () => {
        (get_saved_words as jest.Mock).mockResolvedValue(mockWords);

        render(<WordListPage />, {
            wrapper: ({ children }) => (
                <MemoryRouter initialEntries={['/my-words?tagId=1']}>{children}</MemoryRouter>
            ),
        });

        expect(await screen.findByText(/words in selected tag/i)).toBeInTheDocument();
        expect(await screen.findByText('apple')).toBeInTheDocument();
        expect(screen.queryByText('banana')).not.toBeInTheDocument();
    });

    it('shows message when no words match the tag', async () => {
        (get_saved_words as jest.Mock).mockResolvedValue(mockWords);

        render(<WordListPage />, {
            wrapper: ({ children }) => (
                <MemoryRouter initialEntries={['/my-words?tagId=99']}>{children}</MemoryRouter>
            ),
        });

        expect(await screen.findByText(/no words found for this tag/i)).toBeInTheDocument();
    });

    it('shows message when no words at all', async () => {
        (get_saved_words as jest.Mock).mockResolvedValue([]);

        render(<WordListPage />, { wrapper: MemoryRouter });

        expect(await screen.findByText(/no words found/i)).toBeInTheDocument();
    });
});