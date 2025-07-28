import { useState } from 'react';
import { WordData } from '../types/word';
import TagDropdown from './TagDropdown';
import '../styles/WordResultCard.css';

interface WordResultCardProps {
    data: WordData;
    onSave: (tag: string) => void;
    tags: string[];
    setTags: React.Dispatch<React.SetStateAction<string[]>>;
}

const WordResultCard = ({ data, onSave, tags, setTags }: WordResultCardProps) => {
    const [selectedTag, setSelectedTag] = useState<string>('');

    const handleTagSelect = (tag: string) => {
        setSelectedTag(tag);
    };

    const handleSaveClick = () => {
        onSave(selectedTag || '');
        alert(
            selectedTag
                ? `Your word is saved successfully to the "${selectedTag}" tag.`
                : "Your word is saved successfully to My Word List."
        );
    };

    return (
        <div className="word-card">
            <h2>{data.word}</h2>

            {data.phonetic && <p className="phonetic">/{data.phonetic}/</p>}

            {data.audio && (
                <audio controls>
                    <source src={data.audio} type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>
            )}

            {Array.isArray(data.meanings) &&
                data.meanings.map((meaning, index) => (
                    <div key={index}>
                        <h3>{meaning.partOfSpeech}</h3>
                        <ul>
                            {meaning.definitions.map((def, defIndex) => (
                                <li key={defIndex}>
                                    <p>{def.definition}</p>
                                    {def.example && <em>{def.example}</em>}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}

            <TagDropdown
                onSelect={handleTagSelect}
                tags={tags}
                setTags={setTags}
            />

            <button onClick={handleSaveClick}>Save Word</button>
        </div>
    );
};

export default WordResultCard;