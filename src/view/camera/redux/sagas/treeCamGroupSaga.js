import _, { isEmpty } from 'lodash';
import { call, put, takeLatest } from 'redux-saga/effects';
import CameraApi from '../../../../actions/api/camera/CameraApi';
import { setError, setTreeCamGroup } from '../actions';
import { TREE_CAM_GROUP } from '../constants';

function unflatten(array, parent, tree) {
  tree = typeof tree !== 'undefined' ? tree : [];
  parent = typeof parent !== 'undefined' ? parent : { uuid: 0 };

  var children = _.filter(array, function (child) {
    return child.parentId == parent.uuid;
  });

  if (!_.isEmpty(children)) {
    if (parent.uuid == 0) {
      tree = children;
    } else {
      parent['children'] = children;
    }
    _.each(children, function (child) {
      unflatten(array, child);
    });
  }

  return tree;
}

export function* handleTreeCamGroupLoad(action) {
  try {
    const treeData = yield call(() =>
      CameraApi.getAllGroupCamera(action?.params)
    );

    const treeDataConverted = treeData.map((p) => {
      return {
        name: p?.name,
        uuid: p?.uuid,
        parentId: isEmpty(p?.parent) ? '0' : p?.parent
      };
    });
    const data = unflatten(treeDataConverted);
    yield put(setTreeCamGroup(data));
  } catch (error) {
    yield put(setError(error.toString()));
  }
}

export default function* watchTreeCamGroupLoad() {
  yield takeLatest(TREE_CAM_GROUP.LOAD, handleTreeCamGroupLoad);
}
