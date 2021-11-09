import CheetahService from "./service";

export default function useService(axiosIns, jwtOverrideConfig) {
  const cheetahApi = new CheetahService(axiosIns, jwtOverrideConfig)

  return {
      cheetahApi,
  }
}
