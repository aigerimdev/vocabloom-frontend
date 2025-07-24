// import React, { useState } from 'react';

// interface TagDropdownProps {
//     onSelect: (tag: string) => void;
// }

// const TagDropdown: React.FC<TagDropdownProps> = ({ onSelect }) => {
//     const [selectedTag, setSelectedTag] = useState<string | null>(null);
//     const [isOpen, setIsOpen] = useState(false);

//     const tags = ['School', 'Development', '+ Add a new tag'];

//     const handleSelect = (tag: string) => {
//         setSelectedTag(tag);
//         onSelect(tag); // Notify parent component
//         setIsOpen(false);
//     };

//     return (
//         <div style={{ position: 'relative', width: '200px' }}>
//             <div
//                 onClick={() => setIsOpen(!isOpen)}
//                 style={{
//                     padding: '10px',
//                     backgroundColor: '#eee',
//                     borderRadius: '5px',
//                     cursor: 'pointer',
//                 }}
//             >
//                 {/* {selectedTag || 'Select tag...'} */}
//                 <span style={{ marginRight: '8px' }}>
//                     {selectedTag || 'Select tag...'}
//                 </span>
//                 <span>{isOpen ? '▲' : '▼'}</span>

//             </div>

//             {isOpen && (
//                 <ul
//                     style={{
//                         position: 'absolute',
//                         width: '100%',
//                         marginTop: '5px',
//                         listStyle: 'none',
//                         padding: 0,
//                         backgroundColor: 'white',
//                         border: '1px solid #ccc',
//                         borderRadius: '5px',
//                         zIndex: 100,
//                     }}
//                 >
//                     {tags.map((tag) => (
//                         <li
//                             key={tag}
//                             onClick={() => handleSelect(tag)}
//                             style={{
//                                 padding: '10px',
//                                 cursor: 'pointer',
//                                 backgroundColor: selectedTag === tag ? '#c8f7c5' : 'white',
//                             }}
//                         >
//                             {tag}
//                         </li>
//                     ))}
//                 </ul>
//             )}
//         </div>
//     );
// };

// export default TagDropdown;
import React, { useState } from 'react';

interface TagDropdownProps {
    onSelect: (tag: string) => void;
}

const TagDropdown: React.FC<TagDropdownProps> = ({ onSelect }) => {
    const [tags, setTags] = useState<string[]>(['School', 'Development']);
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

    const handleAddTag = () => {
        if (!newTag.trim() || tags.includes(newTag)) return;
        const updated = [...tags, newTag];
        setTags(updated);
        handleSelect(newTag);
    };

    return (
        <div style={{ position: 'relative', width: '200px', marginBottom: '10px' }}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    padding: '10px',
                    backgroundColor: '#eee',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <span>{selectedTag || 'Select tag...'}</span>
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

                    {!isAddingNew ? (
                        <li
                            onClick={() => setIsAddingNew(true)}
                            style={{
                                padding: '10px',
                                cursor: 'pointer',
                                backgroundColor: '#f5f5f5',
                                fontWeight: 'bold',
                            }}
                        >
                            + Add a new tag
                        </li>
                    ) : (
                        <li style={{ padding: '10px' }}>
                            <input
                                type="text"
                                placeholder="New tag name"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleAddTag();
                                    }
                                }}
                                style={{ width: '100%' }}
                            />
                            <button onClick={handleAddTag} style={{ marginTop: '5px' }}>
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