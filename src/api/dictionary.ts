// import axios from 'axios';
// import { WordData } from '../types/word';

// export async function getWordData(word: string): Promise<WordData> {
//     const res = await axios.get(
//         `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
//     );

//     const entry = res.data[0];

//     const formatted: WordData = {
//         word: entry.word,
//         phonetic: entry.phonetic,
//         audio: entry.phonetics?.[0]?.audio || '',
//         definitions: entry.meanings[0].definitions.map((d: any) => ({
//             meaning: d.definition,
//             example: d.example,
//         })),
//     };

//     return formatted;
// }
import axios from 'axios';
import { WordData } from '../types/word';

export const getWordData = async (term: string): Promise<WordData> => {
    const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${term}`);
    const entry = response.data[0];

    const formatted: WordData = {
        word: entry.word,
        phonetic: entry.phonetic,
        meanings: entry.meanings,
        audio: entry.phonetics?.[0]?.audio || ''
    };

    return formatted;
};
