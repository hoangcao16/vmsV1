import { ALL_EMAIL } from '../constants';

const loadingReducer = (state = false, action) => {
  switch (action.type) {
    case ALL_EMAIL.LOAD:
      return true;
    case ALL_EMAIL.LOAD_SUCCESS:
      return false;
    case ALL_EMAIL.LOAD_FAIL:
      return false;

    default:
      return state;
  }
};

export default loadingReducer;
