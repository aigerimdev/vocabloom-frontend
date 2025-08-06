import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { get_saved_words } from '../endpoints/api';
import { WordData } from '../types/word';
import { get_tag_by_id } from '../endpoints/api';
import '../styles/WordListPage.css';

const WordListPage = () => {
    const [words, setWords] = useState<WordData[]>([]);
    const [tagName, setTagName] = useState<string | null>(null);

    const [loading, setLoading] = useState(true);

    const location = useLocation();

    const getQueryParam = (key: string) => {
        const params = new URLSearchParams(location.search);
        return params.get(key);
    };

    const tagIdParam = getQueryParam('tagId');
    const tagId = tagIdParam ? Number(tagIdParam) : null;

    // useEffect(() => {
    //     const fetchWords = async () => {
    //         try {
    //             const allWords = await get_saved_words();
    //             const filtered = tagId !== null
    //                 ? allWords.filter(word => word.tag === tagId)
    //                 : allWords;

    //             setWords(filtered);
    //         } catch (err) {
    //             console.error('Failed to fetch saved words:', err);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get saved words
                const allWords = await get_saved_words();
                const filtered = tagId !== null
                    ? allWords.filter(word => word.tag === tagId)
                    : allWords;

                setWords(filtered);

                // Get tag name by ID (if tagId exists)
                if (tagId !== null) {
                    try {
                        const tag = await get_tag_by_id(tagId);
                        setTagName(tag.name);
                    } catch (err) {
                        setTagName(null); // fallback
                    }
                } else {
                    setTagName(null); // clear tagName when not filtering
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
            <div className="word-list-container">
                {/* option 1 when loading shows loading message */}
                <h1 className="word-list-title">
                    {tagId !== null && tagName
                        ? `${tagName} Collection`
                        : tagId !== null
                            ? 'Loading...'
                            : 'My Word List'}
                </h1>
                {/* option 2 when loading shows My Word List */}
                {/* <h1 className="word-list-title">
                    {tagId !== null && tagName
                        ? `${tagName} Collection`
                        : 'My Word List'}
                </h1> */}
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
