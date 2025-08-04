import axios from "axios";
import { WordData } from '../types/word';


const BASE_URL = 'https://vocabloom-backend.onrender.com/api/';
const LOGIN_URL = `${BASE_URL}token/`;
const REFRESH_URL = `${BASE_URL}token/refresh/`;
const WORDS_URL = `${BASE_URL}words/`;
const LOGOUT_URL = `${BASE_URL}logout/`
const AUTH_URL = `${BASE_URL}authenticated/`;
const REGISTER_URL = `${BASE_URL}register_user/`;
const TAGS_URL = `${BASE_URL}tags/`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const getAuthConfig = () => ({
  withCredentials: true,
  headers: {
    ...getAuthHeaders(),
  },
});

export const login = async (username: string, password: string): Promise<boolean> => {
  try {
    const response = await axios.post<{ 
      success: boolean;
      access?: string;
      refresh?: string;
    }>(
      LOGIN_URL,
      { username, password },
      { withCredentials: true }
    );

    if (response.data.success) {
      if (response.data.access) {
        localStorage.setItem('access_token', response.data.access);
      }
      if (response.data.refresh) {
        localStorage.setItem('refresh_token', response.data.refresh);
      }
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Login failed:', error);
    return false;
  }
};

export const refresh_token = async (): Promise<boolean> => {
  try {
    const response = await axios.post<{ refreshed: boolean }>(
      REFRESH_URL,
      {},
      { withCredentials: true }
    );

    if (response.data.refreshed) {
      return true;
    }

    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      const tokenResponse = await axios.post<{ 
        access: string; 
        refresh?: string; 
      }>(
        REFRESH_URL,
        { refresh: refreshToken },
        { withCredentials: true }
      );

      if (tokenResponse.data.access) {
        localStorage.setItem('access_token', tokenResponse.data.access);
      }
      if (tokenResponse.data.refresh) {
        localStorage.setItem('refresh_token', tokenResponse.data.refresh);
      }
      
      return true;
    }

    return false;
  } catch (error) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    return false;
  }
};

export const get_words = async (): Promise<any[] | false> => {
  try {
    const response = await axios.get<any[]>(WORDS_URL, getAuthConfig());
    return response.data;
  } catch (error: any) {
    return await call_refresh(error, () =>
      axios.get<any[]>(WORDS_URL, getAuthConfig())
    );
  }
};

export const logout = async (): Promise<boolean> => {
  try {
    await axios.post(LOGOUT_URL, {}, getAuthConfig());
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    return true;
  } catch (error) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    return false;
  }
};

export const is_authenticated = async (): Promise<boolean> => {
  try {
    await axios.post(AUTH_URL, {}, getAuthConfig());
    return true;
  } catch (error: any) {
    if (error.response?.status === 401) {
      const refreshed = await refresh_token();
      if (refreshed) {
        try {
          await axios.post(AUTH_URL, {}, getAuthConfig());
          return true;
        } catch (retryError) {
          return false;
        }
      }
    }
    return false;
  }
};

type ErrorWithResponse = {
  response?: {
    status?: number;
    [key: string]: any;
  };
  [key: string]: any;
};

export const call_refresh = async <T>(
  error: ErrorWithResponse,
  func: () => Promise<{ data: T }>
): Promise<T | false> => {
  if (error.response && error.response.status === 401) {
    const tokenRefreshed = await refresh_token();
    if (tokenRefreshed) {
      const retryResponse = await func();
      return retryResponse.data;
    }
  }
  return false;
};

export const register = async (
  username: string,
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<any> => {

  const response = await axios.post<any>(
    REGISTER_URL,
    {
      username,
      email,
      password,
      first_name: firstName,
      last_name: lastName,
    }
  );
  return response.data;
};

export async function save_word(word: WordData): Promise<WordData | null> {
  const payload = {
    ...word,
    meanings: word.meanings.map((m) => ({
      part_of_speech: m.partOfSpeech,
      definitions: m.definitions,
    })),
  };

  try {
    const response = await axios.post(WORDS_URL, payload, getAuthConfig());
    return response.data;
  } catch (error: any) {
    // Use your existing call_refresh function
    const result = await call_refresh(error, () =>
      axios.post(WORDS_URL, payload, getAuthConfig())
    );
    
    if (result === false) return null;
    return result as WordData;
  }
}

export const create_tag = async (name: string): Promise<{ id: number, name: string } | null> => {
  try {
    const response = await axios.post(TAGS_URL, { name }, getAuthConfig());
    return response.data;
  } catch (error: any) {
    const refreshed = await call_refresh(error, () =>
      axios.post(TAGS_URL, { name }, getAuthConfig())
    );

    if (refreshed === false) return null;
    return refreshed as { id: number; name: string };
  }
};

export const get_tags = async (): Promise<{ id: number; name: string }[] | false> => {
  try {
    const response = await axios.get(TAGS_URL, getAuthConfig());
    return response.data;
  } catch (error: any) {
    return await call_refresh(error, () =>
      axios.get(TAGS_URL, getAuthConfig())
    );
  }
};

export const get_words_by_tag = async (
  tagId: number
): Promise<any[] | false> => {
  try {
    const response = await axios.get(`${TAGS_URL}${tagId}/words/`, getAuthConfig());
    return response.data;
  } catch (error: any) {
    return await call_refresh(error, () =>
      axios.get(`${TAGS_URL}${tagId}/words/`, getAuthConfig())
    );
  }
};

export async function get_saved_words(): Promise<WordData[]> {
  try {
    const response = await axios.get<WordData[]>(`${WORDS_URL}`, getAuthConfig());
    return response.data;
  } catch (error: any) {
    // Use call_refresh for consistency
    const result = await call_refresh(error, () =>
      axios.get<WordData[]>(`${WORDS_URL}`, getAuthConfig())
    );
    
    if (result === false) return [];
    return result as WordData[];
  }
}