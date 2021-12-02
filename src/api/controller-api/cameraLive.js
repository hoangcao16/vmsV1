import controllerApi from "./api";
import { handleErrCode } from "./code";
const CAMERA_LIVE_ENDPOINT = "/cctv-controller-svc/api/v1/live_camera";
const camLiveApi = {
  async getAll(queryParams) {
    const response = await new Promise((resolve, reject) => {
      controllerApi.axiosIns
        .get(CAMERA_LIVE_ENDPOINT, {
          params: queryParams,
        })
        .then((response) => resolve(resolve(response)))
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
        .put(`${CAMERA_LIVE_ENDPOINT}/${uuid}`, cam)
        .then((response) => resolve(response?.data))
        .catch((error) => reject(error));
    });


    if (response && response?.payload) {
      return handleErrCode(response);
    }
    return null;
  },
  async createNew(cam) {
    const response = await new Promise((resolve, reject) => {
      controllerApi.axiosIns
        .post(CAMERA_LIVE_ENDPOINT, cam)
        .then((response) => resolve(response?.data))
        .catch((error) => reject(error));
    });

    if (response && response.payload) {
      return handleErrCode(response);
    }
    return null;
  },
  async delete(uuid) {
    const response = await new Promise((resolve, reject) => {
      controllerApi.axiosIns
        .delete(`${CAMERA_LIVE_ENDPOINT}/${uuid}`)
        .then((response) => resolve(response?.data))
        .catch((error) => reject(error));
    });
    if (response) {
      return handleErrCode(response);
    }
    return null;
  },
};

export default camLiveApi;
