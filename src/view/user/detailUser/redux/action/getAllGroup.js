export const GET_GROUP = 'GET_GROUP';
export const GET_GROUP_SUCCESS = 'GET_GROUP_SUCCESS';
export const GET_GROUP_FAILURE = 'GET_GROUP_FAILURE';

export const getAllGroup = (params) => {
  return {
    type: GET_GROUP,
    params: params,
    payload: []
  };
};

export const getAllGroupSuccess = (role) => {
  return {
    type: GET_GROUP_SUCCESS,
    payload: role
  };
};

export const getAllGroupFailure = (error) => {
  return {
    type: GET_GROUP_FAILURE,
    payload: {},
    error: error
  };
};
