
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { get_tags, create_tag, delete_tag } from '../endpoints/api';
import '../styles/TagBrowserPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan} from '@fortawesome/free-regular-svg-icons'
import ConfirmationModal from '../components/ConfirmationModal';

interface Tag {
    id: number;
    name: string;
}

const TagBrowserPage = () => {
    const [tags, setTags] = useState<Tag[]>([]);
    const [showInput, setShowInput] = useState(false);
    const [newTag, setNewTag] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [tagToDelete, setTagToDelete] = useState<{ id: number; name: string } | null>(null);
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

    const handleDeleteClick = (tagId: number, tagName: string) => {
        setTagToDelete({ id: tagId, name: tagName });
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = async () => {
        if (!tagToDelete) return;

        try {
            await delete_tag(tagToDelete.id);
            setTags(tags.filter(tag => tag.id !== tagToDelete.id));
            navigate('/tags', { replace: true })
        } catch (error) {
            console.error('Failed to delete tag:', error);
            alert('Failed to delete tag. Please try again.');
        } finally {
            setShowDeleteConfirm(false);
            setTagToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirm(false);
        setTagToDelete(null);
    };

    return (
        <main className='protected-main'>
            <div className="tag-browser-container">
                <button onClick={() => navigate(-1)} className="back-button">
                    ← Back
                </button>
                <h1 className="section-title">My Vocabulary Tags</h1>

                {!showInput ? (
                    <button className='add-tag-button' onClick={() => setShowInput(true)}>
                        Add New Tag <span>+</span>
                    </button>
                ) : (
                    <div className="add-tag-card">
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
                        <button className="input-icon" onClick={handleAddTag}>
                            ✓
                        </button>
                        <button className="input-icon close-input-icon" onClick={() => {setShowInput(false)}}>
                            x
                        </button>
                    </div>
                )}

                <div className="tag-list">
                    {tags.map((tag, index) => (
                        <div key={tag.id}
                                className={`tag-card color-${index % 4}`}
                                >
                            <div className="tag-card-name" onClick={() => handleTagClick(tag.id, tag.name)}>
                                <span>{tag.name}</span>
                            </div>
                            <FontAwesomeIcon icon={faTrashCan} size="xs" className='tag-card-trash' onClick={() => handleDeleteClick(tag.id, tag.name)}/>
                        </div>
                    ))}
                </div>
            </div>
            <ConfirmationModal
                isOpen={showDeleteConfirm}
                title="Delete Tag"
                message={`Are you sure you want to delete the "${tagToDelete?.name}" tag? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                type="danger"
            />
        </main>
    );
};

export default TagBrowserPage;

