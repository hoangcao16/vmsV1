import config from './defaultConfig'
import {registerRequestInterceptor, registerResponseInterceptor} from "../boot/axios";

export default class PandaService {
  // Will be used by this service for making API calls
  axiosIns = null

  // jwtConfig <= Will be used by this service
  config = { ...config }

  // For Refreshing Token
  isAlreadyFetchingAccessToken = false

  constructor(axiosIns, jwtOverrideConfig) {
    this.axiosIns = axiosIns
    this.config = { ...this.config, ...jwtOverrideConfig }
    this.axiosIns.defaults.timeout = 15000
    registerRequestInterceptor(this.axiosIns)
    registerResponseInterceptor(this.axiosIns)
  }

  onAccessTokenFetched(accessToken) {
    this.subscribers = this.subscribers.filter(callback => callback(accessToken))
  }

  getToken() {
    return localStorage.getItem(this.config.storageTokenKeyName)
  }

  getRefreshToken() {
    return localStorage.getItem(this.config.storageRefreshTokenKeyName)
  }
  refreshToken() {
    return this.axiosIns.post(this.config.refreshEndpoint, {
      refreshToken: this.getRefreshToken(),
    })
  }

}
