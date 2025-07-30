import axios from "axios";

const BASE_URL = 'https://vocabloom-backend.onrender.com/api/';
const LOGIN_URL = `${BASE_URL}token/`;
const REFRESH_URL = `${BASE_URL}token/refresh/`;
const WORDS_URL = `${BASE_URL}words/`;
const LOGOUT_URL = `${BASE_URL}logout/`
const AUTH_URL = `${BASE_URL}authenticated/`;
const REGISTER_URL = `${BASE_URL}register_user/`;



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