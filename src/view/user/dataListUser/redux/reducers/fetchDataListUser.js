import {
  SEND_REQUEST_GET_LIST_DATA_USER,
  SEND_REQUEST_GET_LIST_DATA_USER_SUCCESS,
  SEND_REQUEST_GET_LIST_DATA_USER_FAILURE
} from '../actions';

const initialState = {
  loading: false,
  user: [],
  error: {},
  params: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SEND_REQUEST_GET_LIST_DATA_USER:
      return {
        ...state,
        loading: true
      };

    case SEND_REQUEST_GET_LIST_DATA_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload,
        error: {}
      };

    case SEND_REQUEST_GET_LIST_DATA_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: {},
        user: []
      };

    default:
      return state;
  }
};
