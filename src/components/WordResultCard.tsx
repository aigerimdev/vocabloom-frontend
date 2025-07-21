import React from 'react';
import { WordData } from '../types/word';
import '../styles/WordResultCard.css';

interface WordResultCardProps {
    data: WordData;
    onSave: () => void;
}

const WordResultCard: React.FC<WordResultCardProps> = ({ data, onSave }) => {
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

            <ol>
                {data.definitions.map((def, index) => (
                    <li key={index}>
                        <p>{def.meaning}</p>
                        {def.example && <em>{def.example}</em>}
                    </li>
                ))}
            </ol>

            <button onClick={onSave}>Save Word</button>
        </div>
    );
};

export default WordResultCard;
