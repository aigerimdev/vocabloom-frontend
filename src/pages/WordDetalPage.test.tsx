import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import WordDetailPage from './WordDetailPage';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => {
    const actual = jest.requireActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useParams: () => ({ id: '1' }),
    };
});

describe('WordDetailPage', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    const mockWordData = {
        id: 1,
        word: 'apple',
        phonetic: 'ˈæpəl',
        audio: 'https://example.com/audio.mp3',
        meanings: [
            {
                part_of_speech: 'noun',
                definitions: [
                    { definition: 'A fruit.', example: 'An apple a day keeps the doctor away.' },
                ],
            },
        ],
    };

    it('shows loading initially', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: mockWordData });

        render(<WordDetailPage />, { wrapper: MemoryRouter });

        expect(screen.getByText(/loading word/i)).toBeInTheDocument();
        await waitFor(() => expect(mockedAxios.get).toHaveBeenCalled());
    });

    it('displays word details on success', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: mockWordData });

        render(<WordDetailPage />, { wrapper: MemoryRouter });

        expect(await screen.findByText('apple')).toBeInTheDocument();
        expect(screen.getByText('/ˈæpəl/')).toBeInTheDocument();
        expect(screen.getByText(/a fruit\./i)).toBeInTheDocument();
        expect(screen.getByText(/an apple a day/i)).toBeInTheDocument();
    });

    it('shows "Word not found" when 404', async () => {
        mockedAxios.get.mockRejectedValueOnce({ response: { status: 404 } });

        render(<WordDetailPage />, { wrapper: MemoryRouter });

        expect(await screen.findByText(/word not found/i)).toBeInTheDocument();
    });

    it('deletes the word and navigates to /my-words', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: mockWordData });
        mockedAxios.delete.mockResolvedValueOnce({});

        render(<WordDetailPage />, { wrapper: MemoryRouter });

        const deleteButton = await screen.findByText(/delete word/i);
        fireEvent.click(deleteButton);

        // await waitFor(() => {
        //     expect(mockedAxios.delete).toHaveBeenCalledWith(
        //         expect.stringContaining('/words/1/'),
        //         expect.any(Object)
        //     );
        //     expect(mockNavigate).toHaveBeenCalledWith('/my-words');
        // });
        await waitFor(() => {
            expect(mockedAxios.delete).toHaveBeenCalled();
        });

        expect(mockedAxios.delete).toHaveBeenCalledWith(
            expect.stringContaining('/words/1/'),
            expect.any(Object)
        );

        expect(mockNavigate).toHaveBeenCalledWith('/my-words');
    });
});