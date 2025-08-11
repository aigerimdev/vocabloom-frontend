import axios from 'axios';
import { getWordData } from '../dictionary';
import { WordData } from '../../types/word';


jest.mock('axios');

describe('getWordData', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('fetches and formats word data correctly', async () => {
        const sampleResponse = [
            {
                word: 'test',
                phonetic: '/test/',
                meanings: [
                    {
                        partOfSpeech: 'noun',
                        definitions: [{ definition: 'A procedure intended to establish the quality...' }],
                    },
                ],
                phonetics: [{ audio: 'https://api.audio/test.mp3' }],
            },
        ];

        (axios.get as jest.Mock).mockResolvedValueOnce({ data: sampleResponse });

        const result: WordData = await getWordData('test');

        expect(axios.get).toHaveBeenCalledWith(
            'https://api.dictionaryapi.dev/api/v2/entries/en/test',
            expect.any(Object)
        );
        expect(result.word).toBe('test');
        expect(result.phonetic).toBe('/test/');
        expect(result.meanings.length).toBe(1);
        expect(result.audio).toBe('https://api.audio/test.mp3');
        expect(typeof result.id).toBe('number');
    });
});