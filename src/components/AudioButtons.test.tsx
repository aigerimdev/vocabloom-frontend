import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AudioButton from './AudioButton';

jest.mock('../endpoints/api', () => ({
    convertTextToSpeech: jest.fn(),
    playAudio: jest.fn(),
}));

const { convertTextToSpeech, playAudio } = jest.requireMock('../endpoints/api') as {
    convertTextToSpeech: jest.Mock;
    playAudio: jest.Mock;
};

let alertSpy: jest.SpyInstance;

beforeEach(() => {
    jest.clearAllMocks();
    alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => { });
});

afterEach(() => {
    alertSpy.mockRestore();
});

function createDeferred() {
    let resolve!: () => void;
    let reject!: (reason?: any) => void;
    const promise = new Promise<void>((res, rej) => {
        resolve = res;
        reject = rej;
    });
    return { promise, resolve, reject };
}

test('button is disabled when text is empty or whitespace; enabled when text present', () => {
    const { rerender } = render(<AudioButton text="" />);
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();

    rerender(<AudioButton text="   " />);
    expect(screen.getByRole('button')).toBeDisabled();

    rerender(<AudioButton text="hello" />);
    expect(screen.getByRole('button')).toBeEnabled();
});

test('happy path: converts text, plays audio, toggles playing class', async () => {
    const user = userEvent.setup();
    const d = createDeferred();

    convertTextToSpeech.mockResolvedValueOnce('blob:https://audio/url');
    playAudio.mockReturnValueOnce(d.promise);

    render(<AudioButton text="orchid" />);

    const btn = screen.getByRole('button');
    await user.click(btn);

    expect(convertTextToSpeech).toHaveBeenCalledWith('orchid', 'Joanna');
    expect(btn).toHaveClass('playing'); // during playback

    // Finish playback and flush state updates
    await act(async () => { d.resolve(); });

    // ONE assertion per waitFor (lint-safe)
    await waitFor(() =>
        expect(playAudio).toHaveBeenCalledWith('blob:https://audio/url')
    );
    await waitFor(() =>
        expect(btn).not.toHaveClass('playing')
    );
    await waitFor(() =>
        expect(btn).not.toHaveClass('loading')
    );

    expect(alertSpy).not.toHaveBeenCalled();
});

test('when TTS returns null, shows failure alert and does not call playAudio', async () => {
    const user = userEvent.setup();
    convertTextToSpeech.mockResolvedValueOnce(null);

    render(<AudioButton text="bamboo" />);

    await user.click(screen.getByRole('button'));

    expect(convertTextToSpeech).toHaveBeenCalled();
    expect(playAudio).not.toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith('Failed to convert text to speech');
});

test('when playAudio rejects, shows error alert and clears playing state', async () => {
    const user = userEvent.setup();
    convertTextToSpeech.mockResolvedValueOnce('blob:https://audio/url');
    playAudio.mockRejectedValueOnce(new Error('boom'));

    render(<AudioButton text="sage" />);

    const btn = screen.getByRole('button');
    await user.click(btn);

    await waitFor(() =>
        expect(alertSpy).toHaveBeenCalledWith('Error playing audio')
    );
    await waitFor(() =>
        expect(btn).not.toHaveClass('playing')
    );
    await waitFor(() =>
        expect(btn).not.toHaveClass('loading')
    );
});