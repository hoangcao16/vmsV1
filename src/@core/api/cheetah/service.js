import config from './defaultConfig'
import {registerRequestInterceptor, registerResponseInterceptor} from "../boot/axios";

export default class CheetahService {
  // Will be used by this service for making API calls
  axiosIns = null

  // jwtConfig <= Will be used by this service
  config = { ...config }

  // For Refreshing Token
  isAlreadyFetchingAccessToken = false

  // For Refreshing Token
  subscribers = []

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

  addSubscriber(callback) {
    this.subscribers.push(callback)
  }

  getToken() {
    return localStorage.getItem(this.config.storageTokenKeyName)
  }

  getRefreshToken() {
    return localStorage.getItem(this.config.storageRefreshTokenKeyName)
  }

  setToken(value) {
    localStorage.setItem(this.config.storageTokenKeyName, value)
  }

  setRefreshToken(value) {
    localStorage.setItem(this.config.storageRefreshTokenKeyName, value)
  }
  refreshToken() {
    return this.axiosIns.post(this.config.refreshEndpoint, {
      refreshToken: this.getRefreshToken(),
    })
  }

}
