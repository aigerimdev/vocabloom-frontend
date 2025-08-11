import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HomePage from './HomePage';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

jest.mock('../endpoints/api', () => ({
    get_tags: jest.fn(),
    save_word: jest.fn(),
}));
jest.mock('../api/dictionary', () => ({
    getWordData: jest.fn(),
}));

const { get_tags, save_word } = jest.requireMock('../endpoints/api') as {
    get_tags: jest.Mock;
    save_word: jest.Mock;
};
const { getWordData } = jest.requireMock('../api/dictionary') as {
    getWordData: jest.Mock;
};

jest.mock('../components/SearchBar', () => (props: any) => (
    <div>
        <input
            aria-label="search-input"
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
        />
        <button onClick={props.onSearch}>Search</button>
    </div>
));

jest.mock('../components/WordResultCard', () => (props: any) => (
    <div data-testid="word-card">
        <div>Word: {props.data.word}</div>
        <button onClick={props.onClose}>Close</button>
        <button onClick={() => props.onSave({ ...props.data, tag: null })}>Save</button>
    </div>
));

jest.mock('../components/PersonalWordForm', () => (props: any) =>
    props.isOpen ? (
        <div data-testid="personal-form">
            <button onClick={() => props.onSave({ id: 999, word: 'custom', meanings: [], phonetic: '', audio: '', tag: null })}>
                Save Personal Word
            </button>
            <button onClick={props.onClose}>Close Form</button>
        </div>
    ) : null
);

beforeEach(() => {
    jest.clearAllMocks();
    get_tags.mockResolvedValue([{ id: 1, name: 'Nouns' }]);
    save_word.mockResolvedValue({ ok: true });
    window.localStorage.clear();
});

test('navigates to Word List and Tag pages via buttons', async () => {
    render(<HomePage />);

    await userEvent.click(screen.getByRole('button', { name: /my word list/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/my-words');

    await userEvent.click(screen.getByRole('button', { name: /browse by tag/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/tags');
});

test('successful search shows result card; Close hides it', async () => {
    const user = userEvent.setup();
    getWordData.mockResolvedValueOnce({
        id: 10,
        word: 'orchid',
        phonetic: '',
        audio: '',
        meanings: [],
    });

    render(<HomePage />);

    await user.type(screen.getByLabelText(/search-input/i), 'orchid');
    await user.click(screen.getByText(/^search$/i));

    expect(await screen.findByTestId('word-card')).toBeInTheDocument();
    expect(screen.getByText(/word:\s*orchid/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /close/i }));
    expect(screen.queryByTestId('word-card')).not.toBeInTheDocument();
});

test('failed search shows "Sorry! Word not found."', async () => {
    const user = userEvent.setup();
    getWordData.mockRejectedValueOnce(new Error('not found'));

    render(<HomePage />);

    await user.type(screen.getByLabelText(/search-input/i), 'unknown');
    await user.click(screen.getByText(/^search$/i));

    expect(await screen.findByText(/sorry! word not found\./i)).toBeInTheDocument();
});

test('saving from result card calls save_word and shows alert', async () => {
    const user = userEvent.setup();
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => { });
    getWordData.mockResolvedValueOnce({
        id: 11,
        word: 'bamboo',
        phonetic: '',
        audio: '',
        meanings: [],
    });

    render(<HomePage />);

    await user.type(screen.getByLabelText(/search-input/i), 'bamboo');
    await user.click(screen.getByText(/^search$/i));
    expect(await screen.findByTestId('word-card')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /^save$/i }));

    expect(save_word).toHaveBeenCalledWith(
        expect.objectContaining({ word: 'bamboo', tag: null })
    );
    expect(alertSpy).toHaveBeenCalledWith(expect.stringMatching(/"bamboo" saved successfully/i));

    alertSpy.mockRestore();
});

test('opens PersonalWordForm and saves a custom word', async () => {
    const user = userEvent.setup();
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => { });

    render(<HomePage />);

    await user.click(screen.getByRole('button', { name: /create your own word/i }));
    expect(await screen.findByTestId('personal-form')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /save personal word/i }));
    expect(save_word).toHaveBeenCalledWith(
        expect.objectContaining({ word: 'custom', tag: null })
    );
    expect(alertSpy).toHaveBeenCalledWith(expect.stringMatching(/"custom" saved successfully/i));

    alertSpy.mockRestore();
});
