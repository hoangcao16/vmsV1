import { TREE_CAM_GROUP } from '../constants';

const errorReducer = (state = null, action) => {
  switch (action.type) {
    case TREE_CAM_GROUP.LOAD_FAIL:
      return action.error;
    case TREE_CAM_GROUP.LOAD:
    case TREE_CAM_GROUP.LOAD_SUCCESS:
      return null;

    default:
      return state;
  }
};

export default errorReducer;
