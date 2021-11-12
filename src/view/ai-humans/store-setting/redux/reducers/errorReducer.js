import { ALL_EMAIL } from '../constants';

const errorReducer = (state = null, action) => {
  switch (action.type) {
    case ALL_EMAIL.LOAD_FAIL:
      return action.error;
    case ALL_EMAIL.LOAD:
    case ALL_EMAIL.LOAD_SUCCESS:
      return null;

    default:
      return state;
  }
};

export default errorReducer;
