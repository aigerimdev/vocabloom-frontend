import axios, { AxiosRequestConfig } from "axios";
import { WordData, UserExample, CreateUserExamplePayload, GenerateExampleOptions, GenerateExampleResponse } from "../types/word";

const BASE_URL = "https://vocabloom-backend.onrender.com/api/";
// const BASE_URL = "http://127.0.0.1:8000/api/";

const LOGIN_URL = `${BASE_URL}token/`;
const REFRESH_URL = `${BASE_URL}token/refresh/`;
const WORDS_URL = `${BASE_URL}words/`;
const LOGOUT_URL = `${BASE_URL}logout/`;
const AUTH_URL = `${BASE_URL}authenticated/`;
const REGISTER_URL = `${BASE_URL}register_user/`;
const TAGS_URL = `${BASE_URL}tags/`;

const classifyDuplicate = (
  err: any,
  kind: "WORD" | "TAG"
): "WORD_DUPLICATE" | "TAG_DUPLICATE" | null => {
  const status = err?.response?.status;
  const data = err?.response?.data;

  const collect = (v: any): string[] => {
    if (v == null) return [];
    if (Array.isArray(v)) return v.flatMap(collect);
    if (typeof v === "object") return Object.values(v).flatMap(collect);
    return [String(v)];
  };
  const text = collect(data).join(" ").toLowerCase();

  if (status === 409) return kind === "TAG" ? "TAG_DUPLICATE" : "WORD_DUPLICATE";

  if (status === 400 && /(exist|already|duplicate|unique|integrity|constraint)/i.test(text)) {
    return kind === "TAG" ? "TAG_DUPLICATE" : "WORD_DUPLICATE";
  }

  return null;
};

export const getAuthConfig = (): AxiosRequestConfig => {
  const token = localStorage.getItem("access_token");
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return { headers };
};

export const refresh_token = async (): Promise<boolean> => {
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) return false;

  try {
    const { data } = await axios.post(
      REFRESH_URL,
      { refresh: refreshToken },
      { headers: { "Content-Type": "application/json" } }
    );
    if (data.access) {
      localStorage.setItem("access_token", data.access);
      if (data.refresh) localStorage.setItem("refresh_token", data.refresh);
      return true;
    }
  } catch {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }
  return false;
};

type ErrorWithResponse = { response?: { status?: number };[key: string]: any };

export const call_refresh = async <T>(
  error: ErrorWithResponse,
  func: () => Promise<{ data: T }>
): Promise<T | false> => {
  if (error.response?.status === 401) {
    const ok = await refresh_token();
    if (ok) {
      const retry = await func();
      return retry.data;
    }
  }
  return false;
};

export const login = async (username: string, password: string): Promise<boolean> => {
  const { data } = await axios.post(LOGIN_URL, { username, password });
  if (data.access && data.refresh) {
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);
    return true;
  }
  return false;
};

export const register = async (
  username: string,
  email: string,
  password: string,
  firstName: string,
  lastName: string
) => {
  const { data } = await axios.post(REGISTER_URL, {
    username,
    email,
    password,
    first_name: firstName,
    last_name: lastName,
  });
  return data;
};

export const is_authenticated = async (): Promise<boolean> => {
  try {
    await axios.post(AUTH_URL, {}, getAuthConfig());
    return true;
  } catch (error: any) {
    if (error.response?.status === 401) {
      const ok = await refresh_token();
      if (ok) {
        try {
          await axios.post(AUTH_URL, {}, getAuthConfig());
          return true;
        } catch {
          return false;
        }
      }
    }
    return false;
  }
};

// export const logout = async (): Promise<boolean> => {
//   try {
//     await axios.post(LOGOUT_URL, {}, getAuthConfig());
//   } finally {
//     localStorage.removeItem("access_token");
//     localStorage.removeItem("refresh_token");
//   }
//   return true;
// };
export const logout = async (): Promise<boolean> => {
  try {
    await axios.post(LOGOUT_URL, {}, getAuthConfig());
  } catch {
    // Swallow the error so logout still resolves
  } finally {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }
  return true;
};


export const get_words = async (): Promise<any[] | false> => {
  try {
    const { data } = await axios.get(WORDS_URL, getAuthConfig());
    return data;
  } catch (error: any) {
    return await call_refresh(error, () => axios.get(WORDS_URL, getAuthConfig()));
  }
};

export async function get_saved_words(): Promise<WordData[]> {
  try {
    const { data } = await axios.get<WordData[]>(WORDS_URL, getAuthConfig());
    return data;
  } catch (error: any) {
    const result = await call_refresh(error, () =>
      axios.get<WordData[]>(WORDS_URL, getAuthConfig())
    );
    return result === false ? [] : (result as WordData[]);
  }
}

export async function save_word(word: WordData): Promise<WordData> {
  const payload = {
    ...word,
    word: capitalizeFirstLetter(word.word),
    meanings: word.meanings.map((m) => ({
      part_of_speech: capitalizeFirstLetter(m.partOfSpeech),
      definitions: m.definitions,
    })),
  };

  try {
    const { data } = await axios.post(WORDS_URL, payload, getAuthConfig());
    return data;
  } catch (error: any) {
    const dup = classifyDuplicate(error, "WORD");
    if (dup) throw new Error(dup);
    const result = await call_refresh(error, () =>
      axios.post(WORDS_URL, payload, getAuthConfig())
    );
    if (result === false) throw error;
    return result as WordData;
  }
}

// export const create_tag = async (name: string) => {
//   try {
//     const { data } = await axios.post(TAGS_URL, { name }, getAuthConfig());
//     return data;
//   } catch (error: any) {
//     const dup = classifyDuplicate(error, "TAG");
//     if (dup) throw new Error(dup);
//     const result = await call_refresh(error, () =>
//       axios.post(TAGS_URL, { name }, getAuthConfig())
//     );
//     if (result === false) throw error;
//     return result;
//   }
// };

export async function updateWordNote(id: number, note: string | null) {
  try {
    const { data } = await axios.patch(
      `${WORDS_URL}${id}/`,
      { note },
      getAuthConfig()
    );
    return data;
  } catch (error: any) {
    const result = await call_refresh(error, () =>
      axios.patch(`${WORDS_URL}${id}/`, { note }, getAuthConfig())
    );
    return result === false ? null : result;
  }
}

// export const delete_word = async (id: number) => {
//   try {
//     await axios.delete(`${WORDS_URL}${id}/`, getAuthConfig());
//     return true;
//   } catch (error: any) {
//     return await call_refresh(error, () =>
//       axios.delete(`${WORDS_URL}${id}/`, getAuthConfig())
//     );
//   }
// };
export const delete_word = async (id: number): Promise<boolean> => {
  try {
    await axios.delete(`${WORDS_URL}${id}/`, getAuthConfig());
    return true;
  } catch (error: any) {
    const res = await call_refresh(error, () =>
      axios.delete(`${WORDS_URL}${id}/`, getAuthConfig())
    );
    return res !== false;
  }
};

///////////////////////////////////////////////////////////
////////////////////// TAGS VIEWS /////////////////////////
///////////////////////////////////////////////////////////

// export const create_tag = async (name: string) => {
//   try {
//     const { data } = await axios.post(TAGS_URL, { name }, getAuthConfig());
//     return data;
//   } catch (error: any) {
//     const result = await call_refresh(error, () =>
//       axios.post(TAGS_URL, { name }, getAuthConfig())
//     );
//     return result === false ? null : result;
//   }
// };
export const create_tag = async (name: string) => {
  try {
    const { data } = await axios.post(TAGS_URL, { name }, getAuthConfig());
    return data;
  } catch (error: any) {

    const dup = classifyDuplicate(error, "TAG");
    if (dup) throw new Error(dup);

    const result = await call_refresh(error, () =>
      axios.post(TAGS_URL, { name }, getAuthConfig())
    );

    if (result === false) throw error;
    return result;
  }
};



export const get_tags = async () => {
  try {
    const { data } = await axios.get(TAGS_URL, getAuthConfig());
    return data;
  } catch (error: any) {
    return await call_refresh(error, () => axios.get(TAGS_URL, getAuthConfig()));
  }
};

export const get_words_by_tag = async (tagId: number) => {
  try {
    const { data } = await axios.get(`${TAGS_URL}${tagId}/words/`, getAuthConfig());
    return data;
  } catch (error: any) {
    return await call_refresh(error, () =>
      axios.get(`${TAGS_URL}${tagId}/words/`, getAuthConfig())
    );
  }
};

export const get_tag_by_id = async (id: number) => {
  const { data } = await axios.get(`${TAGS_URL}${id}/`, getAuthConfig());
  return data;
};

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const delete_tag = async (id: number): Promise<boolean> => {
  try {
    await axios.delete(`${TAGS_URL}${id}/`, getAuthConfig());
    return true;
  } catch (error: any) {
    const result = await call_refresh(error, () =>
      axios.delete(`${TAGS_URL}${id}/`, getAuthConfig())
    );
    return result === false ? false : true;
  }
};

/* ===== AUDIO ===== */

interface TextToSpeechResponse {
  success: boolean;
  audio_data: string;
  content_type: string;
  error?: string;
}

export const convertTextToSpeech = async (
  text: string,
  voiceId: string = "Joanna"
): Promise<string | null> => {
  try {
    const response = await axios.post<TextToSpeechResponse>(
      `${BASE_URL}audio/`,
      { text, voiceId },
      getAuthConfig()
    );

    const data = response.data;

    if (data.success && data.audio_data) {
      const audioBlob = base64ToBlob(data.audio_data, data.content_type);
      return URL.createObjectURL(audioBlob);
    }

    throw new Error("Invalid response from server");
  } catch (error: any) {
    const result = await call_refresh(error, () =>
      axios.post<TextToSpeechResponse>(`${BASE_URL}audio/`, { text, voiceId }, getAuthConfig())
    );

    if (result === false) return null;

    if ((result as any)?.success && (result as any)?.audio_data) {
      const audioBlob = base64ToBlob(
        (result as any).audio_data,
        (result as any).content_type
      );
      return URL.createObjectURL(audioBlob);
    }

    return null;
  }
};

const base64ToBlob = (base64: string, contentType: string): Blob => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: contentType });
};

export const playAudio = (audioUrl: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const audio = new Audio(audioUrl);
    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
      resolve();
    };
    audio.onerror = () => {
      URL.revokeObjectURL(audioUrl);
      reject(new Error("Failed to play audio"));
    };
    audio.play().catch(reject);
  });
};

///////////////////////////////////////////////////////////
///////////////// USER EXAMPLES VIEWS /////////////////////
///////////////////////////////////////////////////////////

export const getUserExamples = async (wordId: number): Promise<UserExample[] | null> => {
  try {
    const { data } = await axios.get<UserExample[]>(`${BASE_URL}/words/${wordId}/examples/`, getAuthConfig());
    return data;
  } catch (error: any) {
    const result = await call_refresh(error, () =>
      axios.get<UserExample[]>(`${WORDS_URL}${wordId}/examples/`, getAuthConfig())
    );
    return result === false ? null : (result as UserExample[]);
  }
}

export const createUserExample = async (
  wordId: number,
  exampleText: string
): Promise<UserExample | null> => {
  const payload: CreateUserExamplePayload = {
    example_text: exampleText
  };

  try {
    const { data } = await axios.post(
      `${WORDS_URL}${wordId}/examples/create/`,
      payload,
      getAuthConfig()
    );
    return data;
  } catch (error: any) {
    const result = await call_refresh(error, () =>
      axios.post(`${WORDS_URL}${wordId}/examples/create/`, payload, getAuthConfig())
    );
    return result === false ? null : (result as UserExample);
  }
};

export const getUserExample = async (
  wordId: number,
  exampleId: number
): Promise<UserExample | null> => {
  try {
    const { data } = await axios.get(
      `${WORDS_URL}${wordId}/examples/${exampleId}/`,
      getAuthConfig()
    );
    return data;
  } catch (error: any) {
    const result = await call_refresh(error, () =>
      axios.get(`${WORDS_URL}${wordId}/examples/${exampleId}/`, getAuthConfig())
    );
    return result === false ? null : (result as UserExample);
  }
};

export const updateUserExample = async (
  wordId: number,
  exampleId: number,
  exampleText: string
): Promise<UserExample | null> => {
  const payload: CreateUserExamplePayload = {
    example_text: exampleText
  };

  try {
    const { data } = await axios.patch(
      `${WORDS_URL}${wordId}/examples/${exampleId}/`,
      payload,
      getAuthConfig()
    );
    return data;
  } catch (error: any) {
    const result = await call_refresh(error, () =>
      axios.patch(`${WORDS_URL}${wordId}/examples/${exampleId}/`, payload, getAuthConfig())
    );
    return result === false ? null : (result as UserExample);
  }
};

export const deleteUserExample = async (
  wordId: number,
  exampleId: number
): Promise<boolean> => {
  try {
    await axios.delete(`${WORDS_URL}${wordId}/examples/${exampleId}/`, getAuthConfig());
    return true;
  } catch (error: any) {
    const result = await call_refresh(error, () =>
      axios.delete(`${WORDS_URL}${wordId}/examples/${exampleId}/`, getAuthConfig())
    );
    return result !== false;
  }
};

///////////////////////////////////////////////////////////
////////////////// GEMINI AI EXAMPLES ////////////////////
///////////////////////////////////////////////////////////

// Generate AI examples for a specific word
export const generateWordExamples = async (
  wordId: number,
  options: GenerateExampleOptions = {}
): Promise<string | null> => {
  const payload = {
    context: options.context,
    difficulty_level: options.difficulty || 'intermediate',
  };

  try {
    const { data } = await axios.post<GenerateExampleResponse>(
      `${WORDS_URL}${wordId}/examples/generate/`,
      payload,
      getAuthConfig()
    );

    if (data && data.success && data.example) {
      return data.example;
    }

    console.error('Gemini API response error:', data);
    return null;
  } catch (error: any) {
    if (error?.response?.status !== 401) {
      console.error('Generate examples error:', error);
    }

    const result = await call_refresh(error, () =>
      axios.post<GenerateExampleResponse>(`${WORDS_URL}${wordId}/examples/generate/`, payload, getAuthConfig())
    );

    if (result === false) {
      return null;
    }

    if (result && result.success && result.example) {
      return result.example;
    }

    return null;
  }
};
