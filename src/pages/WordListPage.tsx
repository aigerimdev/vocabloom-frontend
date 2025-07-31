import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { WordData } from '../types/word';
import { get_words_by_tag } from '../endpoints/api';

const WordListPage = () => {
    const [words, setWords] = useState<WordData[]>([]);
    const location = useLocation();

    const getQueryParam = (param: string) => {
        const params = new URLSearchParams(location.search);
        return params.get(param);
    };

    const tagIdParam = getQueryParam('tagId');
    const tagName = getQueryParam('tagName');
    const tagId = tagIdParam ? Number(tagIdParam) : null;

    useEffect(() => {
        const fetchWords = async () => {
            if (tagId !== null) {
                const backendWords = await get_words_by_tag(tagId);
                if (Array.isArray(backendWords)) {
                    setWords(backendWords);
                } else {
                    setWords([]);
                }
            } else {
                const saved = localStorage.getItem('savedWords');
                if (saved) {
                    const localWords: WordData[] = JSON.parse(saved);
                    setWords(localWords);
                }
            }
        };

        fetchWords();
    }, [tagId]);

    return (
        <div>
            <h1>
                {tagId !== null && tagName ? `Words tagged "${tagName}"` : 'My Word List'}
            </h1>

            {words.length === 0 ? (
                <p>No words found{tagName ? ` for "${tagName}"` : ''}.</p>
            ) : (
                <ul>
                    {words.map((word, idx) => (
                        <li key={idx}>{word.word}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default WordListPage;
