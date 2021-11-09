import {
  GET_ROLE_BY_USER,
  GET_ROLE_BY_USER_SUCCESS,
  GET_ROLE_BY_USER_FAILURE
} from '../action/getAllRoleByUser';
const initialState = {
  loading: false,
  list: [],
  error: {},
  params: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_ROLE_BY_USER:
      return {
        ...state,
        loading: true
      };

    case GET_ROLE_BY_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        list: action.payload,
        error: {}
      };

    case GET_ROLE_BY_USER_FAILURE:
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
