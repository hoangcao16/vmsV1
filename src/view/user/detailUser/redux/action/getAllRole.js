export const GET_ROLE = 'GET_ROLE';
export const GET_ROLE_SUCCESS = 'GET_ROLE_SUCCESS';
export const GET_ROLE_FAILURE = 'GET_ROLE_FAILURE';

export const getAllRole = (params) => {
  return {
    type: GET_ROLE,
    params: params,
    payload: []
  };
};

export const getAllRoleSuccess = (role) => {
  return {
    type: GET_ROLE_SUCCESS,
    payload: role
  };
};

export const getAllRoleFailure = (error) => {
  return {
    type: GET_ROLE_FAILURE,
    payload: {},
    error: error
  };
};
