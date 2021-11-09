import controllerApi from './api'
import {handleErrCode} from "./code";

const CAMERA_GROUP_ENDPOINT = '/cctv-controller-svc/api/v1/camera_groups'
const cameraGroupApi = {
  async getAll(queryParams) {
    const response = await new Promise((resolve, reject) => {
      controllerApi.axiosIns.get(CAMERA_GROUP_ENDPOINT, {
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
      controllerApi.axiosIns.get(`${CAMERA_GROUP_ENDPOINT}/${uuid}`)
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
      controllerApi.axiosIns.post(CAMERA_GROUP_ENDPOINT, { cam })
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
      controllerApi.axiosIns.delete(`${CAMERA_GROUP_ENDPOINT}/${uuid}`)
          .then(response => resolve(response))
          .catch(error => reject(error))
    })
    if (response && response.data) {
      return handleErrCode(response.data);
    }
    return null;
  },
}

export default cameraGroupApi
