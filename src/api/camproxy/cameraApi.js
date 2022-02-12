import axios from "axios";
import Notification from "../../components/vms/notification/Notification";
import { handleErrCode } from "../camproxy/code";

// const CAMPROXY_ENDPOINT = "/camproxy/v1/play?width=360&height=288";
const CAMPROXY_ENDPOINT = "/camproxy/v1/play";
const CAMPROXY_ENDPOINT_HLS = "/camproxy/v1/play/hls";
const playCamApi = {
  async playCamera(baseUrl, queryParams) {
    try {
      const response = await new Promise((resolve, reject) => {
        const axiosInstance = axios.create({
          baseURL: baseUrl,
        });
        axiosInstance.interceptors.response.use(
          (response) => response,
          (error) => {
            return Promise.reject(error);
          }
        );
        axiosInstance
          .post(CAMPROXY_ENDPOINT, queryParams)
          .then((response) => resolve(response))
          .catch((error) => reject(error));
      });
      if (response && response.data) {
        const payload = handleErrCode(response.data);
        if (payload) {
          return payload;
        }
      }
      return null;
    } catch (e) {
      Notification({
        type: "error",
        title: "",
        description: e.message,
      });
      return null;
    }
  },
  async playCameraHls(baseUrl, queryParams) {
    try {
      const response = await new Promise((resolve, reject) => {
        const axiosInstance = axios.create({
          baseURL: baseUrl,
        });
        axiosInstance.interceptors.response.use(
          (response) => response,
          (error) => {
            return Promise.reject(error);
          }
        );
        axiosInstance
          .post(CAMPROXY_ENDPOINT_HLS, queryParams)
          .then((response) => resolve(response))
          .catch((error) => reject(error));
      });
      if (response && response.data) {
        const payload = handleErrCode(response.data);
        if (payload) {
          return payload;
        }
      }
      return null;
    } catch (e) {
      Notification({
        type: "error",
        title: "",
        description: e.message,
      });
      return null;
    }
  },
};

export default playCamApi;
