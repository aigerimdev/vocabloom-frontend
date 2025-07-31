import React, { useState, useEffect } from 'react';
import '../styles/TagDropdown.css';
import { create_tag } from '../endpoints/api';

interface Tag {
    id: number;
    name: string;
}
interface TagDropdownProps {
    onSelect: (tagId: number | null) => void;
    tags: Tag[];
    setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
}


const TagDropdown: React.FC<TagDropdownProps> = ({ onSelect, tags, setTags }) => {
    const [selectedTagId, setSelectedTagId] = useState<number | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [newTag, setNewTag] = useState('');

    const handleSelect = (tagId: number) => {
        setSelectedTagId(tagId);
        onSelect(tagId);
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

    const handleAddTag = async () => {
        const trimmed = newTag.trim();
        if (!trimmed || tags.find(tag => tag.name === trimmed)) return;

        try {
            const newTagObj = await create_tag(trimmed);
            if (newTagObj) {
                const updated = [...tags, newTagObj];
                setTags(updated);
                handleSelect(newTagObj.id);
            }
        } catch (error) {
            console.error('Failed to create tag:', error);
        }
    };


    return (
        <div className="tag-dropdown-container">
            <div onClick={() => setIsOpen(!isOpen)} className="dropdown-toggle">
                <span>
                    {selectedTagId != null
                        ? tags.find(tag => tag.id === selectedTagId)?.name || 'Select tag...'
                        : 'Select tag...'}
                </span>

                <span>{isOpen ? '▲' : '▼'}</span>
            </div>

            {isOpen && (
                <ul className="dropdown-list">
                    {tags.map((tag) => (
                        <li
                            key={tag.id}
                            onClick={() => handleSelect(tag.id)}
                            className={`dropdown-item ${selectedTagId === tag.id ? 'selected' : ''}`}
                        >
                            {tag.name}
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
