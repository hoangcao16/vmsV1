export const SEND_REQUEST_UPDATE = 'SEND_REQUEST_UPDATE';
export const SEND_REQUEST_UPDATE_SUCCESS = 'SEND_REQUEST_UPDATE_SUCCESS';
export const SEND_REQUEST_UPDATE_FAILURE = 'SEND_REQUEST_UPDATE_FAILURE';

export const update = (params) => {
  return {
    type: SEND_REQUEST_UPDATE,
    params: params,
    payload: []
  };
};

export const updateSuccess = (data) => {
  return {
    type: SEND_REQUEST_UPDATE_SUCCESS,
    payload: data
  };
};

export const updateFailure = (error) => {
  return {
    type: SEND_REQUEST_UPDATE_FAILURE,
    payload: {},
    error: error
  };
};
