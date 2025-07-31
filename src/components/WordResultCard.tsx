import { useState } from 'react';
import { WordData } from '../types/word';
import TagDropdown from './TagDropdown';
import '../styles/WordResultCard.css';


interface Tag {
    id: number;
    name: string;
}
interface WordResultCardProps {
    data: WordData;
    onSave: (tagId: number | null) => void;
    tags: Tag[];
    setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
}

const WordResultCard = ({ data, onSave, tags, setTags }: WordResultCardProps) => {
    const [selectedTagId, setSelectedTagId] = useState<number | null>(null);


    const handleTagSelect = (tagId: number | null) => {
        setSelectedTagId(tagId);
    };


    const handleSaveClick = () => {
        onSave(selectedTagId);

        const tagName = tags.find(tag => tag.id === selectedTagId)?.name;

        alert(
            tagName
                ? `Your word is saved successfully to the "${tagName}" tag.`
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