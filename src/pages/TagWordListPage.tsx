import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { get_words_by_tag } from '../endpoints/api';
import { WordData } from '../types/word';


const TagWordListPage = () => {
    const [words, setWords] = useState<WordData[]>([]);
    const [notFound, setNotFound] = useState(false);

    const location = useLocation();

    const getQueryParam = (key: string) => {
        const params = new URLSearchParams(location.search);
        return params.get(key);
    };

    const tagId = getQueryParam('tagId');
    const tagName = getQueryParam('tagName');

    useEffect(() => {
        async function fetchData() {
            if (!tagId) return;

            const wordList = await get_words_by_tag(Number(tagId));
            if (Array.isArray(wordList)) {
                setWords(wordList);
                setNotFound(wordList.length === 0);
            } else {
                setWords([]);
                setNotFound(true);
            }
        }

        fetchData();
    }, [tagId]);

    return (
        <main className='protected-main'>
            <h1>{tagName} Words</h1>
            {notFound ? (
                <p>No words saved under this tag yet.</p>
            ) : (
                <ul>
                    {words.map((word, idx) => (
                        <li key={`${word.word}-${idx}`}>{word.word}</li>
                    ))}
                </ul>
            )}
        </main>
    );
};

export default TagWordListPage;
