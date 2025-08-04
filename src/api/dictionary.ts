import axios from 'axios';
import { WordData } from '../types/word';

export const getWordData = async (term: string): Promise<WordData> => {
    const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${term}`,
        { withCredentials: false } //override the global setting
    );
    const entry = response.data[0];

    const formatted: WordData = {
        id: Date.now(),
        word: entry.word,
        phonetic: entry.phonetic,
        meanings: entry.meanings,
        audio: entry.phonetics?.[0]?.audio || ''
    };

    return formatted;
};
