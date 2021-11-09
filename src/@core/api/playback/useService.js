import CamproxyService from "./service";

export default function useService(axiosIns, jwtOverrideConfig) {
  const camproxyApi = new CamproxyService(axiosIns, jwtOverrideConfig)
  return {
    camproxyApi,
  }
}
