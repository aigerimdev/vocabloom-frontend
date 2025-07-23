// import { WordData } from '../types/word';
// import '../styles/WordResultCard.css';

// interface WordResultCardProps {
//     data: WordData;
//     onSave: () => void;
// }

// const WordResultCard: React.FC<WordResultCardProps> = ({ data, onSave }) => {
//     return (
//         <div className="word-card">
//             <h2>{data.word}</h2>

//             {data.phonetic && <p className="phonetic">/{data.phonetic}/</p>}

//             {data.audio && (
//                 <audio controls>
//                     <source src={data.audio} type="audio/mpeg" />
//                     Your browser does not support the audio element.
//                 </audio>
//             )}

//             {Array.isArray(data.meanings) && data.meanings.map((meaning, index) => (
//                 <div key={index}>
//                     <h3>{meaning.partOfSpeech}</h3>
//                     <ul>
//                         {Array.isArray(meaning.definitions) && meaning.definitions.map((def, defIndex) => (
//                             <li key={defIndex}>
//                                 <p>{def.definition}</p>
//                                 {def.example && <em>{def.example}</em>}
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//             ))}

//             <button onClick={onSave}>Save Word</button>
//         </div>
//     );
// };

// export default WordResultCard;
import React, { useState } from 'react';
import { WordData } from '../types/word';
import TagDropdown from './TagDropdown';
import '../styles/WordResultCard.css';

interface WordResultCardProps {
    data: WordData;
    onSave: (tag: string) => void;
}

const WordResultCard: React.FC<WordResultCardProps> = ({ data, onSave }) => {
    const [selectedTag, setSelectedTag] = useState<string>('');

    const handleTagSelect = (tag: string) => {
        setSelectedTag(tag);
    };

    const handleSaveClick = () => {
        if (!selectedTag) {
            alert('Please select a tag before saving.');
            return;
        }

        onSave(selectedTag);
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

            {Array.isArray(data.meanings) && data.meanings.map((meaning, index) => (
                <div key={index}>
                    <h3>{meaning.partOfSpeech}</h3>
                    <ul>
                        {Array.isArray(meaning.definitions) && meaning.definitions.map((def, defIndex) => (
                            <li key={defIndex}>
                                <p>{def.definition}</p>
                                {def.example && <em>{def.example}</em>}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}

            <TagDropdown onSelect={handleTagSelect} />

            <button onClick={handleSaveClick}>Save Word</button>
        </div>
    );
};

export default WordResultCard;
