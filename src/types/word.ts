export interface Definition {
    definition: string;
    example?: string;
}

export interface Meaning {
    partOfSpeech: string;
    definitions: Definition[];
}

export interface WordData {
    word: string;
    phonetic?: string;
    audio?: string;
    meanings: Meaning[];
    tag?: string;
}
