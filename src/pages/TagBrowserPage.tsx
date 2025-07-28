
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import '../styles/TagBrowserPage.css'; // create this for styling

// const TagBrowserPage = () => {
//     const [tags, setTags] = useState<string[]>([]);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const storedTags = localStorage.getItem('tags');
//         if (storedTags) {
//             setTags(JSON.parse(storedTags));
//         }
//     }, []);

//     const handleTagClick = (tag: string) => {
//         navigate(`/my-words?tag=${encodeURIComponent(tag)}`);
//     };

//     return (
//         <div className="tag-browser-container">
//             <header className="header">
//                 <button onClick={() => navigate(-1)} className="back-button">← Back</button>
//                 <h1 className="title">Vocabloom 🌱</h1>
//             </header>

//             <h2 className="section-title">My Vocabulary Tags</h2>

//             <div className="tag-list">
//                 <div className="add-tag-card">
//                     <span>Add New Tag</span>
//                     <button className="add-icon">+</button>
//                 </div>

//                 {tags.map((tag, index) => (
//                     <div
//                         key={tag}
//                         className={`tag-card color-${index % 4}`}
//                         onClick={() => handleTagClick(tag)}
//                     >
//                         <span>{tag}</span>
//                         <span className="arrow">➤</span>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default TagBrowserPage;
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/TagBrowserPage.css';

const TagBrowserPage = () => {
    const [tags, setTags] = useState<string[]>([]);
    const [showInput, setShowInput] = useState(false);
    const [newTag, setNewTag] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const storedTags = localStorage.getItem('tags');
        if (storedTags) {
            setTags(JSON.parse(storedTags));
        }
    }, []);

    const handleTagClick = (tag: string) => {
        navigate(`/my-words?tag=${encodeURIComponent(tag)}`);
    };

    const handleAddTag = () => {
        const trimmed = newTag.trim();
        if (!trimmed || tags.includes(trimmed)) return;

        const updatedTags = [...tags, trimmed];
        setTags(updatedTags);
        localStorage.setItem('tags', JSON.stringify(updatedTags));
        setNewTag('');
        setShowInput(false);
    };

    return (
        <div className="tag-browser-container">
            <header className="header">
                <button onClick={() => navigate(-1)} className="back-button">← Back</button>
                <h1 className="title">Vocabloom 🌱</h1>
            </header>

            <h2 className="section-title">My Vocabulary Tags</h2>

            <div className="tag-list">
                <div className="add-tag-card">
                    {!showInput ? (
                        <>
                            <span>Add New Tag</span>
                            <button className="add-icon" onClick={() => setShowInput(true)}>+</button>
                        </>
                    ) : (
                        <>
                            <input
                                type="text"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                placeholder="Enter tag"
                                className="new-tag-input"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleAddTag();
                                }}
                            />
                            <button className="add-icon" onClick={handleAddTag}>✓</button>
                        </>
                    )}
                </div>

                {tags.map((tag, index) => (
                    <div
                        key={tag}
                        className={`tag-card color-${index % 4}`}
                        onClick={() => handleTagClick(tag)}
                    >
                        <span>{tag}</span>
                        <span className="arrow">➤</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TagBrowserPage;

