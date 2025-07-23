// import React, { useState } from 'react';
// import SearchBar from '../components/SearchBar';
// import WordResultCard from '../components/WordResultCard';
// import { WordData } from '../types/word';
// import { getWordData } from '../api/dictionary';

// const HomePage = () => {
//     const [searchTerm, setSearchTerm] = useState('');
//     const [wordData, setWordData] = useState<WordData | null>(null);
//     const [notFound, setNotFound] = useState(false);

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
//                     onSave={() => console.log('Saved to profile')}
//                 />
//             )}

//             {notFound && <p style={{ color: 'red' }}>Sorry! Word not found.</p>}
//         </div>
//     );
// };

// export default HomePage;
import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import WordResultCard from '../components/WordResultCard';
import { WordData } from '../types/word';
import { getWordData } from '../api/dictionary';

const HomePage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [wordData, setWordData] = useState<WordData | null>(null);
    const [notFound, setNotFound] = useState(false);

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
            console.log(`Saving word "${wordData.word}" with tag: ${tag}`);
            // TODO: Send to backend or save to profile
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
                />
            )}

            {notFound && <p style={{ color: 'red' }}>Sorry! Word not found.</p>}
        </div>
    );
};

export default HomePage;

