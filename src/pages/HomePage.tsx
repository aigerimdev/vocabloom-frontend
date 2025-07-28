// import React, { useState, useEffect } from 'react';
// import SearchBar from '../components/SearchBar';
// import WordResultCard from '../components/WordResultCard';
// import { WordData } from '../types/word';
// import { getWordData } from '../api/dictionary';
// import { useNavigate } from 'react-router-dom';

// const HomePage = () => {
//     const navigate = useNavigate();

//     const [searchTerm, setSearchTerm] = useState('');
//     const [wordData, setWordData] = useState<WordData | null>(null);
//     const [notFound, setNotFound] = useState(false);
//     const [savedWords, setSavedWords] = useState<WordData[]>([]);


//     useEffect(() => {
//         const saved = localStorage.getItem('savedWords');
//         if (saved) {
//             setSavedWords(JSON.parse(saved));
//         }
//     }, []);

//     const handleSearch = async () => {
//         if (!searchTerm.trim()) return;

//         try {
//             const data = await getWordData(searchTerm);
//             setWordData(data);
//             setNotFound(false);
//         } catch (err) {
//             console.error(err);
//             setWordData(null);
//             setNotFound(true);
//         }
//     };
//     const handleSaveWord = (tag: string) => {
//         if (wordData) {
//             const cleanedMeanings = wordData.meanings.map((m: any) => ({
//                 partOfSpeech: m.partOfSpeech || m.partOfSpeech,  // handles both cases
//                 definitions: m.definitions,
//             }));

//             const wordWithTag = {
//                 ...wordData,
//                 meanings: cleanedMeanings,
//                 tag: tag || 'Untagged',
//             };

//             const updatedWords = [...savedWords, wordWithTag];
//             setSavedWords(updatedWords);
//             localStorage.setItem('savedWords', JSON.stringify(updatedWords));
//         }
//     };



//     return (
//         <div>
//             <h1>Vocabloom 🌱</h1>
//             <p>Plant a word, grow your vocabulary.</p>

//             <SearchBar
//                 value={searchTerm}
//                 onChange={setSearchTerm}
//                 onSearch={handleSearch}
//             />

//             {wordData && (
//                 <WordResultCard
//                     data={wordData}
//                     onSave={handleSaveWord}
//                 />
//             )}

//             {notFound && <p style={{ color: 'red' }}>Sorry! Word not found.</p>}
//             <div style={{ marginTop: '20px' }}>
//                 <button onClick={() => navigate('/my-words')}>My Word List</button>
//                 <button onClick={() => navigate('/tags')} style={{ marginLeft: '10px' }}>
//                     Browse Tags
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default HomePage;
import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import WordResultCard from '../components/WordResultCard';
import TagDropdown from '../components/TagDropdown';
import { WordData } from '../types/word';
import { getWordData } from '../api/dictionary';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [wordData, setWordData] = useState<WordData | null>(null);
    const [notFound, setNotFound] = useState(false);
    const [savedWords, setSavedWords] = useState<WordData[]>([]);
    const [tags, setTags] = useState<string[]>(['School', 'Development']);

    // Load saved words from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('savedWords');
        if (saved) {
            setSavedWords(JSON.parse(saved));
        }
    }, []);

    // Sync tags to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('tags', JSON.stringify(tags));
    }, [tags]);

    const handleSearch = async () => {
        if (!searchTerm.trim()) return;

        try {
            const data = await getWordData(searchTerm);
            setWordData(data);
            setNotFound(false);
        } catch (err) {
            console.error(err);
            setWordData(null);
            setNotFound(true);
        }
    };

    const handleSaveWord = (tag: string) => {
        if (wordData) {
            const cleanedMeanings = wordData.meanings.map((m: any) => ({
                partOfSpeech: m.partOfSpeech,
                definitions: m.definitions,
            }));

            const wordWithTag = {
                ...wordData,
                meanings: cleanedMeanings,
                tag: tag || 'Untagged',
            };

            const updatedWords = [...savedWords, wordWithTag];
            setSavedWords(updatedWords);
            localStorage.setItem('savedWords', JSON.stringify(updatedWords));
        }
    };

    return (
        <div>
            <h1>Vocabloom 🌱</h1>
            <p>Plant a word, grow your vocabulary.</p>

            <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                onSearch={handleSearch}
            />

            {wordData && (
                <WordResultCard
                    data={wordData}
                    onSave={handleSaveWord}
                    tags={tags}
                    setTags={setTags}
                />
            )}

            {notFound && <p style={{ color: 'red' }}>Sorry! Word not found.</p>}

            <div style={{ marginTop: '20px' }}>
                <TagDropdown
                    onSelect={handleSaveWord}
                    tags={tags}
                    setTags={setTags}
                />
            </div>

            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                <button onClick={() => navigate('/my-words')}>My Word List</button>
                <button onClick={() => navigate('/tags')}>Browse All Tags</button>
            </div>
        </div>
    );
};

export default HomePage;