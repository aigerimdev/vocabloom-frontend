import { useEffect, useState } from 'react';
import { WordData } from '../types/word';
import '../styles/WordListPage.css';

const WordListPage = () => {
    const [words, setWords] = useState<WordData[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('savedWords');
        if (saved) {
            setWords(JSON.parse(saved));
        }
    }, []);

    return (
        <div className="word-list-container">
            <h1 className="word-list-title">My Words List</h1>

            {words.length === 0 ? (
                <p style={{ textAlign: 'center' }}>No words saved yet.</p>
            ) : (
                <ul className="word-list-items">
                    {words.map((word, index) => (
                        <li key={`${word.word}-${index}`} className="word-list-item">
                            <span className="word-list-icon">🌿</span>
                            {word.word}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default WordListPage;
