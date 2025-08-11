import { render, screen } from '@testing-library/react';
import SavedWordCard from './SavedWordCard';
import { WordData } from '../types/word';

const mockData: WordData = {
    id: 1,
    word: 'test',
    phonetic: 'tɛst',
    audio: 'https://example.com/audio.mp3',
    meanings: [
        {
            partOfSpeech: 'noun',
            definitions: [{ definition: 'A procedure for critical evaluation.', example: 'A spelling test.' }],
        },
    ],
    tag: 1,
};

describe('SavedWordCard', () => {
    it('renders the word', () => {
        render(<SavedWordCard data={mockData} />);
        expect(screen.getByRole('heading', { level: 2, name: /test/i })).toBeInTheDocument();
    });

    it('renders phonetic', () => {
        render(<SavedWordCard data={mockData} />);
        expect(screen.getByText('/tɛst/')).toBeInTheDocument();
    });

    it('renders audio element', () => {
        render(<SavedWordCard data={mockData} />);
        const audio = screen.getByLabelText(/audio player/i);
        expect(audio).toBeInTheDocument();
    });

    it('renders definition and example', () => {
        render(<SavedWordCard data={mockData} />);
        expect(screen.getByText(/a procedure for critical evaluation/i)).toBeInTheDocument();
        expect(screen.getByText(/a spelling test/i)).toBeInTheDocument();
    });

    it('renders tag', () => {
        render(<SavedWordCard data={mockData} />);
        expect(screen.getByText(/tag:\s*1/i)).toBeInTheDocument();
    });
});