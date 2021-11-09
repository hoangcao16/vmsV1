import controllerApi from './api'
import {handleErrCode} from "./code";

const VENDOR_ENDPOINT = '/cctv-controller-svc/api/v1/vendors'
const vendorApi = {
  async getAll(queryParams) {
    const response = await new Promise((resolve, reject) => {
      controllerApi.axiosIns.get(VENDOR_ENDPOINT, {
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
      controllerApi.axiosIns.get(`${VENDOR_ENDPOINT}/${uuid}`)
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
      controllerApi.axiosIns.post(VENDOR_ENDPOINT, { cam })
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
      controllerApi.axiosIns.delete(`${VENDOR_ENDPOINT}/${uuid}`)
        .then(response => resolve(response))
        .catch(error => reject(error))
    })
    if (response && response.data) {
      return handleErrCode(response.data);
    }
    return null;
  },
}

export default vendorApi
