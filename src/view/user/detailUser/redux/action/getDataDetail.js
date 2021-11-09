export const GET_USER_DETAIL = 'GET_USER_DETAIL';
export const GET_USER_DETAIL_SUCCESS = 'GET_USER_DETAIL_SUCCESS';
export const GET_USER_DETAIL_FAILURE = 'GET_USER_DETAIL_FAILURE';

export const getDataDetail = (params) => {
  return {
    type: GET_USER_DETAIL,
    params: params,
    payload: []
  };
};

export const getDataDetailSuccess = (userDetail) => {
  return {
    type: GET_USER_DETAIL_SUCCESS,
    payload: userDetail
  };
};

export const getDataDetailFailure = (error) => {
  return {
    type: GET_USER_DETAIL_FAILURE,
    payload: {},
    error: error
  };
};
