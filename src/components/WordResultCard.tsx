import { useState } from 'react';
import { WordData } from '../types/word';
import TagDropdown from './TagDropdown';
import ConfirmationModal from './ConfirmationModal';
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
    onClose?: () => void;
    tags: Tag[];
    setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
}

const WordResultCard: React.FC<WordResultCardProps> = ({ data, onSave, onClose, tags, setTags }) => {
    const [selectedTagId, setSelectedTagId] = useState<number | null>(null);

    const [modalOpen, setModalOpen] = useState(false);
    const [modalMsg, setModalMsg] = useState('');

    const handleTagSelect = (tagId: number | null, _tagName: string | null) => {
        setSelectedTagId(tagId);
    };

    const handleSaveClick = async () => {
        const wordToSave: WordData & { tag: number | null } = { ...data, tag: selectedTagId };

        try {
            const savedWord = await save_word(wordToSave);

            const existing = localStorage.getItem('savedWords');
            const currentWords: WordData[] = existing ? JSON.parse(existing) : [];
            localStorage.setItem('savedWords', JSON.stringify([...currentWords, savedWord]));

            onSave?.(wordToSave);

        } catch (e: any) {
            setModalMsg(
                e?.message === 'WORD_DUPLICATE'
                    ? 'This word already exists.'
                    : 'Couldn’t save. Please try again.'
            );
            setModalOpen(true);
        }
    };

    const capitalize = (word: string) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : '');

    return (
        <div className="word-card">
            <section className="word-card-header">
                {onClose && (
                    <button className="word-card-close-btn" onClick={onClose} title="Close">
                        ✕
                    </button>
                )}
                <h1 className="word-detail-title">{capitalize(data.word)}</h1>
                {data.phonetic && <p className="word-detail-phonetic">/{data.phonetic}/</p>}
            </section>

            <div className="word-card-main">
                {data.audio && (
                    <audio controls>
                        <source src={data.audio} type="audio/mpeg" />
                        Your browser does not support the audio element.
                    </audio>
                )}
                {Array.isArray(data.meanings) &&
                    data.meanings.map((meaning, index) => (
                        <div key={index}>
                            <h2 className="word-detail-subtitle">{capitalize(meaning.partOfSpeech)}</h2>
                            <ul className="word-definitions">
                                {meaning.definitions.map((def, defIndex) => (
                                    <li key={defIndex}>
                                        <p className="word-definitions-definition">{def.definition}</p>
                                        <p className="word-definitions-example">{def.example && <em> - {def.example}</em>}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                <div className="word-card-buttons">
                    <TagDropdown onSelect={handleTagSelect} tags={tags} setTags={setTags} />
                    <button className="word-detail-button" onClick={handleSaveClick}>
                        Save Word
                    </button>
                </div>
            </div>

            <ConfirmationModal
                isOpen={modalOpen}
                title="Save Error"
                message={modalMsg}
                confirmText="OK"
                cancelText=""
                onConfirm={() => setModalOpen(false)}
                onCancel={() => setModalOpen(false)}
                type="danger"
            />
        </div>
    );
};

export default WordResultCard;
