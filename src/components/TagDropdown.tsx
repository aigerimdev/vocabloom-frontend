import React, { useState } from 'react';

interface TagDropdownProps {
    onSelect: (tag: string) => void;
}

const TagDropdown: React.FC<TagDropdownProps> = ({ onSelect }) => {
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const tags = ['School', 'Development', '+ Add a new tag'];

    const handleSelect = (tag: string) => {
        setSelectedTag(tag);
        onSelect(tag); // Notify parent component
        setIsOpen(false);
    };

    return (
        <div style={{ position: 'relative', width: '200px' }}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    padding: '10px',
                    backgroundColor: '#eee',
                    borderRadius: '5px',
                    cursor: 'pointer',
                }}
            >
                {/* {selectedTag || 'Select tag...'} */}
                <span style={{ marginRight: '8px' }}>
                    {selectedTag || 'Select tag...'}
                </span>
                <span>{isOpen ? '▲' : '▼'}</span>

            </div>

            {isOpen && (
                <ul
                    style={{
                        position: 'absolute',
                        width: '100%',
                        marginTop: '5px',
                        listStyle: 'none',
                        padding: 0,
                        backgroundColor: 'white',
                        border: '1px solid #ccc',
                        borderRadius: '5px',
                        zIndex: 100,
                    }}
                >
                    {tags.map((tag) => (
                        <li
                            key={tag}
                            onClick={() => handleSelect(tag)}
                            style={{
                                padding: '10px',
                                cursor: 'pointer',
                                backgroundColor: selectedTag === tag ? '#c8f7c5' : 'white',
                            }}
                        >
                            {tag}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TagDropdown;
