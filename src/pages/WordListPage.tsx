import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { get_saved_words } from '../endpoints/api';
import { WordData } from '../types/word';
import { useNavigate } from 'react-router-dom';
import { get_tag_by_id } from '../endpoints/api';
import '../styles/WordListPage.css';

const WordListPage = () => {
    const [words, setWords] = useState<WordData[]>([]);
    const [tagName, setTagName] = useState<string | null>(null);

    const [loading, setLoading] = useState(true);

    const location = useLocation();
    const navigate = useNavigate();

    const getQueryParam = (key: string) => {
        const params = new URLSearchParams(location.search);
        return params.get(key);
    };

    const tagIdParam = getQueryParam('tagId');
    const tagId = tagIdParam ? Number(tagIdParam) : null;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const allWords = await get_saved_words();
                const filtered = tagId !== null
                    ? allWords.filter(word => word.tag === tagId)
                    : allWords;

                setWords(filtered);

                if (tagId !== null) {
                    try {
                        const tag = await get_tag_by_id(tagId);
                        setTagName(tag.name);
                    } catch (err) {
                        setTagName(null);
                    }
                } else {
                    setTagName(null);
                }
            } catch (err) {
                console.error('Failed to fetch words or tag name:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [tagId]);

    return (
        <main className='protected-main'>
            <button onClick={() => navigate(-1)} className="back-button">
                ← Back
            </button>
            <div className="word-list-container">
                <h1 className="word-list-title">
                    {tagId !== null && tagName
                        ? `${tagName} Collection`
                        : tagId !== null
                            ? 'Loading...'
                            : 'My Word List'}
                </h1>
                {loading ? (
                    <p>Loading...</p>
                ) : words.length === 0 ? (
                    <p>No words found{tagId !== null ? ' for this tag' : ''}.</p>
                ) : (
                    <ul className="word-list-items">
                        {words.map((word, idx) => (
                            <li key={idx} className="word-list-item" onClick={() => navigate(`/my-words/${word.id}`)}>
                                <div className='word-list-word'>
                                    <span className="word-list-icon">🌿</span>
                                    <p className="word-link">{word.word}</p>
                                </div>
                                <span className="word-list-arrow">➤</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </main>
    );
};

export default WordListPage;
