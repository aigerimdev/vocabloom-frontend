import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from './SearchBar';

describe('SearchBar', () => {
    const mockOnChange = jest.fn();
    const mockOnSearch = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders input with initial value', () => {
        render(
            <SearchBar
                value="apple"
                onChange={mockOnChange}
                onSearch={mockOnSearch}
            />
        );
        const input = screen.getByPlaceholderText(/type a word/i) as HTMLInputElement;
        expect(input).toBeInTheDocument();
        expect(input.value).toBe('apple');
    });

    test('calls onChange when typing', () => {
        render(
            <SearchBar
                value="apple"
                onChange={mockOnChange}
                onSearch={mockOnSearch}
            />
        );
        const input = screen.getByPlaceholderText(/type a word/i);
        fireEvent.change(input, { target: { value: 'banana' } });
        expect(mockOnChange).toHaveBeenCalledWith('banana');
    });

    test('calls onSearch when button is clicked', () => {
        render(
            <SearchBar
                value="apple"
                onChange={mockOnChange}
                onSearch={mockOnSearch}
            />
        );
        const button = screen.getByRole('button');
        fireEvent.click(button);
        expect(mockOnSearch).toHaveBeenCalled();
    });
});