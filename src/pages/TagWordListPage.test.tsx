import { render, screen } from '@testing-library/react';
import TagWordListPage from './TagWordListPage';

const mockUseLocation = jest.fn();
jest.mock('react-router-dom', () => ({
    useLocation: () => mockUseLocation(),
}));

jest.mock('../endpoints/api', () => ({
    get_words_by_tag: jest.fn(),
}));
const { get_words_by_tag } = jest.requireMock('../endpoints/api') as {
    get_words_by_tag: jest.Mock;
};

beforeEach(() => {
    jest.clearAllMocks();
});

test('renders "<tagName> Words" and shows words from API', async () => {
    mockUseLocation.mockReturnValue({ search: '?tagId=7&tagName=Science' });
    get_words_by_tag.mockResolvedValueOnce([{ word: 'Alpha' }, { word: 'Beta' }] as any);

    render(<TagWordListPage />);

    expect(await screen.findByRole('heading', { name: /science words/i })).toBeInTheDocument();
    expect(await screen.findByText(/alpha/i)).toBeInTheDocument();
    expect(screen.getByText(/beta/i)).toBeInTheDocument();
    expect(screen.queryByText(/no words saved under this tag yet\./i)).not.toBeInTheDocument();
});

test('shows not-found message when API returns empty array', async () => {
    mockUseLocation.mockReturnValue({ search: '?tagId=7&tagName=Science' });
    get_words_by_tag.mockResolvedValueOnce([] as any);

    render(<TagWordListPage />);
    expect(await screen.findByText(/no words saved under this tag yet\./i)).toBeInTheDocument();
});

test('shows not-found message when API returns non-array (error path)', async () => {
    mockUseLocation.mockReturnValue({ search: '?tagId=7&tagName=Science' });
    get_words_by_tag.mockResolvedValueOnce(undefined as any);

    render(<TagWordListPage />);
    expect(await screen.findByText(/no words saved under this tag yet\./i)).toBeInTheDocument();
});

test('when tagId is missing, does not call API and shows no not-found message', async () => {
    mockUseLocation.mockReturnValue({ search: '?tagName=Science' });
    render(<TagWordListPage />);

    expect(get_words_by_tag).not.toHaveBeenCalled();

    expect(screen.getByRole('heading', { name: /science words/i })).toBeInTheDocument();

    expect(screen.queryByText(/no words saved under this tag yet\./i)).not.toBeInTheDocument();
});
