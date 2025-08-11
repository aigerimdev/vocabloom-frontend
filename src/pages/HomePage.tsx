import { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import WordResultCard from '../components/WordResultCard';
import { WordData } from '../types/word';
import { getWordData } from '../api/dictionary';
import { useNavigate } from 'react-router-dom';
import { save_word, get_tags } from '../endpoints/api';
import PersonalWordForm from '../components/PersonalWordForm';
import '../styles/HomePage.css';

interface Tag {
    id: number;
    name: string;
}
const HomePage = () => {
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [wordData, setWordData] = useState<WordData | null>(null);
    const [notFound, setNotFound] = useState(false);
    const [, setSavedWords] = useState<WordData[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);

    const [showPersonalWordForm, setShowPersonalWordForm] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('savedWords');
        if (saved) {
            setSavedWords(JSON.parse(saved));
        }
    }, []);

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

            setSearchTerm('');
        } catch (err) {
            console.error(err);
            setWordData(null);
            setNotFound(true);
        }
    };

    const handleSaveWord = async (wordDataWithTag: WordData & { tag: number | null }) => {
        try {
            const savedWord = await save_word(wordDataWithTag);
            console.log("Saved to backend:", wordDataWithTag);

            if (savedWord) {
                console.log("Personal word saved successfully:", savedWord);
                alert(`Personal word "${wordDataWithTag.word}" saved successfully!`);
            } else {
                throw new Error('Failed to save word');
            }
        } catch (err) {
            console.error("Error saving word:", err);
        }
    };

    const handleCloseWordCard = () => {
        setWordData(null);
        setNotFound(false);
    };

    return (
        <main className='protected-main'>
            <h1 className="app-title">VocaBloom 🌱</h1>
            <p className="app-tagline">Plant a word, grow your vocabulary.</p>

            <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                onSearch={handleSearch}
            />

            {wordData && (
                <WordResultCard
                    data={wordData}
                    onSave={handleSaveWord}
                    onClose={handleCloseWordCard}
                    tags={tags}
                    setTags={setTags}
                />
            )}
            <div className="button-wrapper">
                <button
                    className="create-personal-word-btn"
                    onClick={() => setShowPersonalWordForm(true)}
                >
                    Create Your Own Word
                </button>
            </div>
            <PersonalWordForm
                isOpen={showPersonalWordForm}
                onClose={() => setShowPersonalWordForm(false)}
                onSave={handleSaveWord}
                tags={tags}
                setTags={setTags}
            />

            {notFound && <p style={{ color: 'red' }}>Sorry! Word not found.</p>}
            <div className="button-wrapper">
                <div className="bottom-buttons">
                    <button className="action-button" onClick={() => navigate('/my-words')}>
                        <div className="icon-circle word"><img
                            src="https://img.icons8.com/?size=100&id=LGOY4KAmjR0K&format=png&color=000000"
                            alt="My Word List"
                        />
                        </div>
                        <span>My Word List</span></button>
                    <button className="action-button" onClick={() => navigate('/tags')}>
                        <div className="icon-circle tag"><img
                            src="https://img.icons8.com/?size=100&id=P3XAjXroE8yW&format=png&color=000000"
                            alt="Browse By Tag"
                        />
                        </div>
                        <span>Browse By Tag</span>
                    </button>
                </div>
            </div>
        </main>
    );
};

export default HomePage;