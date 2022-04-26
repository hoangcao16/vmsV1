import controllerApi from './api';
import axios from 'axios';
import { handleErrCode } from './code';
const CAMERA_ENDPOINT = '/cctv-controller-svc/api/v1/cameras';
const CAMERA_ENDPOINT_AI = '/cctv-controller-svc/api/v1/cameras/ai';
const CAMERA_SEARCH_ENDPOINT = '/cctv-controller-svc/api/v1/cameras/search';
const CAMERA_BY_TRACKING_POINT =
  '/cctv-controller-svc/api/v1/cameras/find_by_points';
const cameraApi = {
  async getAll(queryParams) {
    const response = await new Promise((resolve, reject) => {
      controllerApi.axiosIns
        .get(CAMERA_ENDPOINT, {
          params: queryParams,
        })
        .then((response) => resolve(response))
        .catch((error) => reject(error));
    });
    if (response && response.data) {
      return handleErrCode(response.data);
    }
    return null;
  },
  async getAllAI(queryParams) {
    const response = await new Promise((resolve, reject) => {
      controllerApi.axiosIns
        .get(CAMERA_ENDPOINT_AI, {
          params: queryParams,
        })
        .then((response) => resolve(response))
        .catch((error) => reject(error));
    });
    if (response && response.data) {
      return handleErrCode(response.data);
    }
    return null;
  },
  async searchCamerasWithUuids(bodyJson) {
    const response = await new Promise((resolve, reject) => {
      controllerApi.axiosIns
        .post(CAMERA_SEARCH_ENDPOINT, bodyJson)
        .then((response) => resolve(response))
        .catch((error) => reject(error));
    });
    if (response && response.data) {
      return handleErrCode(response.data);
    }
    return null;
  },
  async get(uuid) {
    const response = await new Promise((resolve, reject) => {
      controllerApi.axiosIns
        .get(`${CAMERA_ENDPOINT}/${uuid}`)
        .then((response) => resolve(response))
        .catch((error) => reject(error));
    });
    if (response && response.data) {
      return handleErrCode(response.data);
    }
    return null;
  },
  async update(cam, uuid) {
    const response = await new Promise((resolve, reject) => {
      controllerApi.axiosIns
        .put(`${CAMERA_ENDPOINT}/${uuid}`, cam)
        .then((response) => resolve(response))
        .catch((error) => reject(error));
    });
    if (response && response.data) {
      return handleErrCode(response.data);
    }
    return null;
  },
  async createNew(cam) {
    const response = await new Promise((resolve, reject) => {
      controllerApi.axiosIns
        .post(CAMERA_ENDPOINT, cam)
        .then((response) => resolve(response))
        .catch((error) => reject(error));
    });
    if (response && response.data) {
      return handleErrCode(response.data);
    }
    return null;
  },
  async delete(uuid) {
    const response = await new Promise((resolve, reject) => {
      controllerApi.axiosIns
        .delete(`${CAMERA_ENDPOINT}/${uuid}`)
        .then((response) => resolve(response))
        .catch((error) => reject(error));
    });
    if (response && response.data) {
      return handleErrCode(response.data);
    }
    return null;
  },
  async getCamsByTrackingPoint(bodyJson) {
    const response = await new Promise((resolve, reject) => {
      controllerApi.axiosIns
        .post(CAMERA_BY_TRACKING_POINT, bodyJson)
        .then((response) => resolve(response))
        .catch((error) => reject(error));
    });
    if (response && response.data) {
      return handleErrCode(response.data);
    }
    return null;
  },
};

export default cameraApi;
