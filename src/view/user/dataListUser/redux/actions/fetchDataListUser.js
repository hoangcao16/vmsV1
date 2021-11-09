export const SEND_REQUEST_GET_LIST_DATA_USER =
  'SEND_REQUEST_GET_LIST_DATA_USER';
export const SEND_REQUEST_GET_LIST_DATA_USER_SUCCESS =
  'SEND_REQUEST_GET_LIST_DATA_USER_SUCCESS';
export const SEND_REQUEST_GET_LIST_DATA_USER_FAILURE =
  'SEND_REQUEST_GET_LIST_DATA_USER_FAILURE';

export const fetchDataListUser = (params) => {
  return {
    type: SEND_REQUEST_GET_LIST_DATA_USER,
    params: params,
    payload: []
  };
};

export const fetchDataListUserSuccess = (user) => {
  return {
    type: SEND_REQUEST_GET_LIST_DATA_USER_SUCCESS,
    payload: user
  };
};

export const fetchDataListUserFailure = (error) => {
  return {
    type: SEND_REQUEST_GET_LIST_DATA_USER_FAILURE,
    payload: {},
    error: error
  };
};
