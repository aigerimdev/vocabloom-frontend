import { useState } from 'react';
import { WordData } from '../types/word';
import TagDropdown from './TagDropdown';
import '../styles/WordResultCard.css';
import { save_word } from '../endpoints/api';


interface Tag {
    id: number;
    name: string;
}

interface WordResultCardProps {
    data: WordData;
    onSave: (wordDataWithTag: WordData & { tag: number | null }) => void;
    tags: Tag[];
    setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
}

const WordResultCard = ({ data, onSave, tags, setTags }: WordResultCardProps) => {
    const [selectedTagId, setSelectedTagId] = useState<number | null>(null);
    const [selectedTagName, setSelectedTagName] = useState<string | null>(null);

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
            const savedWord = await save_word(wordToSave); // Send to backend

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
            }
        } catch (err) {
            console.error("Failed to save word:", err);
            alert("There was an error saving your word. Please try again.");
        }
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
