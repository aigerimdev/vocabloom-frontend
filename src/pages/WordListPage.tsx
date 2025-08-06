import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { get_saved_words } from '../endpoints/api';
import { WordData } from '../types/word';
import '../styles/WordListPage.css';

const WordListPage = () => {
    const [words, setWords] = useState<WordData[]>([]);
    const [loading, setLoading] = useState(true);

    const location = useLocation();

    const getQueryParam = (key: string) => {
        const params = new URLSearchParams(location.search);
        return params.get(key);
    };

    const tagIdParam = getQueryParam('tagId');
    const tagId = tagIdParam ? Number(tagIdParam) : null;

    useEffect(() => {
        const fetchWords = async () => {
            try {
                const allWords = await get_saved_words();
                const filtered = tagId !== null
                    ? allWords.filter(word => word.tag === tagId)
                    : allWords;

                setWords(filtered);
            } catch (err) {
                console.error('Failed to fetch saved words:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchWords();
    }, [tagId]);

    return (
        <main className='protected-main'>
            <div className="word-list-container">
                <h1 className="word-list-title">{tagId !== null ? 'Words in Selected Tag' : 'My Word List'}</h1>

                {loading ? (
                    <p>Loading...</p>
                ) : words.length === 0 ? (
                    <p>No words found{tagId !== null ? ' for this tag' : ''}.</p>
                ) : (
                    <ul className="word-list-items">
                        {words.map((word, idx) => (
                            <li key={idx} className="word-list-item">
                                <span className="word-list-icon">🌿</span>

                                <Link to={`/my-words/${word.id}`} className="word-link">{word.word}</Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </main>
    );
};

export default WordListPage;
