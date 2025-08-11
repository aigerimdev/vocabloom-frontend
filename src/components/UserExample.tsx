import { useEffect, useState } from "react";
import { createUserExample, deleteUserExample, generateWordExamples } from "../endpoints/api";
import { WordData, UserExample as UserExampleType } from "../types/word";
import AudioButton from '../components/AudioButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faPlus, faTrashCan, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from "./ConfirmationModal";
import "../styles/UserExample.css";

type Props = {
    word: WordData;
    initialExamples?: UserExampleType[];
    onExamplesUpdate?: (examples: UserExampleType[]) => void;
};

export default function UserExample({ word, initialExamples = [], onExamplesUpdate }: Props) {
    const [mode, setMode] = useState<"empty" | "view" | "create">("empty");
    const [examples, setExamples] = useState<UserExampleType[]>(initialExamples);
    const [draft, setDraft] = useState("");
    const [saving, setSaving] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [exampleToDelete, setExampleToDelete] = useState<UserExampleType | null>(null);

    const [aiDifficulty, setAIDifficulty] = useState<"beginner" | "intermediate" | "advanced">("intermediate");
    const [aiContext, setAIContext] = useState<string>("");

    useEffect(() => {
        setExamples(initialExamples);
        setMode(initialExamples.length > 0 ? "view" : "empty");
    }, [initialExamples]);

    useEffect(() => {
        onExamplesUpdate?.(examples);
    }, [examples, onExamplesUpdate]);


    useEffect(() => {
        if (loading) {
            setLoading(false);
        }
    }, [loading]);


    const handleSave = async () => {
        if (!draft.trim()) return;

        try {
            setSaving(true);
            setErr(null);

            const newExample = await createUserExample(word.id, draft.trim());
            if (newExample) {
                const updatedExamples = [...examples, newExample];
                setExamples(updatedExamples);
                setDraft("");
                setMode("view");
                onExamplesUpdate?.(updatedExamples);
            }
        } catch (error) {
            console.error('Error saving example:', error);
            setErr("Couldn't save example. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteClick = (example: UserExampleType) => {
        setExampleToDelete(example);
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = async () => {
        if (!exampleToDelete) return;

        try {
            const success = await deleteUserExample(word.id, exampleToDelete.id);
            if (success) {
                const updatedExamples = examples.filter(ex => ex.id !== exampleToDelete.id);
                setExamples(updatedExamples);
                if (updatedExamples.length === 0) {
                    setMode("empty");
                }
                onExamplesUpdate?.(updatedExamples);
            }
        } catch (error) {
            console.error('Error deleting example:', error);
            setErr("Failed to delete example");
        } finally {
            setShowDeleteConfirm(false);
            setExampleToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirm(false);
        setExampleToDelete(null);
    };

    const handleGenerateExample = async () => {
        try {
            setGenerating(true);
            setErr(null);

            const example = await generateWordExamples(word.id, {
                difficulty: aiDifficulty,
                context: aiContext.trim() || undefined
            });

            if (example) {
                setDraft(example);
            } else {
                setErr("Failed to generate example. Please try again.");
            }
        } catch (error) {
            console.error('Error generating example:', error);
            setErr("Failed to generate example. Please try again.");
        } finally {
            setGenerating(false);
        }
    };

    const cancel = () => {
        setDraft("");
        setMode(examples.length > 0 ? "view" : "empty");
        setErr(null);
        setAIContext("");
        setAIDifficulty("intermediate");
    };

    if (loading) {
        return (
            <div className="example-block">
                <p>Loading examples...</p>
            </div>
        );
    }

    if (mode === "empty") {
        return (
            <div className="example-block">
                <button
                    className="button-add-example"
                    onClick={() => setMode("create")}
                >
                    <FontAwesomeIcon icon={faPlus} />
                    Create an example
                </button>
            </div>
        );
    }

    if (mode === "view") {
        return (
            <div className="example-block">
                <div className="example-header">
                    <span className="example-title">Your Examples</span>
                    <button
                        className="example-link"
                        onClick={() => setMode("create")}
                    >
                        <FontAwesomeIcon icon={faPlus} size="sm" /> Add
                    </button>
                </div>
                <ul className="examples-list">
                    {examples.map((example) => (
                        <li key={example.id} className="example-item">
                            <div className="example-item-audio-text">
                                <AudioButton
                                    text={example.example_text ?? ""}
                                    className="ml-2 text-blue-500"
                                    size={16}
                                />
                                <p className="example-text">{example.example_text}</p>
                            </div>
                            <button
                                className="example-delete"
                                onClick={() => handleDeleteClick(example)}
                                title="Delete example"
                            >
                                <FontAwesomeIcon icon={faTrashCan} size="sm" />
                            </button>
                        </li>
                    ))}
                </ul>
                <ConfirmationModal
                    isOpen={showDeleteConfirm}
                    title="Delete Example"
                    message={`Are you sure you want to delete this example: "${exampleToDelete?.example_text}"? This action cannot be undone.`}
                    confirmText="Delete"
                    cancelText="Cancel"
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                    type="danger"
                />
            </div>
        );
    }

    return (
        <div className="example-block">
            <div className="example-header">
                <label className="example-title" htmlFor="example-textArea">
                    <FontAwesomeIcon icon={faPenToSquare} /> Add your example
                </label>
            </div>

            <div className="ai-options-simple">
                <div className="ai-option-inline">
                    <label htmlFor="ai-difficulty">Difficulty:</label>
                    <select
                        id="ai-difficulty"
                        value={aiDifficulty}
                        onChange={(e) => setAIDifficulty(e.target.value as "beginner" | "intermediate" | "advanced")}
                        className="ai-difficulty-select-inline"
                    >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </select>
                </div>

                <div className="ai-option-inline">
                    <label htmlFor="ai-context">Context:</label>
                    <input
                        id="ai-context"
                        type="text"
                        value={aiContext}
                        onChange={(e) => setAIContext(e.target.value)}
                        placeholder="e.g., business, academic..."
                        className="ai-context-input-inline"
                        maxLength={50}
                    />
                </div>
                <button
                    className="generate-button"
                    onClick={handleGenerateExample}
                    disabled={generating}
                    title="Generate example with AI"
                >
                    <FontAwesomeIcon icon={faWandMagicSparkles} />
                    {generating ? "Generating..." : "AI Generate"}
                </button>
            </div>

            <textarea
                id="example-textArea"
                rows={3}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={`Type an example sentence using "${word.word}"...`}
            />
            <div className="example-actions">
                <button
                    className="example-secondary"
                    onClick={cancel}
                    disabled={saving}
                >
                    Cancel
                </button>
                <button
                    className="example-primary"
                    onClick={handleSave}
                    disabled={saving || !draft.trim()}
                >
                    {saving ? "Saving…" : "Save Example"}
                </button>
            </div>
            {err && <p className="example-error">{err}</p>}
        </div>
    );
}