import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { WordData } from '../types/word';
import '../styles/WordListPage.css';

const WordListPage = () => {
    const [words, setWords] = useState<WordData[]>([]);
    const location = useLocation();

    // helper to get query params
    const getQueryParam = (param: string) => {
        const params = new URLSearchParams(location.search);
        return params.get(param);
    };

    useEffect(() => {
        const saved = localStorage.getItem('savedWords');
        const selectedTag = getQueryParam('tag');

        if (saved) {
            const allWords: WordData[] = JSON.parse(saved);
            const filtered = selectedTag
                ? allWords.filter(word => word.tag === selectedTag)
                : allWords;

            setWords(filtered);
        }
    }, [location.search]);

    return (
        <div className="word-list-container">
            <h1 className="word-list-title">
                {getQueryParam('tag') ? `${getQueryParam('tag')} Words` : 'My Words List'}
            </h1>

            {words.length === 0 ? (
                <p style={{ textAlign: 'center' }}>No words saved yet.</p>
            ) : (
                <ul className="word-list-items">
                    {words.map((word, index) => (
                        <li key={`${word.word}-${index}`} className="word-list-item">
                            <span className="word-list-icon">🌿</span>
                            <Link to={`/my-words/${word.word.toLowerCase()}`}>
                                {word.word}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default WordListPage;
