import controllerApi from './api'
import {handleErrCode} from "./code";

const EVENT_ENDPOINT = '/cctv-controller-svc/api/v1/events'
const eventApi = {
    async getAll(queryParams) {
        const response = await new Promise((resolve, reject) => {
            controllerApi.axiosIns.get(EVENT_ENDPOINT, {
                params: queryParams,
            })
                .then(response => resolve(response))
                .catch(error => reject(error))
        })
        if (response && response.data) {
            return handleErrCode(response.data);
        }
        return null;
    },
    async get(uuid) {
        const response = await new Promise((resolve, reject) => {
            controllerApi.axiosIns.get(`${EVENT_ENDPOINT}/${uuid}`)
                .then(response => resolve(response))
                .catch(error => reject(error))
        })
        if (response && response.data) {
            return handleErrCode(response.data);
        }
        return null;
    },
    async createNew(cam) {
        const response = await new Promise((resolve, reject) => {
            controllerApi.axiosIns.post(EVENT_ENDPOINT, cam)
                .then(response => resolve(response))
                .catch(error => reject(error))
        })
        if (response && response.data) {
            return handleErrCode(response.data);
        }
        return null;
    },
    async update(record, uuid) {
        const response = await new Promise((resolve, reject) => {
            controllerApi.axiosIns.put(`${EVENT_ENDPOINT}/${uuid}`, record)
                .then(response => resolve(response))
                .catch(error => reject(error))
        })
        if (response && response.data) {
            return handleErrCode(response.data);
        }
        return null;
    },
    async delete(uuid) {
        const response = await new Promise((resolve, reject) => {
            controllerApi.axiosIns.delete(`${EVENT_ENDPOINT}/${uuid}`)
                .then(response => resolve(response))
                .catch(error => reject(error))
        })
        if (response && response.data) {
            return handleErrCode(response.data);
        }
        return null;
    },
}

export default eventApi
