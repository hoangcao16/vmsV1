import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;
const TIME_OUT = 10000;
const STATUS_UNAUTHORIZED = 401;
const CODE_SUCCESS = 'success';

const instanceForInternal = axios.create({
  baseURL: BASE_URL,
  timeout: TIME_OUT,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json; charset=utf-8'
  }
});

export async function callInternalApi(requestConfig) {
  try {
    const response = await instanceForInternal.request(requestConfig);

    return response.data;
  } catch (error) {
    const response = error.response;
    if (!response.status || STATUS_UNAUTHORIZED !== response.status) {
      throw error;
    }

    localStorage.removeItem('user.info');
    const text = 'Login session has expired, please login again.';

    alert(text);
  }
}

export { CODE_SUCCESS };
