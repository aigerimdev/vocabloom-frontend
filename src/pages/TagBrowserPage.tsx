
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { get_tags, create_tag } from '../endpoints/api';
import '../styles/TagBrowserPage.css';

interface Tag {
    id: number;
    name: string;
}

const TagBrowserPage = () => {
    const [tags, setTags] = useState<Tag[]>([]);
    const [showInput, setShowInput] = useState(false);
    const [newTag, setNewTag] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchTags() {
            const result = await get_tags();
            if (result && Array.isArray(result)) {
                setTags(result);
            }
        }

        fetchTags();
    }, []);

    const handleTagClick = (tagId: number, tagName: string) => {
        navigate(`/my-words?tagId=${tagId}&tagName=${encodeURIComponent(tagName)}`);
    };




    const handleAddTag = async () => {
        const trimmed = newTag.trim();
        if (!trimmed || tags.find((tag) => tag.name === trimmed)) return;

        try {
            const newTagObj = await create_tag(trimmed);
            if (newTagObj) {
                setTags([...tags, newTagObj]);
                setNewTag('');
                setShowInput(false);
            }
        } catch (error) {
            console.error('Failed to create tag:', error);
        }
    };

    return (
        <main className='protected-main'>
            <div className="tag-browser-container">
                <header className="header">
                    <button onClick={() => navigate(-1)} className="back-button">
                        ← Back
                    </button>
                    <h1 className="title">Vocabloom 🌱</h1>
                </header>

                <h2 className="section-title">My Vocabulary Tags</h2>

                <div className="tag-list">
                    <div className="add-tag-card">
                        {!showInput ? (
                            <>
                                <span>Add New Tag</span>
                                <button className="add-icon" onClick={() => setShowInput(true)}>
                                    +
                                </button>
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
                                <button className="add-icon" onClick={handleAddTag}>
                                    ✓
                                </button>
                            </>
                        )}
                    </div>

                    {tags.map((tag, index) => (
                        <div
                            key={tag.id}
                            className={`tag-card color-${index % 4}`}
                            onClick={() => handleTagClick(tag.id, tag.name)}

                        >
                            <span>{tag.name}</span>
                            <span className="arrow">➤</span>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default TagBrowserPage;

