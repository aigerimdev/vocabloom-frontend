import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TagBrowserPage from './TagBrowserPage';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

jest.mock('../endpoints/api', () => ({
    get_tags: jest.fn(),
    create_tag: jest.fn(),
    delete_tag: jest.fn(),
}));

jest.mock('../components/ConfirmationModal', () => (props: any) => {
    if (!props.isOpen) return null;
    return (
        <div data-testid="modal">
            <div>{props.title}</div>
            <div>{props.message}</div>
            {props.cancelText ? (
                <button onClick={props.onCancel}>{props.cancelText}</button>
            ) : null}
            <button onClick={props.onConfirm}>{props.confirmText}</button>
        </div>
    );
});

const { get_tags, create_tag, delete_tag } = jest.requireMock('../endpoints/api') as {
    get_tags: jest.Mock;
    create_tag: jest.Mock;
    delete_tag: jest.Mock;
};

beforeEach(() => {
    jest.clearAllMocks();
});

test('loads and shows tags from API', async () => {
    get_tags.mockResolvedValueOnce([{ id: 1, name: 'Nouns' }]);

    render(<TagBrowserPage />);
    expect(await screen.findByText(/nouns/i)).toBeInTheDocument();
});

test('clicking a tag navigates to tag word list with query params', async () => {
    get_tags.mockResolvedValueOnce([{ id: 1, name: 'Nouns' }]);

    render(<TagBrowserPage />);
    const tag = await screen.findByText(/nouns/i);
    await userEvent.click(tag);

    expect(mockNavigate).toHaveBeenCalledWith(
        `/my-words?tagId=1&tagName=${encodeURIComponent('Nouns')}`
    );
});

test('back button navigates -1', async () => {
    get_tags.mockResolvedValueOnce([]);

    render(<TagBrowserPage />);
    await userEvent.click(screen.getByRole('button', { name: /back/i }));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
});

test('Add New Tag -> client-side duplicate shows "This tag already exists."', async () => {
    get_tags.mockResolvedValueOnce([{ id: 1, name: 'Nouns' }]);

    render(<TagBrowserPage />);

    await userEvent.click(screen.getByRole('button', { name: /add new tag/i }));
    await userEvent.type(screen.getByPlaceholderText(/enter tag/i), 'nouns');
    await userEvent.click(screen.getByRole('button', { name: '✓' }));

    expect(await screen.findByText(/this tag already exists\./i)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /ok/i }));
});

test('Add New Tag -> creates on success and renders new tag', async () => {
    get_tags.mockResolvedValueOnce([]);
    create_tag.mockResolvedValueOnce({ id: 2, name: 'NewTag' });

    render(<TagBrowserPage />);

    await userEvent.click(screen.getByRole('button', { name: /add new tag/i }));
    await userEvent.type(screen.getByPlaceholderText(/enter tag/i), 'NewTag');
    await userEvent.click(screen.getByRole('button', { name: '✓' }));

    expect(create_tag).toHaveBeenCalledWith('NewTag');
    expect(await screen.findByText(/newtag/i)).toBeInTheDocument();
});

test('Add New Tag -> server duplicate error shows "This tag already exists."', async () => {
    get_tags.mockResolvedValueOnce([]);
    create_tag.mockRejectedValueOnce({ message: 'TAG_DUPLICATE' });

    render(<TagBrowserPage />);

    await userEvent.click(screen.getByRole('button', { name: /add new tag/i }));
    await userEvent.type(screen.getByPlaceholderText(/enter tag/i), 'Nouns');
    await userEvent.click(screen.getByRole('button', { name: '✓' }));

    expect(await screen.findByText(/this tag already exists\./i)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /ok/i }));
});

test('Add New Tag -> generic server error shows fallback message', async () => {
    get_tags.mockResolvedValueOnce([]);
    create_tag.mockRejectedValueOnce(new Error('boom'));

    render(<TagBrowserPage />);

    await userEvent.click(screen.getByRole('button', { name: /add new tag/i }));
    await userEvent.type(screen.getByPlaceholderText(/enter tag/i), 'Nouns');
    await userEvent.click(screen.getByRole('button', { name: '✓' }));

    expect(
        await screen.findByText(/couldn’t create tag\. please try again\./i)
    ).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /ok/i }));
});

test('Delete flow -> opens confirm, deletes, navigates to /tags and removes item', async () => {
    get_tags.mockResolvedValueOnce([{ id: 3, name: 'RemoveMe' }]);
    delete_tag.mockResolvedValueOnce({});

    render(<TagBrowserPage />);

    await userEvent.click(
        await screen.findByRole('button', { name: /delete removeme/i })
    );

    const modal = await screen.findByTestId('modal');
    await userEvent.click(
        within(modal).getByRole('button', { name: /^delete$/i })
    );

    expect(delete_tag).toHaveBeenCalledWith(3);
    expect(mockNavigate).toHaveBeenCalledWith('/tags', { replace: true });
    expect(screen.queryByText(/removeme/i)).not.toBeInTheDocument();
});


test('Delete flow -> cancel keeps the tag', async () => {
    get_tags.mockResolvedValueOnce([{ id: 9, name: 'KeepMe' }]);

    render(<TagBrowserPage />);

    await userEvent.click(
        await screen.findByRole('button', { name: /delete keepme/i })
    );

    await userEvent.click(await screen.findByRole('button', { name: /cancel/i }));

    expect(delete_tag).not.toHaveBeenCalled();
    expect(screen.getByText(/keepme/i)).toBeInTheDocument();
});
