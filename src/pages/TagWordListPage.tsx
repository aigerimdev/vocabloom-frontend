import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { WordData } from '../types/word';
import '../styles/WordListPage.css';

const TagWordListPage = () => {
    const { tagName } = useParams();
    const [filteredWords, setFilteredWords] = useState<WordData[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('savedWords');
        if (saved && tagName) {
            const allWords: WordData[] = JSON.parse(saved);
            const tagWords = allWords.filter(word => word.tag === tagName);
            setFilteredWords(tagWords);
        }
    }, [tagName]);

    return (
        <div className="word-list-container">
            <h1 className="word-list-title">{tagName} Words</h1>

            {filteredWords.length === 0 ? (
                <p style={{ textAlign: 'center' }}>No words with tag "{tagName}" yet.</p>
            ) : (
                <ul className="word-list-items">
                    {filteredWords.map((word, index) => (
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

export default TagWordListPage;
