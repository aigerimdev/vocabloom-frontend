import { useState } from 'react';
import { WordData } from '../types/word';
import { useNavigate } from 'react-router-dom';
import TagDropdown from './TagDropdown';
import '../styles/WordResultCard.css';
import '../styles/WordDetailPage.css';
import { save_word } from '../endpoints/api';

interface Tag {
    id: number;
    name: string;
}

interface WordResultCardProps {
    data: WordData;
    onSave: (wordDataWithTag: WordData & { tag: number | null }) => void;
    onClose?: () => void; // New optional prop
    tags: Tag[];
    setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
}

const WordResultCard = ({ data, onSave, onClose, tags, setTags }: WordResultCardProps) => {
    const [selectedTagId, setSelectedTagId] = useState<number | null>(null);
    const [selectedTagName, setSelectedTagName] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleTagSelect = (tagId: number | null, tagName: string | null) => {
        setSelectedTagId(tagId);
        setSelectedTagName(tagName);
    };

    const handleSaveClick = async () => {
        const wordToSave: WordData & { tag: number | null } = {
            ...data,
            tag: selectedTagId,
        };

        try {
            const savedWord = await save_word(wordToSave);

            if (savedWord) {
                const existing = localStorage.getItem('savedWords');
                const currentWords: WordData[] = existing ? JSON.parse(existing) : [];
                const updated = [...currentWords, savedWord];
                localStorage.setItem('savedWords', JSON.stringify(updated));

                alert(
                    selectedTagName
                        ? `Your word is saved successfully to the "${selectedTagName}" tag.`
                        : "Your word is saved successfully to My Word List."
                );
                navigate(`/my-words/${savedWord.id}`);
            }
        } catch (err) {
            console.error("Failed to save word:", err);
            alert("There was an error saving your word. Please try again.");
        }
    };

    function capitalize(word: string) {
        if (!word) return "";
        return word.charAt(0).toUpperCase() + word.slice(1);
    }

    return (
        <div className="word-card">
            <section className='word-card-header'>
                {/* Close button */}
                {onClose && (
                    <button 
                        className="word-card-close-btn" 
                        onClick={onClose}
                        title="Close"
                    >
                        ✕
                    </button>
                )}
                <h1 className='word-detail-title'>{capitalize(data.word)}</h1>
                {data.phonetic && <p className="word-detail-phonetic">/{data.phonetic}/</p>}
                
            </section>

            <div className='word-card-main'>
                {data.audio && (
                    <audio controls>
                        <source src={data.audio} type="audio/mpeg" />
                        Your browser does not support the audio element.
                    </audio>
                )}
                {Array.isArray(data.meanings) &&
                    data.meanings.map((meaning, index) => (
                        <div key={index}>
                            <h2 className='word-detail-subtitle'>{capitalize(meaning.partOfSpeech)}</h2>
                            <ul className='word-definitions'>
                                {meaning.definitions.map((def, defIndex) => (
                                    <li key={defIndex}>
                                        <p className='word-definitions-definition'>{def.definition}</p>
                                        <p className='word-definitions-example'>{def.example && <em> - {def.example}</em>}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                <div className='word-card-buttons'>
                    <TagDropdown
                        onSelect={handleTagSelect}
                        tags={tags}
                        setTags={setTags}
                    />

                    <button className='word-detail-button' onClick={handleSaveClick}>Save Word</button>
                </div>
            </div>
        </div>
    );
};

export default WordResultCard;
