import controllerApi from './api'
import {handleErrCode} from "./code";

const NVR_ENDPOINT = '/cctv-controller-svc/api/v1/nvr'
const nvrApi = {
  async getAll(uuid) {
    const response = await new Promise((resolve, reject) => {
      controllerApi.axiosIns.get(`${NVR_ENDPOINT}/${uuid}`)
        .then(response => resolve(response))
        .catch(error => reject(error))
    })
    if (response && response.data) {
      return handleErrCode(response.data);
    }
    return null;
  },
  async update(uuid, name) {
    const response = await new Promise((resolve, reject) => {
      controllerApi.axiosIns.put(`${NVR_ENDPOINT}/${uuid}`, name)
        .then(response => resolve(response))
        .catch(error => reject(error))
    })
    if (response && response.data) {
      return handleErrCode(response.data);
    }
    return null;
  },
}

export default nvrApi
