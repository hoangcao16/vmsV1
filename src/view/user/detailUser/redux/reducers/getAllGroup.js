import {
  GET_GROUP,
  GET_GROUP_SUCCESS,
  GET_GROUP_FAILURE
} from '../action/getAllGroup';
const initialState = {
  loading: false,
  list: [],
  error: {},
  params: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_GROUP:
      return {
        ...state,
        loading: true
      };

    case GET_GROUP_SUCCESS:
      return {
        ...state,
        loading: false,
        list: action.payload,
        error: {}
      };

    case GET_GROUP_FAILURE:
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
