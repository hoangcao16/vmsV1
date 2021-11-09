import axios from 'axios'
import {handleErrCode} from "./code";

const PLAYBACK_ENDPOINT = '/play/hls';
const PLAYBACK_START_ENDPOINT = '/v1/playback/startPlayback';
const PLAYBACK_PLAY_SINGLE_FILE_ENDPOINT = '/v1/playback/playSingleFile';
const playbackApi = {
    async startPlayback(baseUrl, jsonBody) {
        const response = await new Promise((resolve, reject) => {
            const axiosInstance = axios.create({
                baseURL: baseUrl,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': '*',
                    'Access-Control-Allow-Headers': '*'
                }
            })
            axiosInstance.interceptors.response.use(
                response => response,
                error => {
                    return Promise.reject(error)
                },
            )
            console.log('startPlayback:', baseUrl, jsonBody)
            axiosInstance.post(PLAYBACK_START_ENDPOINT, jsonBody)
                .then(response => resolve(response))
                .catch(error => reject(error))
        })
        if (response && response.data) {
            const payload = handleErrCode(response.data)
            if (payload) {
                return payload;
            }
        }
        return null;
    },
    async playCamera(baseUrl, camUuid, queryParams) {
        const response = await new Promise((resolve, reject) => {
            const axiosInstance = axios.create({
                baseURL: baseUrl
            })
            axiosInstance.interceptors.response.use(
                response => response,
                error => {
                    return Promise.reject(error)
                },
            )
            console.log('playCamera:', baseUrl, camUuid, queryParams)
            const endpoint = PLAYBACK_ENDPOINT + "/" + camUuid + "/index.m3u8"
            axiosInstance.post(endpoint, queryParams)
                .then(response => resolve(response))
                .catch(error => reject(error))
        })
        if (response && response.data) {
            const payload = handleErrCode(response.data)
            if (payload) {
                return payload;
            }
        }
        return null;
    },
    async playCameraWithSeek(baseUrl, camUuid, startTime) {
        const response = await new Promise((resolve, reject) => {
            const axiosInstance = axios.create({
                baseURL: baseUrl
            })
            axiosInstance.interceptors.response.use(
                response => response,
                error => {
                    return Promise.reject(error)
                },
            )
            console.log('playCamera:', baseUrl, camUuid)
            const endpoint = PLAYBACK_ENDPOINT + "/" + camUuid + "/index.m3u8?startTime=" + startTime.toString()
            axiosInstance.get(endpoint)
                .then(response => resolve(response))
                .catch(error => reject(error))
        })
        if (response && response.data) {
            const payload = handleErrCode(response.data)
            if (payload) {
                return payload;
            }
        }
        return null;
    },
    async playSingleFile(baseUrl, jsonBody) {
        const response = await new Promise((resolve, reject) => {
            const axiosInstance = axios.create({
                baseURL: baseUrl
            })
            axiosInstance.interceptors.response.use(
                response => response,
                error => {
                    return Promise.reject(error)
                },
            )
            console.log('playSingleFile:', baseUrl, jsonBody)
            axiosInstance.post(PLAYBACK_PLAY_SINGLE_FILE_ENDPOINT, jsonBody)
                .then(response => resolve(response))
                .catch(error => reject(error))
        })
        if (response && response.data) {
            const payload = handleErrCode(response.data)
            if (payload) {
                return payload;
            }
        }
        return null;
    },
}

export default playbackApi
