import React, { useState } from 'react';
import '../styles/TagDropdown.css';
import { create_tag } from '../endpoints/api'; // adjust path if needed


interface Tag {
    id: number;
    name: string;
}

interface TagDropdownProps {
    onSelect: (tagId: number | null, tagName: string | null) => void;
    tags: Tag[];
    setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
}

const TagDropdown: React.FC<TagDropdownProps> = ({ onSelect, tags, setTags }) => {
    const [selectedTagId, setSelectedTagId] = useState<number | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [newTag, setNewTag] = useState('');

    const handleSelect = (tagId: number, tagName: string) => {
        setSelectedTagId(tagId);
        onSelect(tagId, tagName);
        setIsOpen(false);
        setIsAddingNew(false);
        setNewTag('');
    };

    const handleCreateTag = async () => {
        const trimmed = newTag.trim();
        if (!trimmed || tags.find((tag) => tag.name === trimmed)) return;

        try {
            const newTagObj = await create_tag(trimmed);
            if (newTagObj) {
                setTags((prev) => [...prev, newTagObj]); // update list
                handleSelect(newTagObj.id, newTagObj.name); // auto-select newly created tag
                setIsAddingNew(false);
                setNewTag('');
            }
        } catch (err) {
            console.error("Failed to create tag:", err);
        }
    };

    return (
        <div className="tag-dropdown-container">
            <div onClick={() => setIsOpen(!isOpen)} className="dropdown-toggle">
                <span>
                    {selectedTagId != null
                        ? tags.find((tag) => tag.id === selectedTagId)?.name || 'Select tag...'
                        : 'Select tag...'}
                </span>
                <span>{isOpen ? '▲' : '▼'}</span>
            </div>

            {isOpen && (
                <ul className="dropdown-list">
                    {tags.map((tag) => (
                        <li
                            key={tag.id}
                            onClick={() => handleSelect(tag.id, tag.name)}
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
                                    if (e.key === 'Enter') {
                                        // add tag logic here
                                    }
                                }}
                                className="new-tag-input"
                            />
                            <button className="save-tag-button" onClick={handleCreateTag}>Save</button>
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default TagDropdown;
