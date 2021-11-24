import { TAGS } from "../constants";

const loadingReducer = (state = false, action) => {
  switch (action.type) {
    case TAGS.LOAD:
      return true;
    case TAGS.LOAD_SUCCESS:
      return false;
    case TAGS.LOAD_FAIL:
      return false;

    default:
      return state;
  }
};

export default loadingReducer;
