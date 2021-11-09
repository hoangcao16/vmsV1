import controllerApi from './api'
import {handleErrCode} from "./code";

const CAMERA_TYPE_ENDPOINT = '/cctv-controller-svc/api/v1/camera_types'
const cameraTypeApi = {
  async getAll(queryParams) {
    const response = await new Promise((resolve, reject) => {
      controllerApi.axiosIns.get(CAMERA_TYPE_ENDPOINT, {
        params: queryParams,
      })
        .then(response => resolve(response))
        .catch(error => reject(error))
    })
    if (response && response.data) {
      const data = handleErrCode(response.data);
      if (data && data.payload) return data.payload;
      return [];
    }
    return [];
  },
  async get(uuid) {
    const response = await new Promise((resolve, reject) => {
      controllerApi.axiosIns.get(`${CAMERA_TYPE_ENDPOINT}/${uuid}`)
        .then(response => {
           resolve(response.data.payload)
        })
        .catch(error => reject(error))
    })
    if (response && response.data) {
      const data = handleErrCode(response.data);
      if (data && data.payload) return data.payload;
      return [];
    }
    return []
  },
  async createNew(zone) {
    const response = await new   Promise((resolve, reject) => {
      controllerApi.axiosIns.post(CAMERA_TYPE_ENDPOINT, { zone })
        .then(response => resolve(response))
        .catch(error => reject(error))
    })
    if (response && response.data) {
      const data = handleErrCode(response.data);
      if (data && data.payload) return data.payload;
      return [];
    }
    return []
  },
  async delete(uuid) {
    const response = await new Promise((resolve, reject) => {
      controllerApi.axiosIns.delete(`${CAMERA_TYPE_ENDPOINT}/${uuid}`)
        .then(response => resolve(response))
        .catch(error => reject(error))
    })
    if (response && response.data) {
      return handleErrCode(response.data);
    }
    return null;
  },
}

export default cameraTypeApi
