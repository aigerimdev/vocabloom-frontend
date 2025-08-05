import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TagDropdown from './TagDropdown';
import { create_tag } from '../endpoints/api';

jest.mock('../endpoints/api', () => ({
    create_tag: jest.fn(),
}));

const mockTags = [
    { id: 1, name: 'Food' },
    { id: 2, name: 'Travel' },
];

type Tag = {
    id: number;
    name: string;
};

describe('TagDropdown', () => {
    let mockOnSelect: jest.Mock;
    let mockSetTags: React.Dispatch<React.SetStateAction<Tag[]>>;

    beforeEach(() => {
        mockOnSelect = jest.fn();
        mockSetTags = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders dropdown toggle', () => {
        render(<TagDropdown onSelect={mockOnSelect} tags={mockTags} setTags={mockSetTags} />);
        expect(screen.getByText(/select tag/i)).toBeInTheDocument();
    });

    test('opens dropdown and selects tag', () => {
        render(<TagDropdown onSelect={mockOnSelect} tags={mockTags} setTags={mockSetTags} />);

        fireEvent.click(screen.getByText(/select tag/i));
        fireEvent.click(screen.getByText(/travel/i));

        expect(mockOnSelect).toHaveBeenCalledWith(2, 'Travel');
    });

    test('shows input when "+ Add a new tag" is clicked', () => {
        render(<TagDropdown onSelect={mockOnSelect} tags={mockTags} setTags={mockSetTags} />);

        fireEvent.click(screen.getByText(/select tag/i));
        fireEvent.click(screen.getByText(/\+ add a new tag/i));

        expect(screen.getByPlaceholderText(/new tag name/i)).toBeInTheDocument();
    });

    test('creates and selects new tag', async () => {
        const newTag = { id: 3, name: 'Work' };
        (create_tag as jest.Mock).mockResolvedValueOnce(newTag);

        render(<TagDropdown onSelect={mockOnSelect} tags={mockTags} setTags={mockSetTags} />);

        fireEvent.click(screen.getByText(/select tag/i));
        fireEvent.click(screen.getByText(/\+ add a new tag/i));
        fireEvent.change(screen.getByPlaceholderText(/new tag name/i), {
            target: { value: 'Work' },
        });
        fireEvent.click(screen.getByText(/save/i));

        await waitFor(() => {
            expect(create_tag).toHaveBeenCalledWith('Work');
        });

        expect(mockSetTags).toHaveBeenCalledWith(expect.any(Function));
        expect(mockOnSelect).toHaveBeenCalledWith(3, 'Work');
    });
});