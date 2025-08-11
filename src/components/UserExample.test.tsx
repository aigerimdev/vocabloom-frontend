import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserExample from './UserExample';
import type { WordData, UserExample as UserExampleType } from '../types/word';

// Mock API used by the component
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

// Mock AudioButton to avoid audio stuff in tests
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

        // Empty mode shows "Create an example"
        const createBtn = screen.getByRole('button', { name: /create an example/i });
        await user.click(createBtn);

        // In create mode, label is "Add your example" and textarea is labeled by it
        const textarea = screen.getByLabelText(/add your example/i) as HTMLTextAreaElement;

        // Save is disabled while empty
        const saveBtn = screen.getByRole('button', { name: /save example/i });
        expect(saveBtn).toBeDisabled();

        // Type a draft → Save enabled
        await user.type(textarea, 'My first example.');
        expect(saveBtn).toBeEnabled();

        // Mock API: create returns a new example
        const returned: UserExampleType = { id: 101, example_text: 'My first example.' };
        createUserExample.mockResolvedValueOnce(returned);

        await user.click(saveBtn);

        // New example appears in the list (view mode)
        expect(await screen.findByText(/your examples/i)).toBeInTheDocument();
        expect(screen.getByText('My first example.')).toBeInTheDocument();

        // API called with (word.id, trimmed text)
        expect(createUserExample).toHaveBeenCalledWith(1, 'My first example.');

        // Callback gets updated list
        expect(onExamplesUpdate).toHaveBeenCalledWith([returned]);
    });

    test('AI generate fills draft and uses selected difficulty + context', async () => {
        const user = userEvent.setup();

        render(<UserExample word={word} initialExamples={[]} />);

        // Enter create mode
        await user.click(screen.getByRole('button', { name: /create an example/i }));

        // Change difficulty and context
        const difficulty = screen.getByLabelText(/difficulty:/i);
        await user.selectOptions(difficulty, 'advanced');
        const context = screen.getByLabelText(/context:/i);
        await user.type(context, 'business');

        // Mock generate API
        generateWordExamples.mockResolvedValueOnce('Generated sentence here.');

        // Click AI Generate
        await user.click(screen.getByRole('button', { name: /ai generate/i }));

        // It should call with (word.id, { difficulty, context })
        expect(generateWordExamples).toHaveBeenCalledWith(1, {
            difficulty: 'advanced',
            context: 'business',
        });

        // Draft textarea should be filled with generated text
        const textarea = screen.getByLabelText(/add your example/i) as HTMLTextAreaElement;
        expect(textarea.value).toBe('Generated sentence here.');
    });

    test('view mode with initial examples → delete flow (confirm) removes item, calls API + callback, switches to empty if none left', async () => {
        const user = userEvent.setup();
        const onExamplesUpdate = jest.fn();

        const initial: UserExampleType[] = [{ id: 10, example_text: 'Old example' }];

        render(
            <UserExample
                word={word}
                initialExamples={initial}
                onExamplesUpdate={onExamplesUpdate}
            />
        );

        // In view mode, list is visible
        expect(screen.getByText(/your examples/i)).toBeInTheDocument();
        expect(screen.getByText('Old example')).toBeInTheDocument();

        // Click the delete icon (button has title "Delete example")
        const delBtn = screen.getByRole('button', { name: /delete example/i });
        await user.click(delBtn);

        // Confirmation modal appears
        const dialog = await screen.findByRole('dialog');
        expect(within(dialog).getByText(/delete example/i)).toBeInTheDocument();
        expect(within(dialog).getByText(/old example/i)).toBeInTheDocument();

        // Confirm → API resolves true
        deleteUserExample.mockResolvedValueOnce(true);
        await user.click(within(dialog).getByRole('button', { name: /delete/i }));

        // API called with (word.id, example.id)
        expect(deleteUserExample).toHaveBeenCalledWith(1, 10);

        // Item removed, now back to empty mode (button "Create an example" visible)
        expect(await screen.findByRole('button', { name: /create an example/i })).toBeInTheDocument();

        // Callback called with updated (empty) list
        expect(onExamplesUpdate).toHaveBeenCalledWith([]);
    });

    test('view mode → delete flow (cancel) does not call API and closes modal', async () => {
        const user = userEvent.setup();

        const initial: UserExampleType[] = [{ id: 11, example_text: 'Keep me' }];

        render(<UserExample word={word} initialExamples={initial} />);

        await user.click(screen.getByRole('button', { name: /delete example/i }));

        const dialog = await screen.findByRole('dialog');
        await user.click(within(dialog).getByRole('button', { name: /cancel/i }));

        expect(deleteUserExample).not.toHaveBeenCalled();
        // Modal closed; still in view mode with item present
        expect(screen.getByText('Keep me')).toBeInTheDocument();
    });
});