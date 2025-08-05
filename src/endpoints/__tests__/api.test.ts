import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { save_word } from '../api';
import { WordData } from '../../types/word';

const mock = new MockAdapter(axios);

describe('save_word', () => {
    afterEach(() => {
        mock.reset();
        localStorage.clear();
    });

    test('should post a word and return saved WordData', async () => {
        const fakeWord: WordData = {
            id: 1,
            word: 'example',
            phonetic: '/ˈɛɡzæmpəl/',
            audio: 'https://api/audio.mp3',
            meanings: [
                {
                    partOfSpeech: 'noun',
                    definitions: [
                        { definition: 'A thing characteristic of its kind.' },
                    ],
                },
            ],
        };

        const formattedWord = {
            ...fakeWord,
            word: 'Example',
            meanings: [
                {
                    part_of_speech: 'Noun',
                    definitions: fakeWord.meanings[0].definitions,
                },
            ],
        };

        mock.onPost('https://vocabloom-backend.onrender.com/api/words/', formattedWord).reply(200, {
            ...formattedWord,
            id: 123,
        });

        localStorage.setItem('access_token', 'mock-token');

        const result = await save_word(fakeWord);
        expect(result).not.toBeNull();
        expect(result?.id).toBe(123);
        expect(result?.word).toBe('Example');
    });
});