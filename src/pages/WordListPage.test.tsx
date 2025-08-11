import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WordListPage from './WordListPage';

const mockUseLocation = jest.fn();
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    useLocation: () => mockUseLocation(),
    useNavigate: () => mockNavigate,
}));

jest.mock('../endpoints/api', () => ({
    get_saved_words: jest.fn(),
    get_tag_by_id: jest.fn(),
}));

const { get_saved_words, get_tag_by_id } = jest.requireMock('../endpoints/api') as {
    get_saved_words: jest.Mock;
    get_tag_by_id: jest.Mock;
};

beforeEach(() => {
    jest.clearAllMocks();
});

const words = [
    { id: 1, word: 'alpha', tag: 7 },
    { id: 2, word: 'beta', tag: 9 },
    { id: 3, word: 'gamma', tag: 7 },
];

test('no tagId: shows "My Word List", renders words, and navigates to detail on click', async () => {
    mockUseLocation.mockReturnValue({ search: '' });
    get_saved_words.mockResolvedValueOnce(words);

    render(<WordListPage />);

    expect(await screen.findByRole('heading', { name: /my word list/i })).toBeInTheDocument();

    expect(await screen.findByText(/alpha/i)).toBeInTheDocument();
    expect(await screen.findByText(/beta/i)).toBeInTheDocument();
    expect(await screen.findByText(/gamma/i)).toBeInTheDocument();

    await userEvent.click(screen.getByText(/alpha/i));
    expect(mockNavigate).toHaveBeenCalledWith('/my-words/1');
});

test('with tagId: filters words by tag and shows "<Tag> Collection"', async () => {
    mockUseLocation.mockReturnValue({ search: '?tagId=7' });
    get_saved_words.mockResolvedValueOnce(words);
    get_tag_by_id.mockResolvedValueOnce({ id: 7, name: 'Science' });

    render(<WordListPage />);

    expect(await screen.findByRole('heading', { name: /science collection/i })).toBeInTheDocument();

    expect(await screen.findByText(/alpha/i)).toBeInTheDocument();
    expect(await screen.findByText(/gamma/i)).toBeInTheDocument();
    expect(screen.queryByText(/beta/i)).not.toBeInTheDocument();
});

test('with tagId but no matching words: shows "No words found for this tag."', async () => {
    mockUseLocation.mockReturnValue({ search: '?tagId=42' });
    get_saved_words.mockResolvedValueOnce(words);
    get_tag_by_id.mockResolvedValueOnce({ id: 42, name: 'Empty' });

    render(<WordListPage />);

    expect(await screen.findByText(/no words found for this tag\./i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /empty collection/i })).toBeInTheDocument();
});

test('Back button navigates -1', async () => {
    mockUseLocation.mockReturnValue({ search: '' });
    get_saved_words.mockResolvedValueOnce([]);

    render(<WordListPage />);

    await screen.findByRole('heading', { name: /my word list/i });

    await userEvent.click(screen.getByRole('button', { name: /back/i }));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
});
