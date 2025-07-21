export interface Definition {
    meaning: string;
    example?: string;
}

export interface WordData {
    word: string;
    phonetic?: string;
    audio?: string;
    definitions: Definition[];
}
