import PandaService from "./service";
import {getToken} from "../../../api/token";

export default function useService(axiosIns, jwtOverrideConfig) {
  const serviceApi = new PandaService(axiosIns, jwtOverrideConfig)
  serviceApi.axiosIns.defaults.timeout = 15000;
  serviceApi.axiosIns.interceptors.request.use(
      (config) => {
        // Get token from
        const accessToken = getToken();
        if (accessToken) {
          // eslint-disable-next-line no-param-reassign
          config.headers.Authorization = `${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
  );
  return {
    serviceApi,
  }
}
