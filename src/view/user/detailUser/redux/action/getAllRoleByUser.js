export const GET_ROLE_BY_USER = 'GET_ROLE_BY_USER';
export const GET_ROLE_BY_USER_SUCCESS = 'GET_ROLE_BY_USER_SUCCESS';
export const GET_ROLE_BY_USER_FAILURE = 'GET_ROLE_BY_USER_FAILURE';

export const getRoleByUser = (params) => {
  return {
    type: GET_ROLE_BY_USER,
    params: params,
    payload: []
  };
};

export const getRoleByUserSuccess = (roleUser) => {
  return {
    type: GET_ROLE_BY_USER_SUCCESS,
    payload: roleUser
  };
};

export const getRoleByUserFailure = (error) => {
  return {
    type: GET_ROLE_BY_USER_FAILURE,
    payload: {},
    error: error
  };
};
