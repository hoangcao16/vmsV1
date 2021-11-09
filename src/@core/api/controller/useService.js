import ControllerService from './service'

export default function useControllerSvc(axiosIns, jwtOverrideConfig) {
  const controllerApi = new ControllerService(axiosIns, jwtOverrideConfig)
  return {
    controllerApi,
  }
}
