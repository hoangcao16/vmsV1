export default {
  // Users Endpoints
  getAllUsersEndpoint: '/authz//api/v0/users',
  meEndpoint: '/authz/api/v0/me',

  // Onboarding
  registerEndpoint: '/jwt/register',
  refreshEndpoint: '/authz/refresh-token',
  loginEndpoint: '/authz/login',
  logoutEndpoint: '/jwt/logout',

  // This will be prefixed in authorization header with token
  // e.g. Authorization: Bearer <token>
  tokenType: '',

  // Value of this property will be used as key to store JWT token in storage
  storageTokenKeyName: 'accessToken',
  storageRefreshTokenKeyName: 'refreshToken'
};
