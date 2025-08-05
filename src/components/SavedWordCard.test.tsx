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
            definitions: [
                {
                    definition: 'A procedure for critical evaluation.',
                    example: 'A spelling test.',
                },
            ],
        },
    ],
    tag: 1,
};

describe('SavedWordCard', () => {
    test('renders the word', () => {
        render(<SavedWordCard data={mockData} />);
        expect(screen.getByText('test')).toBeInTheDocument();
    });

    test('renders phonetic', () => {
        render(<SavedWordCard data={mockData} />);
        expect(screen.getByText('/tɛst/')).toBeInTheDocument();
    });

    test('renders audio element', () => {
        render(<SavedWordCard data={mockData} />);
        expect(document.querySelector('audio')).toBeInTheDocument();
    });

    test('renders definition and example', () => {
        render(<SavedWordCard data={mockData} />);
        expect(screen.getByText(/a procedure for critical evaluation/i)).toBeInTheDocument();
        expect(screen.getByText(/a spelling test/i)).toBeInTheDocument();
    });

    test('renders tag', () => {
        render(<SavedWordCard data={mockData} />);
        expect(screen.getByText('Tag: 1')).toBeInTheDocument();
    });
});