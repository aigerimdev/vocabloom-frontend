import React from 'react';
import '../styles/SearchBar.css';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    onSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onSearch }) => {
    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Type a word..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            <button onClick={onSearch}>🔍</button>
        </div>
    );
};

export default SearchBar;
