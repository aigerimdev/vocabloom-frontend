import '../styles/SearchBar.css';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    onSearch: () => void;
}

const SearchBar = ({ value, onChange, onSearch }: SearchBarProps) => {
    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Type a word..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        onSearch();
                    }
                }}
            />
            <button onClick={onSearch}>🔍</button>
        </div>
    );
};

export default SearchBar;
