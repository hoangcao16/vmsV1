import controllerApi from './api'
import {handleErrCode} from "./code";

const FILE_ENDPOINT = '/cctv-controller-svc/api/v1/zones'
const fileApi = {
  async getAll(queryParams) {
    const response = await new Promise((resolve, reject) => {
      controllerApi.axiosIns.get(FILE_ENDPOINT, {
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
      controllerApi.axiosIns.get(`${FILE_ENDPOINT}/${uuid}`)
        .then(response => resolve(response))
        .catch(error => reject(error))
    })
    if (response && response.data) {
      return handleErrCode(response.data);
    }
    return null;
  },
  async createNew(zone) {
    const response = await new Promise((resolve, reject) => {
      controllerApi.axiosIns.post(FILE_ENDPOINT, { zone })
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
      controllerApi.axiosIns.delete(`${FILE_ENDPOINT}/${uuid}`)
        .then(response => resolve(response))
        .catch(error => reject(error))
    })
    if (response && response.data) {
      return handleErrCode(response.data);
    }
    return null;
  },
}

export default fileApi
