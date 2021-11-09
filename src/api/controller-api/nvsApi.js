import controllerApi from './api'
import {handleErrCode} from "./code";

const NVS_ENDPOINT = '/cctv-controller-svc/api/v1/nvr'
const nvsApi = {
  async getAll(uuid) {
    const response = await new Promise((resolve, reject) => {
      controllerApi.axiosIns.get(`${NVS_ENDPOINT}/${uuid}`)
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
      controllerApi.axiosIns.put(`${NVS_ENDPOINT}/${uuid}`, name)
        .then(response => resolve(response))
        .catch(error => reject(error))
    })
    if (response && response.data) {
      return handleErrCode(response.data);
    }
    return null;
  },
}

export default nvsApi
