import { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import WordResultCard from '../components/WordResultCard';
import { WordData } from '../types/word';
import { getWordData } from '../api/dictionary';
import { useNavigate } from 'react-router-dom';
import { save_word, get_tags } from '../endpoints/api';

interface Tag {
    id: number;
    name: string;
}
const HomePage = () => {
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [wordData, setWordData] = useState<WordData | null>(null);
    const [notFound, setNotFound] = useState(false);
    const [savedWords, setSavedWords] = useState<WordData[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);


    // Load saved words from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('savedWords');
        if (saved) {
            setSavedWords(JSON.parse(saved));
        }
    }, []);

    // Sync tags to localStorage whenever they change
    useEffect(() => {
        async function fetchTags() {
            const result = await get_tags();
            if (result && Array.isArray(result)) {
                setTags(result);
            }
        }

        fetchTags();
    }, []);


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

    // const handleSaveWord = (tag: string) => {
    //     if (wordData) {
    //         const cleanedMeanings = wordData.meanings.map((m: any) => ({
    //             partOfSpeech: m.partOfSpeech,
    //             definitions: m.definitions,
    //         }));

    //         const wordWithTag = {
    //             ...wordData,
    //             meanings: cleanedMeanings,
    //             tag: tag || 'Untagged',
    //         };

    //         const updatedWords = [...savedWords, wordWithTag];
    //         setSavedWords(updatedWords);
    //         localStorage.setItem('savedWords', JSON.stringify(updatedWords));
    //     }
    // };

    const handleSaveWord = async (tagId: number | null) => {
        if (wordData) {
            const cleanedMeanings = wordData.meanings.map((m: any) => ({
                part_of_speech: m.partOfSpeech,
                definitions: m.definitions,
            }));

            const wordToSend = {
                word: wordData.word,
                phonetic: wordData.phonetic,
                audio: wordData.audio,
                note: '',
                tag: tagId,
                meanings: cleanedMeanings,
            };

            try {
                await save_word(wordToSend);
                alert('✅ Word saved to backend!');
            } catch (err) {
                console.error('Error saving word:', err);
                alert('❌ Failed to save word');
            }
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
            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                <button onClick={() => navigate('/my-words')}>My Word List</button>
                <button onClick={() => navigate('/tags')}>Browse All Tags</button>
            </div>
        </div>
    );
};

export default HomePage;