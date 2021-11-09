import controllerApi from './api'
import {handleErrCode} from "./code";

const PROVINCE_ENDPOINT = '/cctv-controller-svc/api/v1/provinces'
const provinceApi = {
  async getAll(queryParams) {
    const response = await new Promise((resolve, reject) => {
      controllerApi.axiosIns.get(PROVINCE_ENDPOINT, {
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
}

export default provinceApi
