import { TAGS } from '../constants';

const errorReducer = (state = null, action) => {
  switch (action.type) {
    case TAGS.LOAD_FAIL:
      return action.error;
    case TAGS.LOAD:
    case TAGS.LOAD_SUCCESS:
      return null;

    default:
      return state;
  }
};

export default errorReducer;
