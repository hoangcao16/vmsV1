import LionService from "./service";

export default function useService(axiosIns, jwtOverrideConfig) {
  const lionApi = new LionService(axiosIns, jwtOverrideConfig)
  return {
      lionApi,
  }
}
