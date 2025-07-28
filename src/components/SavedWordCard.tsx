import { WordData } from '../types/word';

const SavedWordCard = ({ data }: { data: WordData }) => {
    return (
        <div className="word-card">
            <h2>{data.word}</h2>
            {data.phonetic && <p className="phonetic">/{data.phonetic}/</p>}
            {data.audio && (
                <audio controls>
                    <source src={data.audio} type="audio/mpeg" />
                </audio>
            )}
            {data.meanings.map((meaning, index) => (
                <div key={index}>
                    <h3>{meaning.partOfSpeech}</h3>
                    <ul>
                        {meaning.definitions.map((def, i) => (
                            <li key={i}>
                                {def.definition}
                                {def.example && <em> — {def.example}</em>}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
            {data.tag && <p style={{ fontStyle: 'italic' }}>Tag: {data.tag}</p>}
        </div>
    );
};

export default SavedWordCard;
