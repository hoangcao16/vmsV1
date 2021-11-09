import { TREE_CAM_GROUP } from '../constants';

const loadTreeCamGroup = (params) => ({
  params: params,
  type: TREE_CAM_GROUP.LOAD
});

const setTreeCamGroup = (treeData) => ({
  type: TREE_CAM_GROUP.LOAD_SUCCESS,
  treeData
});

const setError = (error) => ({
  type: TREE_CAM_GROUP.LOAD_FAIL,
  error
});

export { setTreeCamGroup, loadTreeCamGroup, setError };
