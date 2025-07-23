import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import WordResultCard from '../components/WordResultCard';
import { WordData } from '../types/word';
import { getWordData } from '../api/dictionary';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [wordData, setWordData] = useState<WordData | null>(null);
    const [notFound, setNotFound] = useState(false);
    const [savedWords, setSavedWords] = useState<WordData[]>([]);

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
            const wordWithTag = { ...wordData, tag };
            setSavedWords(prev => [...prev, wordWithTag]);
            console.log("Saved words:", [...savedWords, wordWithTag]);
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
            <div style={{ marginTop: '20px' }}>
                <button onClick={() => navigate('/my-words')}>My Word List</button>
                <button onClick={() => navigate('/tags')} style={{ marginLeft: '10px' }}>
                    Browse Tags
                </button>
            </div>
        </div>
    );
};

export default HomePage;