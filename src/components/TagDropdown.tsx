import React, { useState, useEffect } from 'react';
import '../styles/TagDropdown.css';

interface TagDropdownProps {
    onSelect: (tag: string) => void;
    tags: string[];
    setTags: React.Dispatch<React.SetStateAction<string[]>>;
}

const TagDropdown: React.FC<TagDropdownProps> = ({ onSelect, tags, setTags }) => {
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [newTag, setNewTag] = useState('');

    const handleSelect = (tag: string) => {
        setSelectedTag(tag);
        onSelect(tag);
        setIsOpen(false);
        setIsAddingNew(false);
        setNewTag('');
    };
    //Sync tags from localStorage
    useEffect(() => {
        const stored = localStorage.getItem('tags');
        if (stored) {
            const storedTags = JSON.parse(stored);
            const mergedTags = Array.from(new Set([...tags, ...storedTags]));
            setTags(mergedTags);
        }
    }, []);

    const handleAddTag = () => {
        if (!newTag.trim() || tags.includes(newTag)) return;
        const updated = [...tags, newTag];
        setTags(updated);
        handleSelect(newTag);
    };

    return (
        <div className="tag-dropdown-container">
            <div onClick={() => setIsOpen(!isOpen)} className="dropdown-toggle">
                <span>{selectedTag || 'Select tag...'}</span>
                <span>{isOpen ? '▲' : '▼'}</span>
            </div>

            {isOpen && (
                <ul className="dropdown-list">
                    {tags.map((tag) => (
                        <li
                            key={tag}
                            onClick={() => handleSelect(tag)}
                            className={`dropdown-item ${selectedTag === tag ? 'selected' : ''}`}
                        >
                            {tag}
                        </li>
                    ))}

                    {!isAddingNew ? (
                        <li className="add-new-tag" onClick={() => setIsAddingNew(true)}>
                            + Add a new tag
                        </li>
                    ) : (
                        <li className="new-tag-input-wrapper">
                            <input
                                type="text"
                                placeholder="New tag name"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleAddTag();
                                }}
                                className="new-tag-input"
                            />
                            <button onClick={handleAddTag} className="save-tag-button">
                                Save
                            </button>
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default TagDropdown;
