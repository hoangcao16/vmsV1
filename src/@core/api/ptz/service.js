import defaultConfig from './defaultConfig';
import { refreshToken, setUserData } from '../../../api/token';

export default class AuthzService {
  //Will be used by this service for making API calls
  axiosIns = null;

  //jwtConfig <= Will be used by this service
  config = { ...defaultConfig };

  //For Refreshing Token
  isAlreadyFetchingAccessToken = false;

  //For Refreshing Token
  subscribers = [];

  constructor(axiosIns, jwtOverrideConfig) {
    this.axiosIns = axiosIns;
    this.config = { ...this.config, ...jwtOverrideConfig };

    // request Interceptor
    this.axiosIns.interceptors.request.use(
      (config) => {
        //Get token from localStorage
        const accessToken = this.getToken();

        //If token is present add it to request's Authorization Header
        if (accessToken) {
          //eslint-disable-next-line no-param-reassign
          config.headers.Authorization = `${this.config.tokenType} ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    this.axiosIns.defaults.timeout = 15000;

    //Add request/response interceptor
    this.axiosIns.interceptors.response.use(
      (response) => response,
      (error) => {
        const { config, response } = error;
        const originalRequest = config;

        if (response && response.status === 401) {
          if (!this.isAlreadyFetchingAccessToken) {
            this.isAlreadyFetchingAccessToken = true;
            refreshToken().then((r) => {
              this.isAlreadyFetchingAccessToken = false; //update accessToken in localStorage
              //setToken(r.data.accessToken)
              //setRefreshToken(r.data.refreshToken)
              if (r.data && r.data.accessToken) {
                setUserData({
                  token: r.data.accessToken,
                  refreshToken: r.data.refreshToken,
                });
                this.onAccessTokenFetched(r.data.accessToken);
              }
            });
          }
          const retryOriginalRequest = new Promise((resolve) => {
            this.addSubscriber((accessToken) => {
              originalRequest.headers.Authorization = `${this.config.tokenType} ${accessToken}`;
              resolve(this.axiosIns(originalRequest));
            });
          });
          return retryOriginalRequest;
        }
        return Promise.reject(error);
      }
    );
  }

  onAccessTokenFetched(accessToken) {
    this.subscribers = this.subscribers.filter((callback) =>
      callback(accessToken)
    );
  }

  addSubscriber(callback) {
    this.subscribers.push(callback);
  }

  getToken() {
    return localStorage.getItem(this.config.storageTokenKeyName);
  }

  getRefreshToken() {
    return localStorage.getItem(this.config.storageRefreshTokenKeyName);
  }

  setToken(value) {
    localStorage.setItem(this.config.storageTokenKeyName, value);
  }

  setRefreshToken(value) {
    localStorage.setItem(this.config.storageRefreshTokenKeyName, value);
  }

  getAllUsers(...args) {
    return this.axiosIns.post(this.config.getAllUsersEndpoint, ...args);
  }

  login(...args) {
    return this.axiosIns.post(this.config.loginEndpoint, ...args);
  }

  getUser(...args) {
    return this.axiosIns.post(this.config.registerEndpoint, ...args);
  }

  refreshToken() {
    return this.axiosIns.post(this.config.refreshEndpoint, {
      refreshToken: this.getRefreshToken(),
    });
  }

  me(...args) {
    return this.axiosIns.get(this.config.meEndpoint, ...args);
  }
}
