import '@testing-library/jest-dom';
import axios from 'axios';
import * as api from '../api';
import { UserExample } from '../../types/word';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const ok = <T>(data: T) => Promise.resolve({ data } as any);
// const err = (status: number, data: any = {}) =>
//     Promise.reject({ response: { status, data } } as any);

beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
});

const ex = (over: Partial<UserExample> = {}): UserExample => ({
    id: 10,
    example_text: 'sample',
    created_at: '2025-01-01T00:00:00Z',
    word: 1 as any,
    ...over,
});

describe('USER EXAMPLES API', () => {
    describe('getUserExamples', () => {
        it('returns list on success', async () => {
            mockedAxios.get.mockResolvedValueOnce({ data: [ex()] } as any);
            await expect(api.getUserExamples(7)).resolves.toEqual([ex()]);
        });

        it('401 → refresh → retry returns list', async () => {
            localStorage.setItem('refresh_token', 'r1');
            mockedAxios.get.mockRejectedValueOnce({ response: { status: 401 } } as any);
            mockedAxios.post.mockResolvedValueOnce({ data: { access: 'a2' } } as any);
            mockedAxios.get.mockResolvedValueOnce({ data: [ex({ id: 11 })] } as any);
            await expect(api.getUserExamples(7)).resolves.toEqual([ex({ id: 11 })]);
        });

        it('401 and refresh fails → returns null', async () => {
            mockedAxios.get.mockRejectedValueOnce({ response: { status: 401 } } as any);
            await expect(api.getUserExamples(7)).resolves.toBeNull();
        });
    });

    describe('createUserExample', () => {
        it('posts payload and returns created example', async () => {
            mockedAxios.post.mockImplementationOnce(async (_url: string, body: any) => {
                expect(body).toEqual({ example_text: 'hello' });
                return ok(ex({ id: 101, example_text: 'hello' }));
            });
            await expect(api.createUserExample(7, 'hello'))
                .resolves.toEqual(ex({ id: 101, example_text: 'hello' }));
        });

        it('401 → refresh → retry returns created example', async () => {
            localStorage.setItem('refresh_token', 'r1');
            mockedAxios.post
                .mockRejectedValueOnce({ response: { status: 401 } } as any)
                .mockResolvedValueOnce({ data: { access: 'a2' } } as any)
                .mockResolvedValueOnce({ data: ex({ id: 102 }) } as any);
            await expect(api.createUserExample(7, 'x')).resolves.toEqual(ex({ id: 102 }));
        });

        it('401 and refresh fails → returns null', async () => {
            mockedAxios.post.mockRejectedValueOnce({ response: { status: 401 } } as any);
            await expect(api.createUserExample(7, 'x')).resolves.toBeNull();
        });
    });

    describe('getUserExample', () => {
        it('returns single example', async () => {
            mockedAxios.get.mockResolvedValueOnce({ data: ex({ id: 12 }) } as any);
            await expect(api.getUserExample(7, 12)).resolves.toEqual(ex({ id: 12 }));
        });

        it('401 → refresh → retry returns single example', async () => {
            localStorage.setItem('refresh_token', 'r1');
            mockedAxios.get.mockRejectedValueOnce({ response: { status: 401 } } as any);
            mockedAxios.post.mockResolvedValueOnce({ data: { access: 'a2' } } as any);
            mockedAxios.get.mockResolvedValueOnce({ data: ex({ id: 13 }) } as any);
            await expect(api.getUserExample(7, 13)).resolves.toEqual(ex({ id: 13 }));
        });

        it('401 and refresh fails → returns null', async () => {
            mockedAxios.get.mockRejectedValueOnce({ response: { status: 401 } } as any);
            await expect(api.getUserExample(7, 13)).resolves.toBeNull();
        });
    });

    describe('updateUserExample', () => {
        it('patches and returns updated example', async () => {
            mockedAxios.patch.mockImplementationOnce(async (_url: string, body: any) => {
                expect(body).toEqual({ example_text: 'updated' });
                return ok(ex({ id: 14, example_text: 'updated' }));
            });
            await expect(api.updateUserExample(7, 14, 'updated'))
                .resolves.toEqual(ex({ id: 14, example_text: 'updated' }));
        });

        it('401 → refresh → retry returns updated example', async () => {
            localStorage.setItem('refresh_token', 'r1');
            mockedAxios.patch
                .mockRejectedValueOnce({ response: { status: 401 } } as any);
            mockedAxios.post
                .mockResolvedValueOnce({ data: { access: 'a2' } } as any);
            mockedAxios.patch
                .mockResolvedValueOnce({ data: ex({ id: 15, example_text: 'ok' }) } as any);
            await expect(api.updateUserExample(7, 15, 'ok'))
                .resolves.toEqual(ex({ id: 15, example_text: 'ok' }));
        });

        it('401 and refresh fails → returns null', async () => {
            mockedAxios.patch.mockRejectedValueOnce({ response: { status: 401 } } as any);
            await expect(api.updateUserExample(7, 15, 'ok'))
                .resolves.toBeNull();

        });
    });

    describe('deleteUserExample', () => {
        it('returns true on success', async () => {
            mockedAxios.delete.mockResolvedValueOnce({} as any);
            await expect(api.deleteUserExample(7, 22)).resolves.toBe(true);
        });

        it('401 → refresh → retry returns true', async () => {
            localStorage.setItem('refresh_token', 'r1');
            mockedAxios.delete
                .mockRejectedValueOnce({ response: { status: 401 } } as any);
            mockedAxios.post
                .mockResolvedValueOnce({ data: { access: 'a2' } } as any);
            mockedAxios.delete
                .mockResolvedValueOnce({} as any);
            await expect(api.deleteUserExample(7, 22)).resolves.toBe(true);
        });

        it('401 and refresh fails → returns false', async () => {
            mockedAxios.delete.mockRejectedValueOnce({ response: { status: 401 } } as any);
            await expect(api.deleteUserExample(7, 22)).resolves.toBe(false);
        });
    });
});

describe('GEMINI generateWordExamples', () => {
    it('success returns example string and posts default payload', async () => {
        mockedAxios.post.mockImplementationOnce(async (_url: string, body: any) => {
            expect(body).toEqual({ context: undefined, difficulty_level: 'intermediate' });
            return ok({ success: true, example: 'A generated sentence.' });
        });
        await expect(api.generateWordExamples(7)).resolves.toBe('A generated sentence.');
    });

    it('sends provided difficulty and context', async () => {
        mockedAxios.post.mockImplementationOnce(async (_url: string, body: any) => {
            expect(body).toEqual({ context: 'business', difficulty_level: 'advanced' });
            return ok({ success: true, example: 'Biz example.' });
        });
        await expect(
            api.generateWordExamples(7, { difficulty: 'advanced', context: 'business' })
        ).resolves.toBe('Biz example.');
    });

    it('401 → refresh → retry returns example', async () => {
        localStorage.setItem('refresh_token', 'r1');
        mockedAxios.post
            .mockRejectedValueOnce({ response: { status: 401 } } as any)
            .mockResolvedValueOnce({ data: { access: 'a2' } } as any)
            .mockResolvedValueOnce({ data: { success: true, example: 'ok' } } as any);

        await expect(api.generateWordExamples(7, { difficulty: 'beginner' }))
            .resolves.toBe('ok');

    });

    it('non-401 error returns null (logs once)', async () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => { });
        mockedAxios.post.mockRejectedValueOnce(
            { response: { status: 500, data: { detail: 'oops' } } } as any
        );
        await expect(api.generateWordExamples(7)).resolves.toBeNull();
        spy.mockRestore();
    });

    it('invalid success shape returns null', async () => {
        mockedAxios.post.mockResolvedValueOnce({ data: { success: true } } as any);
        await expect(api.generateWordExamples(7)).resolves.toBeNull();
    });
});

describe('delete_tag', () => {
    it('returns true on success', async () => {
        mockedAxios.delete.mockResolvedValueOnce({} as any);
        await expect(api.delete_tag(3)).resolves.toBe(true);
    });

    it('401 → refresh → retry returns true', async () => {
        localStorage.setItem('refresh_token', 'r1');
        mockedAxios.delete
            .mockRejectedValueOnce({ response: { status: 401 } } as any);
        mockedAxios.post
            .mockResolvedValueOnce({ data: { access: 'a2' } } as any);
        mockedAxios.delete
            .mockResolvedValueOnce({} as any);
        await expect(api.delete_tag(3)).resolves.toBe(true);
    });

    it('401 and refresh fails → returns false', async () => {
        mockedAxios.delete.mockRejectedValueOnce({ response: { status: 401 } } as any);
        await expect(api.delete_tag(3)).resolves.toBe(false);
    });
});