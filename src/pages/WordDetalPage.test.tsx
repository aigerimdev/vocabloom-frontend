import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WordDetailPage from './WordDetailPage';


const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    useParams: () => ({ id: '5' }),
    useNavigate: () => mockNavigate,
}));

jest.mock('axios', () => ({
    get: jest.fn(),
    delete: jest.fn(),
}));

jest.mock('../endpoints/api', () => ({
    getAuthConfig: jest.fn(() => ({ headers: { Authorization: 'Bearer token' } })),
}));

jest.mock('../components/WordNote', () => () => <div data-testid="word-note" />);
jest.mock('../components/AudioButton', () => () => <button>Example Audio</button>);
jest.mock('../components/UserExample', () => () => <div data-testid="user-example" />);


jest.mock('@fortawesome/react-fontawesome', () => ({
    FontAwesomeIcon: (props: any) => (
        <button aria-label="Delete word" className={props.className} onClick={props.onClick} />
    ),
}));

jest.mock('../components/ConfirmationModal', () => (props: any) => {
    if (!props.isOpen) return null;
    return (
        <div data-testid="modal">
            <div>{props.title}</div>
            <div>{props.message}</div>
            <button onClick={props.onCancel}>{props.cancelText || 'Cancel'}</button>
            <button onClick={props.onConfirm}>{props.confirmText || 'OK'}</button>
        </div>
    );
});

const axios = require('axios') as { get: jest.Mock; delete: jest.Mock };
const { getAuthConfig } = require('../endpoints/api') as { getAuthConfig: jest.Mock };

beforeEach(() => {
    jest.clearAllMocks();
});

function mockWordResponse() {
    axios.get.mockResolvedValueOnce({
        data: {
            id: 5,
            word: 'serendipity',
            phonetic: 'ˌserənˈdipədē',
            audio: 'https://audio/serendipity.mp3',
            meanings: [
                {
                    part_of_speech: 'noun',
                    definitions: [
                        { definition: 'The occurrence of events by chance.', example: 'A fortunate serendipity.' },
                        { definition: 'An aptitude for making desirable discoveries by accident.' },
                    ],
                },
            ],
        },
    });
}

test('loads word, normalizes meanings, renders details', async () => {
    mockWordResponse();

    render(<WordDetailPage />);

    expect(screen.getByText(/loading word/i)).toBeInTheDocument();

    expect(await screen.findByRole('heading', { name: /serendipity/i })).toBeInTheDocument();

    expect(screen.getByText(/ˌserənˈdipədē/)).toBeInTheDocument();

    const audioEl = await screen.findByTestId('word-audio');
    expect(audioEl).toBeInTheDocument();
    expect(audioEl).toHaveAttribute('src', 'https://audio/serendipity.mp3');

    expect(screen.getByRole('heading', { name: /noun/i })).toBeInTheDocument();

    expect(screen.getByText(/the occurrence of events by chance/i)).toBeInTheDocument();
    expect(screen.getByText(/an aptitude for making desirable discoveries/i)).toBeInTheDocument();
    expect(screen.getByText(/example audio/i)).toBeInTheDocument();

    expect(screen.getByTestId('word-note')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /back/i }));
    expect(mockNavigate).toHaveBeenCalledWith(-1);

    expect(getAuthConfig).toHaveBeenCalled();
    expect((axios.get as jest.Mock).mock.calls[0][0]).toBe(
        'https://vocabloom-backend.onrender.com/api/words/5/'
    );
});

test('404 shows "Word not found."', async () => {
    axios.get.mockRejectedValueOnce({ response: { status: 404 } });

    render(<WordDetailPage />);

    expect(await screen.findByText(/word not found/i)).toBeInTheDocument();
});

test('Delete flow: opens modal, confirms -> deletes and navigates', async () => {
    mockWordResponse();
    axios.delete.mockResolvedValueOnce({});

    render(<WordDetailPage />);

    await userEvent.click(await screen.findByRole('button', { name: /delete word/i }));

    const modal = await screen.findByTestId('modal');
    await userEvent.click(within(modal).getByRole('button', { name: /delete/i }));

    expect(axios.delete.mock.calls[0][0]).toBe(
        'https://vocabloom-backend.onrender.com/api/words/5/'
    );

    expect(getAuthConfig).toHaveBeenCalled();

    expect(mockNavigate).toHaveBeenCalledWith('/my-words', { replace: true });
});


test('Delete flow: cancel keeps you on page (no delete)', async () => {
    mockWordResponse();

    render(<WordDetailPage />);

    await userEvent.click(await screen.findByRole('button', { name: /delete word/i }));

    const modal = await screen.findByTestId('modal');
    await userEvent.click(within(modal).getByRole('button', { name: /cancel/i }));

    expect(axios.delete).not.toHaveBeenCalled();

    expect(screen.getByRole('heading', { name: /serendipity/i })).toBeInTheDocument();
});
