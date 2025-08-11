import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserExample from './UserExample';
import type { WordData, UserExample as UserExampleType } from '../types/word';


jest.mock('../endpoints/api', () => ({
    __esModule: true,
    createUserExample: jest.fn(),
    deleteUserExample: jest.fn(),
    generateWordExamples: jest.fn(),
}));
const {
    createUserExample,
    deleteUserExample,
    generateWordExamples,
} = jest.requireMock('../endpoints/api') as {
    createUserExample: jest.Mock;
    deleteUserExample: jest.Mock;
    generateWordExamples: jest.Mock;
};

jest.mock('../components/AudioButton', () => () => <div data-testid="audio-btn" />);

const word: WordData = {
    id: 1,
    word: 'orchid',
    phonetic: '',
    audio: '',
    meanings: [],
    tag: null,
};

describe('UserExample', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('empty mode → click Create → save example calls API and updates list/callback', async () => {
        const user = userEvent.setup();
        const onExamplesUpdate = jest.fn();

        render(<UserExample word={word} initialExamples={[]} onExamplesUpdate={onExamplesUpdate} />);

        const createBtn = screen.getByRole('button', { name: /create an example/i });
        await user.click(createBtn);

        const textarea = screen.getByLabelText(/add your example/i) as HTMLTextAreaElement;

        const saveBtn = screen.getByRole('button', { name: /save example/i });
        expect(saveBtn).toBeDisabled();

        await user.type(textarea, 'My first example.');
        expect(saveBtn).toBeEnabled();

        const returned: UserExampleType = {
            id: 101, example_text: 'My first example.', created_at: '2025-01-01T00:00:00Z',
            word: 1,
        };
        createUserExample.mockResolvedValueOnce(returned);

        await user.click(saveBtn);

        expect(await screen.findByText(/your examples/i)).toBeInTheDocument();
        expect(screen.getByText('My first example.')).toBeInTheDocument();

        expect(createUserExample).toHaveBeenCalledWith(1, 'My first example.');

        expect(onExamplesUpdate).toHaveBeenCalledWith([returned]);
    });

    test('AI generate fills draft and uses selected difficulty + context', async () => {
        const user = userEvent.setup();

        render(<UserExample word={word} initialExamples={[]} />);

        await user.click(screen.getByRole('button', { name: /create an example/i }));

        const difficulty = screen.getByLabelText(/difficulty:/i);
        await user.selectOptions(difficulty, 'advanced');
        const context = screen.getByLabelText(/context:/i);
        await user.type(context, 'business');

        generateWordExamples.mockResolvedValueOnce('Generated sentence here.');

        await user.click(screen.getByRole('button', { name: /ai generate/i }));

        expect(generateWordExamples).toHaveBeenCalledWith(1, {
            difficulty: 'advanced',
            context: 'business',
        });

        const textarea = screen.getByLabelText(/add your example/i) as HTMLTextAreaElement;
        expect(textarea.value).toBe('Generated sentence here.');
    });

    test('view mode with initial examples → delete flow (confirm) removes item, calls API + callback, switches to empty if none left', async () => {
        const user = userEvent.setup();
        const onExamplesUpdate = jest.fn();

        const initial: UserExampleType[] = [{ id: 10, example_text: 'Old example', created_at: '2025-01-01T00:00:00Z', word: 1 }];

        render(
            <UserExample
                word={word}
                initialExamples={initial}
                onExamplesUpdate={onExamplesUpdate}
            />
        );

        expect(screen.getByText(/your examples/i)).toBeInTheDocument();
        expect(screen.getByText('Old example')).toBeInTheDocument();

        const delBtn = screen.getByRole('button', { name: /delete example/i });
        await user.click(delBtn);

        const dialog = await screen.findByRole('dialog');
        expect(within(dialog).getByText(/delete example/i)).toBeInTheDocument();
        expect(within(dialog).getByText(/old example/i)).toBeInTheDocument();

        deleteUserExample.mockResolvedValueOnce(true);
        await user.click(within(dialog).getByRole('button', { name: /delete/i }));


        expect(deleteUserExample).toHaveBeenCalledWith(1, 10);

        expect(await screen.findByRole('button', { name: /create an example/i })).toBeInTheDocument();

        expect(onExamplesUpdate).toHaveBeenCalledWith([]);
    });

    test('view mode → delete flow (cancel) does not call API and closes modal', async () => {
        const user = userEvent.setup();

        const initial: UserExampleType[] = [{ id: 11, example_text: 'Keep me', created_at: '2025-01-01T00:00:00Z', word: 1 }];

        render(<UserExample word={word} initialExamples={initial} />);

        await user.click(screen.getByRole('button', { name: /delete example/i }));

        const dialog = await screen.findByRole('dialog');
        await user.click(within(dialog).getByRole('button', { name: /cancel/i }));

        expect(deleteUserExample).not.toHaveBeenCalled();
        expect(screen.getByText('Keep me')).toBeInTheDocument();
    });
});