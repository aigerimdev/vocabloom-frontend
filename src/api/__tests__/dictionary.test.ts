import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { getWordData } from '../dictionary';
import { WordData } from '../../types/word';

const mock = new MockAdapter(axios);

describe('getWordData', () => {
    afterEach(() => {
        mock.reset();
    });

    test('fetches and formats word data correctly', async () => {
        const sampleResponse = [
            {
                word: 'test',
                phonetic: '/test/',
                meanings: [
                    {
                        partOfSpeech: 'noun',
                        definitions: [
                            {
                                definition: 'A procedure intended to establish the quality, performance, or reliability of something.',
                            },
                        ],
                    },
                ],
                phonetics: [
                    {
                        audio: 'https://api.audio/test.mp3',
                    },
                ],
            },
        ];

        mock.onGet('https://api.dictionaryapi.dev/api/v2/entries/en/test').reply(200, sampleResponse);

        const result: WordData = await getWordData('test');

        expect(result.word).toBe('test');
        expect(result.phonetic).toBe('/test/');
        expect(result.meanings.length).toBe(1);
        expect(result.audio).toBe('https://api.audio/test.mp3');
        expect(typeof result.id).toBe('number');
    });
});