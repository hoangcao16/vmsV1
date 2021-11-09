import { TREE_CAM_GROUP } from '../constants';

const treeCamGroupReducer = (state = [], action) => {
  if (action.type === TREE_CAM_GROUP.LOAD_SUCCESS) {
    return action.treeData;
  }

  return state;
};

export default treeCamGroupReducer;
