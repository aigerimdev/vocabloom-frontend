import { useState } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WordNote from "./WordNote";
import { WordData } from "../types/word";
import { updateWordNote } from "../endpoints/api";


jest.mock("../endpoints/api", () => ({
    updateWordNote: jest.fn(),
}));

const makeWord = (overrides: Partial<WordData> = {}): WordData => ({
    id: 1,
    word: "example",
    phonetic: "/ˈɛɡzæmpəl/",
    audio: "",
    meanings: [],
    tag: null,
    note: null,
    ...overrides,
});

function Harness({ initial }: { initial: WordData }) {
    const [w, setW] = useState<WordData>(initial);
    return <WordNote word={w} onUpdated={setW} />;
}

describe("WordNote", () => {
    test("empty → edit → save (optimistic + server update)", async () => {
        const user = userEvent.setup();

        (updateWordNote as jest.Mock).mockResolvedValueOnce(
            makeWord({ note: "My first note" })
        );

        render(<Harness initial={makeWord({ note: null })} />);

        await user.click(screen.getByRole("button", { name: /write a note/i }));
        const textarea = screen.getByRole("textbox", { name: /your note/i });
        await user.type(textarea, "My first note");

        await user.click(screen.getByRole("button", { name: /^save$/i }));

        await waitFor(() =>
            expect(updateWordNote).toHaveBeenCalledWith(1, "My first note")
        );

        expect(await screen.findByText(/your note/i)).toBeInTheDocument();
        expect(screen.getByText("My first note")).toBeInTheDocument();
    });

    test("view → edit → cancel returns to original note", async () => {
        const user = userEvent.setup();
        const onUpdated = jest.fn();

        render(
            <WordNote word={makeWord({ note: "Existing note" })} onUpdated={onUpdated} />
        );

        expect(screen.getByText(/existing note/i)).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: /edit/i }));
        const textarea = screen.getByRole("textbox", { name: /your note/i });
        await user.clear(textarea);
        await user.type(textarea, "Changed but cancel");

        await user.click(screen.getByRole("button", { name: /cancel/i }));

        expect(screen.getByText(/existing note/i)).toBeInTheDocument();
        expect(onUpdated).not.toHaveBeenCalled();
    });

    test("save error shows message and does not apply server update", async () => {
        const user = userEvent.setup();
        const onUpdated = jest.fn();

        (updateWordNote as jest.Mock).mockRejectedValueOnce(new Error("fail"));

        render(<WordNote word={makeWord({ note: null })} onUpdated={onUpdated} />);

        await user.click(screen.getByRole("button", { name: /write a note/i }));
        const textarea = screen.getByRole("textbox", { name: /your note/i });
        await user.type(textarea, "Oops");

        await user.click(screen.getByRole("button", { name: /^save$/i }));

        expect(onUpdated).toHaveBeenCalledWith(
            expect.objectContaining({ note: "Oops" })
        );

        expect(
            await screen.findByText(/couldn’t save\. please try again\./i)
        ).toBeInTheDocument();
    });
});