import { render, screen } from '@testing-library/react';
import WordListPage from './WordListPage';
import { get_saved_words, get_tag_by_id } from '../endpoints/api';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../endpoints/api', () => ({
    get_saved_words: jest.fn(),
    get_tag_by_id: jest.fn(),
}));

describe('WordListPage', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('shows loading state initially', () => {
        (get_saved_words as jest.Mock).mockImplementationOnce(() => new Promise(() => { }));

        render(<WordListPage />, { wrapper: MemoryRouter });

        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('shows "My Word List" title when no tagId is present', async () => {
        (get_saved_words as jest.Mock).mockResolvedValue([]);

        render(<WordListPage />, {
            wrapper: ({ children }) => (
                <MemoryRouter initialEntries={['/my-words']}>{children}</MemoryRouter>
            ),
        });

        expect(await screen.findByText(/my word list/i)).toBeInTheDocument();
    });

    it('shows dynamic tag name in title when tagId is present', async () => {
        (get_saved_words as jest.Mock).mockResolvedValue([
            { id: 1, word: 'ocean', tag: 10, phonetic: '', audio: '', meanings: [] },
        ]);
        (get_tag_by_id as jest.Mock).mockResolvedValue({ id: 10, name: 'Nature' });

        render(
            <MemoryRouter initialEntries={['/my-words?tagId=10']}>
                <WordListPage />
            </MemoryRouter>
        );

        expect(await screen.findByText('Nature Collection')).toBeInTheDocument();
        expect(await screen.findByText('ocean')).toBeInTheDocument();
    });

    it('falls back to "Loading..." title if tag name fetch fails', async () => {
        (get_saved_words as jest.Mock).mockResolvedValue([
            { id: 2, word: 'moon', tag: 99, phonetic: '', audio: '', meanings: [] },
        ]);
        (get_tag_by_id as jest.Mock).mockRejectedValue(new Error('Tag not found'));

        render(
            <MemoryRouter initialEntries={['/my-words?tagId=99']}>
                <WordListPage />
            </MemoryRouter>
        );

        expect(await screen.findByText('Loading...')).toBeInTheDocument();
    });

    it('filters words and only shows those with matching tagId', async () => {
        (get_saved_words as jest.Mock).mockResolvedValue([
            { id: 1, word: 'cat', tag: 1, phonetic: '', audio: '', meanings: [] },
            { id: 2, word: 'dog', tag: 2, phonetic: '', audio: '', meanings: [] },
        ]);
        (get_tag_by_id as jest.Mock).mockResolvedValue({ id: 1, name: 'Pets' });

        render(
            <MemoryRouter initialEntries={['/my-words?tagId=1']}>
                <WordListPage />
            </MemoryRouter>
        );

        expect(await screen.findByText('Pets Collection')).toBeInTheDocument();
        expect(await screen.findByText('cat')).toBeInTheDocument();
        expect(screen.queryByText('dog')).not.toBeInTheDocument();
    });

    it('shows message when no words match the tagId', async () => {
        (get_saved_words as jest.Mock).mockResolvedValue([
            { id: 1, word: 'apple', tag: 1, phonetic: '', audio: '', meanings: [] },
        ]);
        (get_tag_by_id as jest.Mock).mockResolvedValue({ id: 99, name: 'Travel' });

        render(
            <MemoryRouter initialEntries={['/my-words?tagId=99']}>
                <WordListPage />
            </MemoryRouter>
        );

        expect(await screen.findByText(/no words found for this tag/i)).toBeInTheDocument();
    });

    it('shows message when there are no saved words', async () => {
        (get_saved_words as jest.Mock).mockResolvedValue([]);

        render(<WordListPage />, { wrapper: MemoryRouter });

        expect(await screen.findByText(/no words found/i)).toBeInTheDocument();
    });
});