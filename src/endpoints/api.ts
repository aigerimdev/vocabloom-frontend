import axios from "axios";

const BASE_URL = 'https://vocabloom-backend.onrender.com/api/';
const LOGIN_URL = `${BASE_URL}token/`;
const REFRESH_URL = `${BASE_URL}token/refresh/`;
const WORDS_URL = `${BASE_URL}words/`;
const LOGOUT_URL = `${BASE_URL}logout/`
const AUTH_URL = `${BASE_URL}authenticated/`;
const REGISTER_URL = `${BASE_URL}register_user/`;
const TAGS_URL = `${BASE_URL}tags/`;


export const login = async (username: string, password: string): Promise<boolean> => {
  const response = await axios.post<{ success: boolean }>(
    LOGIN_URL,
    { username, password },
    { withCredentials: true }
  );
  return response.data.success;
};

export const refresh_token = async (): Promise<boolean> => {
  try {
    await axios.post<{ refreshed: boolean }>(
      REFRESH_URL,
      {},
      { withCredentials: true }
    );
    return true;
  } catch (error) {
    return false
  }
};

export const get_words = async (): Promise<any[] | false> => {
  try {
    const response = await axios.get<any[]>(WORDS_URL, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    return await call_refresh(error, () =>
      axios.get<any[]>(WORDS_URL, { withCredentials: true })
    );
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

export const logout = async (): Promise<boolean> => {
  try {
    await axios.post(
      LOGOUT_URL,
      {},
      { withCredentials: true }
    );
    return true;
  } catch (error) {
    return false;
  }
};

export const is_authenticated = async () => {
  try {
    await axios.post(AUTH_URL, {}, { withCredentials: true })
    return true
  } catch (error) {
    return false
  }
}

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

export const save_word = async (wordData: any): Promise<any> => {
  try {
    const response = await axios.post(
      WORDS_URL,
      wordData,
      { withCredentials: true }
    );
    return response.data;
  } catch (error: any) {
    return await call_refresh(error, () =>
      axios.post(WORDS_URL, wordData, { withCredentials: true })
    );
  }
};

export const create_tag = async (name: string): Promise<{ id: number, name: string } | null> => {
  try {
    const response = await axios.post(TAGS_URL, { name }, { withCredentials: true });
    return response.data;
  } catch (error: any) {
    const refreshed = await call_refresh(error, () =>
      axios.post(TAGS_URL, { name }, { withCredentials: true })
    );

    if (refreshed === false) return null;
    return refreshed as { id: number; name: string };

  }
};

export const get_tags = async (): Promise<{ id: number; name: string }[] | false> => {
  try {
    const response = await axios.get(TAGS_URL, { withCredentials: true });
    return response.data;
  } catch (error: any) {
    return await call_refresh(error, () =>
      axios.get(TAGS_URL, { withCredentials: true })
    );
  }
};

export const get_words_by_tag = async (
  tagId: number
): Promise<any[] | false> => {
  try {
    const response = await axios.get(`${TAGS_URL}${tagId}/words/`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    return await call_refresh(error, () =>
      axios.get(`${TAGS_URL}${tagId}/words/`, {
        withCredentials: true,
      })
    );
  }
};
