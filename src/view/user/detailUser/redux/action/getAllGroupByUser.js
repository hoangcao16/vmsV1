export const GET_GROUP_BY_USER = 'GET_GROUP_BY_USER';
export const GET_GROUP_BY_USER_SUCCESS = 'GET_GROUP_BY_USER_SUCCESS';
export const GET_GROUP_BY_USER_FAILURE = 'GET_GROUP_BY_USER_FAILURE';

export const getGroupByUser = (params) => {
  return {
    type: GET_GROUP_BY_USER,
    params: params,
    payload: []
  };
};

export const getGroupByUserSuccess = (roleUser) => {
  return {
    type: GET_GROUP_BY_USER_SUCCESS,
    payload: roleUser
  };
};

export const getGroupByUserFailure = (error) => {
  return {
    type: GET_GROUP_BY_USER_FAILURE,
    payload: {},
    error: error
  };
};
