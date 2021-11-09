import controllerApi from './api'
import {handleErrCode} from "./code";

const WARD_ENDPOINT = '/cctv-controller-svc/api/v1/wards'
const wardApi = {
  async getAll(uuid) {
    const response = await new Promise((resolve, reject) => {
      controllerApi.axiosIns.get(`${WARD_ENDPOINT}/${uuid}`)
        .then(response => resolve(response))
        .catch(error => reject(error))
    })
    if (response && response.data) {
      return handleErrCode(response.data);
    }
    return null;
  },
}

export default wardApi
