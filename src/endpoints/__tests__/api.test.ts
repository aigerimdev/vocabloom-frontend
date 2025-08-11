import '@testing-library/jest-dom';
import axios from 'axios';
import * as api from '../api';
import { WordData } from '../../types/word';


jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Helpers
const ok = <T>(data: T) => Promise.resolve({ data } as any);
// const err = (status: number, data: any = {}) =>
//     Promise.reject({ response: { status, data } } as any);

beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
});

describe('getAuthConfig', () => {
    test('adds Authorization when token exists', () => {
        localStorage.setItem('access_token', 'abc');
        const cfg = api.getAuthConfig();
        expect(cfg.headers?.Authorization).toBe('Bearer abc');
        expect(cfg.headers?.['Content-Type']).toBe('application/json');
    });

    test('no Authorization when no token', () => {
        const cfg = api.getAuthConfig();
        expect(cfg.headers?.Authorization).toBeUndefined();
    });
});

describe('refresh_token', () => {
    test('returns true and stores tokens on success', async () => {
        localStorage.setItem('refresh_token', 'r1');
        mockedAxios.post.mockResolvedValueOnce({ data: { access: 'a2', refresh: 'r2' } } as any);
        await expect(api.refresh_token()).resolves.toBe(true);
        expect(localStorage.getItem('access_token')).toBe('a2');
        expect(localStorage.getItem('refresh_token')).toBe('r2');
    });

    test('returns false and clears tokens on failure', async () => {
        localStorage.setItem('refresh_token', 'r1');
        localStorage.setItem('access_token', 'a1');
        mockedAxios.post.mockRejectedValueOnce(new Error('boom'));
        await expect(api.refresh_token()).resolves.toBe(false);
        expect(localStorage.getItem('access_token')).toBeNull();
        expect(localStorage.getItem('refresh_token')).toBeNull();
    });

    test('returns false if no refresh token present', async () => {
        await expect(api.refresh_token()).resolves.toBe(false);
    });
});

describe('call_refresh', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    it('retries once after 401 and returns data', async () => {
        localStorage.setItem('refresh_token', 'r1');
        mockedAxios.post.mockResolvedValueOnce({ data: { access: 'a2' } } as any);

        const error401 = { response: { status: 401 } } as any;
        const fn = jest.fn().mockResolvedValue({ data: 123 });

        await expect(api.call_refresh<number>(error401, fn)).resolves.toBe(123);

        expect(fn).toHaveBeenCalledTimes(1);
        expect(localStorage.getItem('access_token')).toBe('a2');
    });

    it('returns false if refresh_token fails', async () => {
        const error401 = { response: { status: 401 } } as any;
        const fn = jest.fn();

        await expect(api.call_refresh<number>(error401, fn)).resolves.toBe(false);
        expect(fn).not.toHaveBeenCalled();
    });

    it('returns false for non-401 errors', async () => {
        const error400 = { response: { status: 400 } } as any;
        const fn = jest.fn();

        await expect(api.call_refresh<number>(error400, fn)).resolves.toBe(false);
        expect(fn).not.toHaveBeenCalled();
    });
});

describe('login / register / auth / logout', () => {
    test('login stores tokens on success', async () => {
        mockedAxios.post.mockResolvedValueOnce({ data: { access: 'a', refresh: 'r' } } as any);
        await expect(api.login('u', 'p')).resolves.toBe(true);
        expect(localStorage.getItem('access_token')).toBe('a');
        expect(localStorage.getItem('refresh_token')).toBe('r');
    });

    test('login returns false when tokens missing', async () => {
        mockedAxios.post.mockResolvedValueOnce({ data: {} } as any);
        await expect(api.login('u', 'p')).resolves.toBe(false);
    });

    test('register returns data', async () => {
        mockedAxios.post.mockResolvedValueOnce({ data: { id: 1 } } as any);
        await expect(api.register('u', 'e', 'p', 'f', 'l')).resolves.toEqual({ id: 1 });
    });

    test('is_authenticated true when 200', async () => {
        mockedAxios.post.mockResolvedValueOnce({} as any);
        await expect(api.is_authenticated()).resolves.toBe(true);
    });

    test('is_authenticated tries refresh on 401 then true', async () => {
        mockedAxios.post
            .mockRejectedValueOnce({ response: { status: 401 } }) // AUTH_URL
            .mockResolvedValueOnce({ data: { access: 'a2' } } as any) // REFRESH_URL
            .mockResolvedValueOnce({} as any); // AUTH_URL retry
        localStorage.setItem('refresh_token', 'r1');
        await expect(api.is_authenticated()).resolves.toBe(true);
    });

    test('logout clears tokens regardless of server', async () => {
        localStorage.setItem('access_token', 'a');
        localStorage.setItem('refresh_token', 'r');
        mockedAxios.post.mockRejectedValueOnce(new Error('server down')); // LOGOUT_URL
        await expect(api.logout()).resolves.toBe(true);
        expect(localStorage.getItem('access_token')).toBeNull();
        expect(localStorage.getItem('refresh_token')).toBeNull();
    });
});

describe('words & tags fetching', () => {
    test('get_words success', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: [1, 2, 3] } as any);
        await expect(api.get_words()).resolves.toEqual([1, 2, 3]);
    });

    test('get_words retries after 401 via call_refresh', async () => {
        localStorage.clear();
        localStorage.setItem('refresh_token', 'r1');

        // 1st GET -> 401
        mockedAxios.get.mockRejectedValueOnce({ response: { status: 401 } } as any);

        // refresh POST -> returns new access
        mockedAxios.post.mockResolvedValueOnce({ data: { access: 'a2' } } as any);

        // retried GET -> 200
        mockedAxios.get.mockResolvedValueOnce({ data: ['ok'] } as any);

        await expect(api.get_words()).resolves.toEqual(['ok']);
    });


    test('get_saved_words returns [] on permanent failure', async () => {
        mockedAxios.get
            .mockRejectedValueOnce({ response: { status: 401 } })
            .mockRejectedValueOnce(new Error('still bad'));
        await expect(api.get_saved_words()).resolves.toEqual([]);
    });

    test('get_tags success', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: [{ id: 1, name: 'Nouns' }] } as any);
        await expect(api.get_tags()).resolves.toEqual([{ id: 1, name: 'Nouns' }]);
    });

    test('get_words_by_tag success', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: [{ id: 5 }] } as any);
        await expect(api.get_words_by_tag(9)).resolves.toEqual([{ id: 5 }]);
    });

    test('get_tag_by_id success', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: { id: 7, name: 'Birds' } } as any);
        await expect(api.get_tag_by_id(7)).resolves.toEqual({ id: 7, name: 'Birds' });
    });
});

describe('save_word', () => {
    const base: WordData = {
        id: 0,
        word: 'bamboo',
        phonetic: '',
        audio: '',
        meanings: [{ partOfSpeech: 'noun', definitions: [{ definition: 'x' }] }],
        tag: null,
    };

    test('transforms payload and returns server data', async () => {
        mockedAxios.post.mockImplementationOnce(
            async (_url: string, body: any, _cfg?: any) => {
                expect(body.word).toBe('Bamboo');
                expect(body.meanings[0]).toMatchObject({
                    part_of_speech: 'Noun',
                    definitions: [{ definition: 'x' }],
                });
                return ok({ ...body, id: 123 });
            }
        );


        const result = await api.save_word(base);
        expect(result.id).toBe(123);
        expect(result.word).toBe('Bamboo');
    });

    test('throws WORD_DUPLICATE on 409', async () => {
        mockedAxios.post.mockRejectedValueOnce({ response: { status: 409, data: {} } } as any);

        await expect(api.save_word(base)).rejects.toThrow('WORD_DUPLICATE');
    });

    test('throws WORD_DUPLICATE on 400 with duplicate-ish text', async () => {
        mockedAxios.post.mockRejectedValueOnce({
            response: { status: 400, data: { detail: 'Already exists / unique constraint' } },
        } as any);

        await expect(api.save_word(base)).rejects.toThrow('WORD_DUPLICATE');
    });

    test('401 → refresh → retry succeeds', async () => {
        // Make refresh_token() succeed
        localStorage.setItem('refresh_token', 'r1');
        // 1st POST (save) -> 401
        mockedAxios.post.mockRejectedValueOnce({ response: { status: 401 } } as any);
        // Refresh POST -> returns new access
        mockedAxios.post.mockResolvedValueOnce({ data: { access: 'a2' } } as any);
        // Retried POST (save) -> 200 with server data
        mockedAxios.post.mockResolvedValueOnce({ data: { id: 9, word: 'Bamboo', meanings: [] } } as any);

        const out = await api.save_word(base);
        expect(out).toMatchObject({ id: 9, word: 'Bamboo' });
    });

    test('401 → refresh fails → propagates original error', async () => {
        mockedAxios.post.mockRejectedValueOnce({ response: { status: 401 } } as any);

        await expect(api.save_word(base)).rejects.toBeTruthy();
    });

});

describe('create_tag', () => {
    test('returns data', async () => {
        mockedAxios.post.mockResolvedValueOnce({ data: { id: 1, name: 'Animals' } } as any);
        await expect(api.create_tag('Animals')).resolves.toEqual({ id: 1, name: 'Animals' });
    });

    test('throws TAG_DUPLICATE on 409', async () => {
        mockedAxios.post.mockRejectedValueOnce({ response: { status: 409, data: {} } } as any);
        await expect(api.create_tag('Animals')).rejects.toThrow('TAG_DUPLICATE');
    });

    test('throws TAG_DUPLICATE on 400 with constraint text', async () => {
        mockedAxios.post.mockRejectedValueOnce({
            response: { status: 400, data: { name: ['Unique constraint violated'] } },
        } as any);
        await expect(api.create_tag('Animals')).rejects.toThrow('TAG_DUPLICATE');
    });

    test('401 → refresh → retry ok', async () => {
        // Make refresh_token() succeed for real
        localStorage.setItem('refresh_token', 'r1');

        // 1) First POST to TAGS_URL -> 401
        mockedAxios.post.mockRejectedValueOnce({ response: { status: 401 } } as any);

        // 2) Refresh POST to REFRESH_URL -> returns new access token
        mockedAxios.post.mockResolvedValueOnce({ data: { access: 'a2' } } as any);

        // 3) Retried POST to TAGS_URL -> success
        mockedAxios.post.mockResolvedValueOnce({ data: { id: 2, name: 'Plants' } } as any);

        await expect(api.create_tag('Plants')).resolves.toEqual({ id: 2, name: 'Plants' });
    });
});


describe('updateWordNote / delete_word', () => {
    test('updateWordNote success', async () => {
        mockedAxios.patch.mockResolvedValueOnce({ data: { id: 10, note: 'hi' } } as any);
        await expect(api.updateWordNote(10, 'hi')).resolves.toEqual({ id: 10, note: 'hi' });
    });

    test('updateWordNote 401 → refresh → retry → returns data', async () => {
        // Make refresh_token() succeed
        localStorage.setItem('refresh_token', 'r1');

        // 1) First PATCH -> 401
        mockedAxios.patch.mockRejectedValueOnce({ response: { status: 401 } } as any);
        // 2) Refresh POST -> returns new access
        mockedAxios.post.mockResolvedValueOnce({ data: { access: 'a2' } } as any);
        // 3) Retried PATCH -> success
        mockedAxios.patch.mockResolvedValueOnce({ data: { id: 10, note: 'ok' } } as any);

        await expect(api.updateWordNote(10, 'ok')).resolves.toEqual({ id: 10, note: 'ok' });
    });

    test('delete_word success', async () => {
        mockedAxios.delete.mockResolvedValueOnce({} as any);
        await expect(api.delete_word(5)).resolves.toBe(true);
    });

    test('delete_word 401 → refresh → retry ok', async () => {
        // Make refresh_token() succeed
        localStorage.setItem('refresh_token', 'r1');

        mockedAxios.delete.mockRejectedValueOnce({ response: { status: 401 } } as any);
        mockedAxios.post.mockResolvedValueOnce({ data: { access: 'a2' } } as any);
        mockedAxios.delete.mockResolvedValueOnce({} as any);

        await expect(api.delete_word(5)).resolves.toBe(true);
    });
});


describe('convertTextToSpeech & playAudio', () => {
    // Mock URL methods used by TTS & audio
    const origCreate = URL.createObjectURL;
    const origRevoke = URL.revokeObjectURL;

    beforeEach(() => {
        (URL.createObjectURL as any) = jest.fn(() => 'blob:audio-url');
        (URL.revokeObjectURL as any) = jest.fn();
    });

    afterEach(() => {
        URL.createObjectURL = origCreate;
        URL.revokeObjectURL = origRevoke;
    });

    test('convertTextToSpeech happy path returns blob URL', async () => {
        const base64 = btoa('abc');
        mockedAxios.post.mockResolvedValueOnce(
            ok({ success: true, audio_data: base64, content_type: 'audio/mpeg' })
        );

        const url = await api.convertTextToSpeech('hello');
        expect(url).toBe('blob:audio-url');
        expect(URL.createObjectURL).toHaveBeenCalled();
    });

    test('convertTextToSpeech 401 → refresh → retry returns url', async () => {
        localStorage.setItem('refresh_token', 'r1');

        const createSpy = jest.spyOn(URL, 'createObjectURL').mockReturnValue('blob:audio-url' as any);

        const base64 = btoa('xyz');

        // 1) first /audio/ call -> 401
        mockedAxios.post.mockRejectedValueOnce({ response: { status: 401 } } as any);
        // 2) /token/refresh/ -> returns access
        mockedAxios.post.mockResolvedValueOnce({ data: { access: 'a2' } } as any);
        // 3) retried /audio/ -> success payload
        mockedAxios.post.mockResolvedValueOnce({
            data: { success: true, audio_data: base64, content_type: 'audio/mpeg' },
        } as any);

        const url = await api.convertTextToSpeech('hello');

        expect(url).toBe('blob:audio-url');
        expect(createSpy).toHaveBeenCalled();

        createSpy.mockRestore();
    });

    test('convertTextToSpeech invalid response returns null', async () => {
        mockedAxios.post.mockResolvedValueOnce(ok({ success: false, error: 'bad' }));
        await expect(api.convertTextToSpeech('h')).resolves.toBeNull();
    });

    test('playAudio resolves on end and revokes URL', async () => {
        class FakeAudio {
            src?: string;
            onended: (() => void) | null = null;
            onerror: (() => void) | null = null;
            play = jest.fn().mockImplementation(() => {
                // simulate async then end
                setTimeout(() => this.onended && this.onended(), 0);
                return Promise.resolve();
            });
        }
        // @ts-ignore
        global.Audio = FakeAudio as any;

        await expect(api.playAudio('blob:audio')).resolves.toBeUndefined();
        // revoke called when ended
        await new Promise((r) => setTimeout(r, 1));
        expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:audio');
    });

    test('playAudio rejects on error and revokes URL', async () => {
        const revokeSpy = jest.spyOn(URL, 'revokeObjectURL').mockImplementation(() => { });
        class FakeAudioErr {
            onended: (() => void) | null = null;
            onerror: (() => void) | null = null;
            play = jest.fn().mockImplementation(() => {
                setTimeout(() => this.onerror && this.onerror(), 0);
                return Promise.resolve();
            });
        }
        // @ts-ignore
        global.Audio = FakeAudioErr as any;

        await expect(api.playAudio('blob:oops')).rejects.toThrow('Failed to play audio');
        await new Promise((r) => setTimeout(r, 1));
        expect(revokeSpy).toHaveBeenCalledWith('blob:oops');

        revokeSpy.mockRestore();
    });
});
