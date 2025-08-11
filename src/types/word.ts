export interface Definition {
    definition: string;
    example?: string;
}

export interface Meaning {
    partOfSpeech: string;
    definitions: Definition[];
}

export interface WordData {
    id: number;
    word: string;
    phonetic?: string;
    audio?: string;
    meanings: Meaning[];
    tag?: number | null;
    note?: string | null;
    user_examples?: UserExample[];
}

export interface UserExample {
    id: number;
    example_text: string;
    created_at: string;
    word: number;
}

export interface CreateUserExamplePayload {
    example_text: string;
}

export interface GenerateExampleOptions {
    context?: string;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export interface GenerateExampleResponse {
    success: boolean;
    example: string;
    word: string;
    error?: string;
}
