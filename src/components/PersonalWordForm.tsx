import React, { useState, useEffect } from 'react';
import { WordData } from '../types/word';
import TagDropdown from './TagDropdown';
import '../styles/PersonalWordForm.css';

interface Tag {
    id: number;
    name: string;
}

interface PersonalWordFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (wordData: WordData & { tag: number | null }) => void;
    tags: Tag[];
    setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
}

const PersonalWordForm: React.FC<PersonalWordFormProps> = ({
    isOpen,
    onClose,
    onSave,
    tags,
    setTags
}) => {
    const [formData, setFormData] = useState({
        word: '',
        phonetic: '',
        meanings: [
            {
                partOfSpeech: '',
                definitions: [
                    {
                        definition: '',
                        example: ''
                    }
                ]
            }
        ]
    });
    const [selectedTagId, setSelectedTagId] = useState<number | null>(null);
    const [selectedTagName, setSelectedTagName] = useState<string | null>(null);

    // Reset form when popup opens/closes
    useEffect(() => {
        if (!isOpen) {
            setFormData({
                word: '',
                phonetic: '',
                meanings: [
                    {
                        partOfSpeech: '',
                        definitions: [
                            {
                                definition: '',
                                example: ''
                            }
                        ]
                    }
                ]
            });
            setSelectedTagId(null);
            setSelectedTagName(null);
        }
    }, [isOpen]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleMeaningChange = (meaningIndex: number, field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            meanings: prev.meanings.map((meaning, index) =>
                index === meaningIndex
                    ? { ...meaning, [field]: value }
                    : meaning
            )
        }));
    };

    const handleDefinitionChange = (meaningIndex: number, defIndex: number, field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            meanings: prev.meanings.map((meaning, mIndex) =>
                mIndex === meaningIndex
                    ? {
                        ...meaning,
                        definitions: meaning.definitions.map((def, dIndex) =>
                            dIndex === defIndex
                                ? { ...def, [field]: value }
                                : def
                        )
                    }
                    : meaning
            )
        }));
    };

    const addDefinition = (meaningIndex: number) => {
        setFormData(prev => ({
            ...prev,
            meanings: prev.meanings.map((meaning, index) =>
                index === meaningIndex
                    ? {
                        ...meaning,
                        definitions: [...meaning.definitions, { definition: '', example: '' }]
                    }
                    : meaning
            )
        }));
    };

    const removeDefinition = (meaningIndex: number, defIndex: number) => {
        setFormData(prev => ({
            ...prev,
            meanings: prev.meanings.map((meaning, mIndex) =>
                mIndex === meaningIndex
                    ? {
                        ...meaning,
                        definitions: meaning.definitions.filter((_, dIndex) => dIndex !== defIndex)
                    }
                    : meaning
            )
        }));
    };

    const addMeaning = () => {
        setFormData(prev => ({
            ...prev,
            meanings: [
                ...prev.meanings,
                {
                    partOfSpeech: '',
                    definitions: [{ definition: '', example: '' }]
                }
            ]
        }));
    };

    const removeMeaning = (meaningIndex: number) => {
        if (formData.meanings.length > 1) {
            setFormData(prev => ({
                ...prev,
                meanings: prev.meanings.filter((_, index) => index !== meaningIndex)
            }));
        }
    };

    const handleTagSelect = (tagId: number | null, tagName: string | null) => {
        setSelectedTagId(tagId);
        setSelectedTagName(tagName);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate required fields
        if (!formData.word.trim()) {
            alert('Word is required');
            return;
        }

        if (formData.meanings.some(m => !m.partOfSpeech.trim())) {
            alert('Part of speech is required for all meanings');
            return;
        }

        if (formData.meanings.some(m =>
            m.definitions.some(d => !d.definition.trim())
        )) {
            alert('Definition is required for all entries');
            return;
        }

        // Create word data structure
        const wordData: WordData & { tag: number | null } = {
            id: Date.now(),
            word: formData.word.trim(),
            phonetic: formData.phonetic.trim() || undefined,
            audio: undefined, // No audio
            meanings: formData.meanings.map(meaning => ({
                partOfSpeech: meaning.partOfSpeech.trim(),
                definitions: meaning.definitions.filter(def => def.definition.trim()).map(def => ({
                    definition: def.definition.trim(),
                    example: def.example.trim() || undefined
                }))
            })),
            tag: selectedTagId
        };

        console.log('Saving word:', wordData);
        onSave(wordData);
        onClose();
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="personal-word-form-backdrop" onClick={handleBackdropClick}>
            <div className="personal-word-form-container">
                <div className="personal-word-form-header">
                    <button
                        type="button"
                        className="close-button"
                        onClick={onClose}
                    >
                        ×
                    </button>
                    <h2>Create Your Own Word</h2>
                </div>

                <form onSubmit={handleSubmit} className="personal-word-form">
                    {/* Word Input */}
                    <div className="form-group">
                        <label htmlFor="word">Word *</label>
                        <input
                            type="text"
                            id="word"
                            value={formData.word}
                            onChange={(e) => handleInputChange('word', e.target.value)}
                            placeholder="Enter the word"
                            required
                        />
                    </div>

                    {/* Phonetic Input */}
                    <div className="form-group">
                        <label htmlFor="phonetic">Phonetic (optional)</label>
                        <input
                            type="text"
                            id="phonetic"
                            value={formData.phonetic}
                            onChange={(e) => handleInputChange('phonetic', e.target.value)}
                            placeholder="e.g., /həˈloʊ/"
                        />
                    </div>

                    {/* Tag Selection */}
                    <div className="form-group">
                        <label>Tag (optional)</label>
                        <TagDropdown
                            onSelect={handleTagSelect}
                            tags={tags}
                            setTags={setTags}
                        />
                    </div>

                    {/* Meanings */}
                    <div className="form-group">
                        <div className="meanings-header">
                            <label>Meanings *</label>
                        </div>

                        {formData.meanings.map((meaning, meaningIndex) => (
                            <div key={meaningIndex} className="meaning-section">
                                <div className="meaning-header">
                                    <h4>Meaning {meaningIndex + 1}</h4>
                                    {formData.meanings.length > 1 && (
                                        <button
                                            type="button"
                                            className="remove-meaning-btn"
                                            onClick={() => removeMeaning(meaningIndex)}
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>

                                <div className="form-subgroup">
                                    <label>Part of Speech *</label>
                                    <select
                                        value={meaning.partOfSpeech}
                                        onChange={(e) => handleMeaningChange(meaningIndex, 'partOfSpeech', e.target.value)}
                                        required
                                    >
                                        <option value="">Select part of speech</option>
                                        <option value="non_applicable">N/A</option>
                                        <option value="noun">Noun</option>
                                        <option value="verb">Verb</option>
                                        <option value="adjective">Adjective</option>
                                        <option value="adverb">Adverb</option>
                                        <option value="pronoun">Pronoun</option>
                                        <option value="preposition">Preposition</option>
                                        <option value="conjunction">Conjunction</option>
                                        <option value="interjection">Interjection</option>
                                    </select>
                                </div>

                                {/* Definitions */}
                                <div className="definitions-section">
                                    <div className="definitions-header">
                                        <label>Definitions *</label>
                                        <button
                                            type="button"
                                            className="add-definition-btn"
                                            onClick={() => addDefinition(meaningIndex)}
                                        >
                                            + Add Definition
                                        </button>
                                    </div>

                                    {meaning.definitions.map((definition, defIndex) => (
                                        <div key={defIndex} className="definition-group">
                                            <div className="definition-header">
                                                <span>Definition {defIndex + 1}</span>
                                                {meaning.definitions.length > 1 && (
                                                    <button
                                                        type="button"
                                                        className="remove-definition-btn"
                                                        onClick={() => removeDefinition(meaningIndex, defIndex)}
                                                    >
                                                        ×
                                                    </button>
                                                )}
                                            </div>

                                            <input
                                                type="text"
                                                value={definition.definition}
                                                onChange={(e) => handleDefinitionChange(meaningIndex, defIndex, 'definition', e.target.value)}
                                                placeholder="Enter definition"
                                                required
                                            />

                                            <input
                                                type="text"
                                                value={definition.example}
                                                onChange={(e) => handleDefinitionChange(meaningIndex, defIndex, 'example', e.target.value)}
                                                placeholder="Enter example (optional)"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <button
                            type="button"
                            className="add-meaning-btn"
                            onClick={addMeaning}
                        >
                            + Add Meaning
                        </button>
                    </div>

                    {/* Form Actions */}
                    <div className="form-actions">
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="save-btn">
                            Save Word
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PersonalWordForm;