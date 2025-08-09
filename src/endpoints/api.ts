import axios, { AxiosRequestConfig } from "axios";
import { WordData } from "../types/word";

const BASE_URL = 'https://vocabloom-backend.onrender.com/api/';
// const BASE_URL = 'http://127.0.0.1:8000/api/';

const LOGIN_URL = `${BASE_URL}token/`;
const REFRESH_URL = `${BASE_URL}token/refresh/`;
const WORDS_URL = `${BASE_URL}words/`;
const LOGOUT_URL = `${BASE_URL}logout/`;
const AUTH_URL = `${BASE_URL}authenticated/`;
const REGISTER_URL = `${BASE_URL}register_user/`;
const TAGS_URL = `${BASE_URL}tags/`;


// 
function friendlyMsg(err: any, fallback = "Something went wrong.") {
  const data = err?.response?.data;
  const first = (v: any) => Array.isArray(v) ? v[0] : v;

  if (typeof data === "string") return data;
  if (data?.detail) return first(data.detail);
  if (data?.non_field_errors) return first(data.non_field_errors);
  if (data?.name) return first(data.name);   // tag field error
  if (data?.word) return first(data.word);   // word field error

  const s = err?.response?.status;
  if (s === 400 || s === 409) return "Already exists.";
  if (s === 401) return "Please log in again.";
  return fallback;
}

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

// export const login = async (username: string, password: string): Promise<boolean> => {
//   const { data } = await axios.post(LOGIN_URL, { username, password });
//   if (data.access && data.refresh) {
//     localStorage.setItem("access_token", data.access);
//     localStorage.setItem("refresh_token", data.refresh);
//     return true;
//   }
//   return false;
// };
export const login = async (username: string, password: string): Promise<boolean> => {
  try {
    const { data } = await axios.post(LOGIN_URL, { username, password });
    if (data.access && data.refresh) {
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      return true;
    }
    throw new Error("Invalid username or password");
  } catch (err: any) {
    const message =
      err?.response?.status === 401
        ? "Invalid username or password"
        : err?.response?.data?.detail || "Failed to log in.";
    throw new Error(message);
  }
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

export const logout = async (): Promise<boolean> => {
  try {
    await axios.post(LOGOUT_URL, {}, getAuthConfig());
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

export async function save_word(word: WordData): Promise<WordData | null> {
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
    // try auth refresh first
    if (error.response?.status === 401) {
      const result = await call_refresh(error, () =>
        axios.post(WORDS_URL, payload, getAuthConfig())
      );
      if (result !== false) return result as WordData;
    }
    // then surface a nice message (e.g., duplicate)
    throw new Error(friendlyMsg(error, "Failed to save word."));
  }
}

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

export const delete_word = async (id: number) => {
  try {
    await axios.delete(`${WORDS_URL}${id}/`, getAuthConfig());
    return true;
  } catch (error: any) {
    return await call_refresh(error, () =>
      axios.delete(`${WORDS_URL}${id}/`, getAuthConfig())
    );
  }
};

// export const create_tag = async (name: string) => {
//   try {
//     const { data } = await axios.post(TAGS_URL, { name }, getAuthConfig());
//     return data;
//   } catch (error: any) {
//     if (error.response?.status === 401) {
//       const result = await call_refresh(error, () =>
//         axios.post(TAGS_URL, { name }, getAuthConfig())
//       );
//       if (result !== false) return result;
//     }
//     throw new Error(friendlyMsg(error, "Failed to create tag."));
//   }
// };
export const create_tag = async (name: string) => {
  try {
    const { data } = await axios.post(TAGS_URL, { name }, getAuthConfig());
    return data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      const result = await call_refresh(error, () =>
        axios.post(TAGS_URL, { name }, getAuthConfig())
      );
      if (result !== false) return result;
    }
    // extract friendly message or default
    const msg = error?.response?.data?.name?.[0] || error?.response?.data?.detail || "This tag already exists.";
    throw new Error(msg);
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