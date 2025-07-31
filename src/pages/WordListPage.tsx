
// import { useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import { WordData } from '../types/word';
// import { get_saved_words } from '../endpoints/api';

// const WordListPage = () => {
//     const [words, setWords] = useState<WordData[]>([]);
//     const location = useLocation();

//     const getQueryParam = (key: string) => {
//         const params = new URLSearchParams(location.search);
//         return params.get(key);
//     };

//     const tagIdParam = getQueryParam('tagId');
//     const tagId = tagIdParam ? Number(tagIdParam) : null;

//     useEffect(() => {
//         async function fetchWords() {
//             const data = await get_saved_words();
//             const filtered = tagId !== null
//                 ? data.filter(word => word.tag === tagId)
//                 : data;
//             setWords(filtered);
//         }

//         fetchWords();
//     }, [tagId]);

//     return (
//         <div>
//             <h1>{tagId !== null ? 'Words in Selected Tag' : 'My Word List'}</h1>
//             {words.length === 0 ? (
//                 <p>No words found{tagId !== null ? ' for this tag' : ''}.</p>
//             ) : (
//                 <ul>
//                     {words.map((word, idx) => (
//                         <li key={idx}>{word.word}</li>
//                     ))}
//                 </ul>
//             )}
//         </div>
//     );
// };

// export default WordListPage;
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { WordData } from '../types/word';
import { get_saved_words } from '../endpoints/api';

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
        async function fetchWords() {
            setLoading(true);
            const data = await get_saved_words();
            const filtered = tagId !== null
                ? data.filter(word => word.tag === tagId)
                : data;
            setWords(filtered);
            setLoading(false);
        }

        fetchWords();
    }, [tagId]);

    return (
        <div>
            <h1>{tagId !== null ? 'Words in Selected Tag' : 'My Word List'}</h1>

            {loading ? (
                <p>Loading...</p>
            ) : words.length === 0 ? (
                <p>No words found{tagId !== null ? ' for this tag' : ''}.</p>
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
