// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import WordResultCard from './WordResultCard';
// import { save_word } from '../endpoints/api';
// import { WordData } from '../types/word';

// jest.mock('../endpoints/api', () => ({
//     save_word: jest.fn(),
// }));

// jest.mock('./TagDropdown', () => ({ onSelect }: any) => (
//     <button onClick={() => onSelect(1, 'Study')}>Select Tag</button>
// ));

// global.alert = jest.fn();

// const mockData: WordData = {
//     id: 1,
//     word: 'test',
//     phonetic: 'tɛst',
//     audio: 'https://example.com/audio.mp3',
//     meanings: [
//         {
//             partOfSpeech: 'noun',
//             definitions: [
//                 {
//                     definition: 'An attempt to find out something.',
//                     example: 'A spelling test.',
//                 },
//             ],
//         },
//     ],
// };

// const mockTags = [
//     { id: 1, name: 'Study' },
//     { id: 2, name: 'Travel' },
// ];

// describe('WordResultCard', () => {
//     it('renders word and save button', () => {
//         render(
//             <WordResultCard data={mockData} onSave={jest.fn()} tags={mockTags} setTags={jest.fn()} />
//         );

//         expect(screen.getByRole('heading', { name: /test/i })).toBeInTheDocument();
//         expect(screen.getByText(/save word/i)).toBeInTheDocument();
//     });

//     it('calls save_word and shows alert when saved', async () => {
//         (save_word as jest.Mock).mockResolvedValueOnce({ ...mockData, tag: 1 });

//         const setItemSpy = jest.spyOn(window.localStorage.__proto__, 'setItem');

//         render(
//             <WordResultCard data={mockData} onSave={jest.fn()} tags={mockTags} setTags={jest.fn()} />
//         );

//         fireEvent.click(screen.getByText(/select tag/i));

//         fireEvent.click(screen.getByText(/save word/i));

//         await waitFor(() => {
//             expect(save_word).toHaveBeenCalled();
//         });

//         expect(setItemSpy).toHaveBeenCalled();
//         expect(global.alert).toHaveBeenCalledWith(
//             'Your word is saved successfully to the "Study" tag.'
//         );
//     });
// });
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WordResultCard from './WordResultCard';
import { save_word } from '../endpoints/api';
import { WordData } from '../types/word';

jest.mock('../endpoints/api', () => ({ save_word: jest.fn() }));

// Stub TagDropdown: triggers onSelect(1, 'Study')
jest.mock('./TagDropdown', () => (props: any) => (
    <button onClick={() => props.onSelect(1, 'Study')}>Select Tag</button>
));

const mockData: WordData = {
    id: 1,
    word: 'test',
    phonetic: 'tɛst',
    audio: 'https://example.com/audio.mp3',
    meanings: [{ partOfSpeech: 'noun', definitions: [{ definition: 'x' }] }],
};

const mockTags = [
    { id: 1, name: 'Study' },
    { id: 2, name: 'Travel' },
];

describe('WordResultCard', () => {
    const user = userEvent.setup();

    it('renders word and Save button', () => {
        render(<WordResultCard data={mockData} onSave={jest.fn()} tags={mockTags} setTags={jest.fn()} />);
        expect(screen.getByRole('heading', { name: /test/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /save word/i })).toBeInTheDocument();
    });

    it('saves after selecting a tag (API called, onSave fired)', async () => {
        (save_word as jest.Mock).mockResolvedValueOnce({ ...mockData, tag: 1 });
        const onSave = jest.fn();

        render(<WordResultCard data={mockData} onSave={onSave} tags={mockTags} setTags={jest.fn()} />);

        await user.click(screen.getByRole('button', { name: /select tag/i }));
        await user.click(screen.getByRole('button', { name: /save word/i }));

        await waitFor(() => expect(save_word).toHaveBeenCalledTimes(1));
        expect(onSave).toHaveBeenCalledTimes(1);
    });

    it('handles duplicate save (API rejects, onSave NOT called)', async () => {
        (save_word as jest.Mock).mockRejectedValueOnce({
            response: { status: 400, data: { detail: 'Word already exists for this tag' } },
        });
        const onSave = jest.fn();

        render(<WordResultCard data={mockData} onSave={onSave} tags={mockTags} setTags={jest.fn()} />);

        await user.click(screen.getByRole('button', { name: /select tag/i }));
        await user.click(screen.getByRole('button', { name: /save word/i }));

        await waitFor(() => expect(save_word).toHaveBeenCalledTimes(1));
        expect(onSave).not.toHaveBeenCalled();
    });
});
