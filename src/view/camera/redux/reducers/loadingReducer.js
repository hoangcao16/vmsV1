import { TREE_CAM_GROUP } from '../constants';

const loadingReducer = (state = false, action) => {
  switch (action.type) {
    case TREE_CAM_GROUP.LOAD:
      return true;
    case TREE_CAM_GROUP.LOAD_SUCCESS:
      return false;
    case TREE_CAM_GROUP.LOAD_FAIL:
      return false;

    default:
      return state;
  }
};

export default loadingReducer;
