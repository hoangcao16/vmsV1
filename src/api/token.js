import { axiosAuthzInstance } from '../@core/api/boot/axios'

let config = {
    userKeyName: 'user',
    storageRefreshTokenKeyName: 'refreshToken',
    refreshEndpoint: '/authz/refresh',
}

export function getToken() {
    const userDataStr = localStorage.getItem(config.userKeyName)
    const userData = JSON.parse(userDataStr)
    if (userData && userData.token) {
        return userData.token
    }
    return ""
}

export function getEmail() {
    const userDataStr = localStorage.getItem(config.userKeyName)
    const userData = JSON.parse(userDataStr)
    if (userData && userData.email) {
        return userData.email
    }
    return ""
}

export function getRefreshToken() {
    const userDataStr = localStorage.getItem(config.userKeyName)
    const userData = JSON.parse(userDataStr)
    if (userData && userData.refreshToken) {
        return userData.refreshToken
    }
    return ""
}

export function setUserData(value) {
    localStorage.setItem(config.userKeyName, value);
}

export function refreshToken() {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': getToken()
    }
    return axiosAuthzInstance.post(config.refreshEndpoint, {
        token: getRefreshToken()
    }, {
        headers: headers
    }
    );
}