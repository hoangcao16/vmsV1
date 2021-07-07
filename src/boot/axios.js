import axios from 'axios';
import { reactLocalStorage } from "reactjs-localstorage";
// import store from '../store/index';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_VMSGW || "http://10.0.0.62:10001"
});

const axiosAuthzInstance = axios.create({
  baseURL: process.env.REACT_APP_API_VMSGW || "http://10.0.0.62:10001"
});


const axiosGoogleServiceInstance = axios.create({
  baseURL: process.env.API_GOOGLE_MODULE
});

const requestErrorHandler = async (
  instance, error
) => {
  if (
    error &&
    error.response &&
    error.response.status === 401 &&
    error.response.data.message.includes('Token is expired')
  ) {
    // await store.dispatch('authz/refreshToken');
    return instance({
      url: error.config.url,
      method: error.config.method,
      params: error.config.params,
      data: error.config.data
    });
  }
  return Promise.reject(error);
};

axiosInstance.interceptors.response.use(
  response => response,
  async error => await requestErrorHandler(axiosInstance, error)
);

export function handleToken(data) {
  const user = JSON.parse(atob(data.accessToken.split('.')[1]));
  console.log("handleToken:", user)
  axiosInstance.defaults.headers.common[
    'Authorization'
  ] = `${data.accessToken}`;
  axiosAuthzInstance.defaults.headers.common[
    'Authorization'
  ] = `${data.accessToken}`;
  reactLocalStorage.set('token', data.accessToken);
  return {
    token: data.accessToken,
    refresh_token: data.refresh_token,
    user: user,
    domain: user.domain,
  };
}


export {
  axiosInstance,
  axiosAuthzInstance,
  axiosGoogleServiceInstance,
};
