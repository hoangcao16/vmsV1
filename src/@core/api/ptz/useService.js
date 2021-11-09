import AuthzService from './service';

export default function useService(axiosIns, jwtOverrideConfig) {
  const useAuth = new AuthzService(axiosIns, jwtOverrideConfig);
  return {
    useAuth,
  };
}
