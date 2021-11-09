import AuthzService from "./service";

export default function useService(axiosIns, jwtOverrideConfig) {
    const authzApi = new AuthzService(axiosIns, jwtOverrideConfig)
    return {
        authzApi,
    }
}
