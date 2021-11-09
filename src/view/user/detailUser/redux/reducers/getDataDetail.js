import {
  GET_USER_DETAIL,
  GET_USER_DETAIL_SUCCESS,
  GET_USER_DETAIL_FAILURE
} from '../action';
const initialState = {
  loading: false,
  user: [],
  error: {},
  params: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_USER_DETAIL:
      return {
        ...state,
        loading: true
      };

    case GET_USER_DETAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload,
        error: {}
      };

    case GET_USER_DETAIL_FAILURE:
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
