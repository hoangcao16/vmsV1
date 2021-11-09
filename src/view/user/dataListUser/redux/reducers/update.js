import {
  SEND_REQUEST_UPDATE,
  SEND_REQUEST_UPDATE_FAILURE,
  SEND_REQUEST_UPDATE_SUCCESS
} from '../actions';

const initialState = {
  loading: false,
  error: {},
  params: {},
  isEdit: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SEND_REQUEST_UPDATE:
      return {
        ...state,
        loading: true
      };

    case SEND_REQUEST_UPDATE_SUCCESS:
      return {
        ...state,
        loading: false,
        error: {},
        isEdit: action.payload
      };

    case SEND_REQUEST_UPDATE_FAILURE:
      return {
        ...state,
        loading: false,
        error: {}
      };

    default:
      return state;
  }
};
