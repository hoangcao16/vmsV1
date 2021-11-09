import controllerApi from './api'
import {handleErrCode} from "./code";

const FILE_VIDEO_ENDPOINT = '/cctv-controller-svc/api/v1/files'
const fileVideoApi = {
  async getAll(uuid) {
    const response = await new Promise((resolve, reject) => {
      controllerApi.axiosIns.get(`${FILE_VIDEO_ENDPOINT}/${uuid}`)
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
      controllerApi.axiosIns.get(`${FILE_VIDEO_ENDPOINT}/${uuid}`)
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
      controllerApi.axiosIns.post(FILE_VIDEO_ENDPOINT, { cam })
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
      controllerApi.axiosIns.delete(`${FILE_VIDEO_ENDPOINT}/${uuid}`)
          .then(response => resolve(response))
          .catch(error => reject(error))
    })
    if (response && response.data) {
      return handleErrCode(response.data);
    }
    return null;
  },
}

export default fileVideoApi
