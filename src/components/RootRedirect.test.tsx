import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PersonalWordForm from './PersonalWordForm';
import { WordData } from '../types/word';

// Mocks must be declared BEFORE importing the component
jest.mock('./TagDropdown', () => (props: any) => (
    <button type="button" onClick={() => props.onSelect?.(42, 'Selected')}>
        Select Tag
    </button>
));

jest.mock('./ConfirmationModal', () => (props: any) => {
    if (!props.isOpen) return null;
    return (
        <div data-testid="modal">
            <div>{props.title}</div>
            <div>{props.message}</div>
            <button onClick={props.onConfirm}>{props.confirmText || 'OK'}</button>
            {props.cancelText ? <button onClick={props.onCancel}>{props.cancelText}</button> : null}
        </div>
    );
});

// Disable native HTML form validation globally (no node access)
const checkValiditySpy = jest
    .spyOn(HTMLFormElement.prototype, 'checkValidity')
    .mockImplementation(() => true);
const reportValiditySpy = jest
    .spyOn(HTMLFormElement.prototype, 'reportValidity')
    .mockImplementation(() => true);

const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => { });

afterEach(() => {
    jest.clearAllMocks();
    checkValiditySpy.mockClear();
    reportValiditySpy.mockClear();
});

const setup = (overrides?: Partial<React.ComponentProps<typeof PersonalWordForm>>) => {
    const onClose = jest.fn();
    const onSave = jest.fn();
    const setTags = jest.fn();
    const tags = [{ id: 1, name: 'Default' }];

    render(
        <PersonalWordForm
            isOpen
            onClose={onClose}
            onSave={onSave as (w: WordData & { tag: number | null }) => void}
            tags={tags}
            setTags={setTags}
            {...overrides}
        />
    );

    return { onClose, onSave, setTags };
};

test('validates required fields: word', async () => {
    const { onSave } = setup();
    await userEvent.click(screen.getByRole('button', { name: /save word/i }));
    expect(alertSpy).toHaveBeenCalledWith('Word is required');
    expect(onSave).not.toHaveBeenCalled();
});

test('validates required fields: part of speech', async () => {
    const { onSave } = setup();

    await userEvent.type(screen.getByLabelText(/word \*/i), '  hello  ');
    await userEvent.type(screen.getByPlaceholderText(/enter definition/i), 'meaning');
    await userEvent.click(screen.getByRole('button', { name: /save word/i }));

    expect(alertSpy).toHaveBeenCalledWith('Part of speech is required for all meanings');
    expect(onSave).not.toHaveBeenCalled();
});

test('validates required fields: definition', async () => {
    const { onSave } = setup();

    await userEvent.type(screen.getByLabelText(/word \*/i), 'hello');
    await userEvent.selectOptions(screen.getByRole('combobox'), 'noun');
    await userEvent.click(screen.getByRole('button', { name: /save word/i }));

    expect(alertSpy).toHaveBeenCalledWith('Definition is required for all entries');
    expect(onSave).not.toHaveBeenCalled();
});

test('add/remove meaning & definition works', async () => {
    setup();
    // Add a second definition
    await userEvent.click(screen.getByRole('button', { name: /\+ add definition/i }));
    expect(screen.getAllByPlaceholderText(/enter definition/i)).toHaveLength(2);

    // Remove the most recent definition by clicking the last "×" button
    const removeDefButtons = screen.getAllByRole('button', { name: '×' });
    await userEvent.click(removeDefButtons[removeDefButtons.length - 1]);
    expect(screen.getAllByPlaceholderText(/enter definition/i)).toHaveLength(1);

    // Add a second meaning
    await userEvent.click(screen.getByRole('button', { name: /\+ add meaning/i }));
    expect(screen.getAllByText(/meaning \d+/i)).toHaveLength(2);

    // Remove one meaning by clicking the first visible "Remove" button
    const removeMeaningButtons = screen.getAllByRole('button', { name: /remove/i });
    await userEvent.click(removeMeaningButtons[0]);
    expect(screen.getAllByText(/meaning \d+/i)).toHaveLength(1);
});

test('successful submit normalizes payload and includes selected tag', async () => {
    const { onSave, onClose } = setup();

    await userEvent.type(screen.getByLabelText(/word \*/i), '  hello  ');
    await userEvent.type(screen.getByLabelText(/phonetic/i), '  /həˈloʊ/  ');
    await userEvent.selectOptions(screen.getByRole('combobox'), 'noun');
    await userEvent.type(screen.getByPlaceholderText(/enter definition/i), '  greeting  ');
    await userEvent.type(screen.getByPlaceholderText(/enter example/i), '  hi!  ');

    await userEvent.click(screen.getByRole('button', { name: /select tag/i }));
    await userEvent.click(screen.getByRole('button', { name: /save word/i }));

    expect(onSave).toHaveBeenCalledTimes(1);
    const payload = onSave.mock.calls[0][0];

    expect(payload.word).toBe('hello');
    expect(payload.phonetic).toBe('/həˈloʊ/');
    expect(payload.audio).toBeUndefined();
    expect(payload.tag).toBe(42);
    expect(payload.meanings).toEqual([
        { partOfSpeech: 'noun', definitions: [{ definition: 'greeting', example: 'hi!' }] },
    ]);

    expect(onClose).toHaveBeenCalled();
});

test('onSave error shows modal with mapped messages', async () => {
    const onSave = jest.fn()
        .mockRejectedValueOnce({ message: 'WORD_DUPLICATE' })
        .mockRejectedValueOnce({ message: 'TAG_DUPLICATE' })
        .mockRejectedValueOnce({ message: 'OTHER' });

    render(
        <PersonalWordForm
            isOpen
            onClose={jest.fn()}
            onSave={onSave}
            tags={[]}
            setTags={jest.fn()}
        />
    );

    const fillValid = async () => {
        const word = screen.getByLabelText(/word \*/i);
        const def = screen.getAllByPlaceholderText(/enter definition/i)[0];

        await userEvent.clear(word);
        await userEvent.type(word, 'hello');

        await userEvent.selectOptions(screen.getByRole('combobox'), 'noun');

        await userEvent.clear(def);
        await userEvent.type(def, 'greeting');
    };

    // WORD_DUPLICATE
    await fillValid();
    await userEvent.click(screen.getByRole('button', { name: /save word/i }));
    const m1 = await screen.findByTestId('modal');
    expect(within(m1).getByText(/already exists for this tag/i)).toBeInTheDocument();
    await userEvent.click(within(m1).getByRole('button', { name: /ok/i }));

    // TAG_DUPLICATE
    await fillValid();
    await userEvent.click(screen.getByRole('button', { name: /save word/i }));
    const m2 = await screen.findByTestId('modal');
    expect(within(m2).getByText(/this tag already exists/i)).toBeInTheDocument();
    await userEvent.click(within(m2).getByRole('button', { name: /ok/i }));

    // default error
    await fillValid();
    await userEvent.click(screen.getByRole('button', { name: /save word/i }));
    const m3 = await screen.findByTestId('modal');
    expect(within(m3).getByText(/couldn’t save\. please try again\./i)).toBeInTheDocument();
    await userEvent.click(within(m3).getByRole('button', { name: /ok/i }));
});

test('close button calls onClose', async () => {
    const onClose = jest.fn();

    render(
        <PersonalWordForm
            isOpen
            onClose={onClose}
            onSave={jest.fn()}
            tags={[]}
            setTags={jest.fn()}
        />
    );

    await userEvent.click(screen.getByRole('button', { name: '×' }));
    expect(onClose).toHaveBeenCalledTimes(1);
});
