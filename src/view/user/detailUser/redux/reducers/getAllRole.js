import {
  GET_ROLE,
  GET_ROLE_SUCCESS,
  GET_ROLE_FAILURE
} from '../action/getAllRole';
const initialState = {
  loading: false,
  list: [],
  error: {},
  params: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_ROLE:
      return {
        ...state,
        loading: true
      };

    case GET_ROLE_SUCCESS:
      return {
        ...state,
        loading: false,
        list: action.payload,
        error: {}
      };

    case GET_ROLE_FAILURE:
      return {
        ...state,
        loading: false,
        error: {},
        list: []
      };

    default:
      return state;
  }
};
