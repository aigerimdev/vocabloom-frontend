import { useEffect, useState } from "react";
import { updateWordNote } from "../endpoints/api";
import { WordData } from "../types/word"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faPencil } from '@fortawesome/free-solid-svg-icons'
import "../styles/WordNote.css";


type Props = {
    word: WordData;
    onUpdated: (w: WordData) => void;
};

export default function WordNote({ word, onUpdated }: Props) {
    const [mode, setMode] = useState<"empty" | "view" | "edit">("empty");
    const [draft, setDraft] = useState(word.note ?? "");
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    useEffect(() => {
        setDraft(word.note ?? "");
        setMode((word.note ?? "").trim() ? "view" : "empty");
    }, [word.id, word.note]);

    async function save() {
        try {
            setSaving(true);
            setErr(null);

            const optimistic = { ...word, note: draft.trim() };
            onUpdated(optimistic);

            const updated = await updateWordNote(word.id, draft.trim());
            onUpdated(updated);
            setMode(updated.note?.trim() ? "view" : "empty");
        } catch {
            setErr("Couldn’t save. Please try again.");
        } finally {
            setSaving(false);
        }
    }

    function cancel() {
        setDraft(word.note ?? "");
        setMode((word.note ?? "").trim() ? "view" : "empty");
    }

    if (mode === "empty") return (
        <div className="note-block">
            <button className="button-write-note" onClick={() => setMode("edit")}><FontAwesomeIcon icon={faPenToSquare} />Write a note</button>
        </div>
    );

    if (mode === "view") return (
        <div className="note-block">
            <div className="note-header">
                <span className="note-title">Your note</span>
                <button className="note-link" onClick={() => setMode("edit")}><FontAwesomeIcon icon={faPencil} size="sm" /> Edit</button>
            </div>
            <p className="note-view">{word.note}</p>
        </div>
    );

    return (
        <div className="note-block">
            <label className="note-title" htmlFor="note-ta"><FontAwesomeIcon icon={faPenToSquare} /> Write your note</label>
            <textarea
                id="note-ta"
                rows={3}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Type your note…"
            />
            <div className="note-actions">
                <button className="note-secondary" onClick={cancel} disabled={saving}>
                    Cancel
                </button>
                <button className="note-primary" onClick={save} disabled={saving}>
                    {saving ? "Saving…" : "Save"}
                </button>
            </div>
            {err && <p className="note-error">{err}</p>}
        </div>
    );
}