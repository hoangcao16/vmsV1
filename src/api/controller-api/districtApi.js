import controllerApi from './api'
import {handleErrCode} from "./code";

const DISTRICT_ENDPOINT = '/cctv-controller-svc/api/v1/districts'
const districtApi = {
  async getAll(uuid) {
    const response = await new Promise((resolve, reject) => {
      controllerApi.axiosIns.get(`${DISTRICT_ENDPOINT}/${uuid}`)
        .then(response => resolve(response))
        .catch(error => reject(error))
    })
    if (response && response.data) {
      return handleErrCode(response.data);
    }
    return null;
  },
}

export default districtApi
