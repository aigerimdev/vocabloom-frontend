import { render, screen } from '@testing-library/react';
import TagWordListPage from './TagWordListPage';
import { get_words_by_tag } from '../endpoints/api';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../endpoints/api', () => ({
    get_words_by_tag: jest.fn(),
}));

describe('TagWordListPage', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('displays word list from tagId', async () => {
        (get_words_by_tag as jest.Mock).mockResolvedValue([
            { word: 'apple', id: 1, phonetic: '', audio: '', meanings: [] },
            { word: 'banana', id: 2, phonetic: '', audio: '', meanings: [] },
        ]);

        render(
            <MemoryRouter initialEntries={['/my-words?tagId=5&tagName=Fruits']}>
                <TagWordListPage />
            </MemoryRouter>
        );

        expect(await screen.findByText('Fruits Words')).toBeInTheDocument();
        expect(await screen.findByText('apple')).toBeInTheDocument();
        expect(await screen.findByText('banana')).toBeInTheDocument();
    });

    it('shows message when no words found', async () => {
        (get_words_by_tag as jest.Mock).mockResolvedValue([]);

        render(
            <MemoryRouter initialEntries={['/my-words?tagId=10&tagName=Empty']}>
                <TagWordListPage />
            </MemoryRouter>
        );

        expect(await screen.findByText('No words saved under this tag yet.')).toBeInTheDocument();
    });
});