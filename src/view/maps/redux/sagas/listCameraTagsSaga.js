import { isEmpty } from "lodash";
import { call, put, takeLatest } from "redux-saga/effects";
import CameraApi from "../../../../actions/api/camera/CameraApi";
import { setCameraTags, setError } from "../actions/listCameraTagsAction";
import { CAMERA_TAGS } from "../constants";

export function* handleCameraTagsLoad(action) {
  const { params } = action;
  if (isEmpty(params)) {
    yield put(setCameraTags([]));
    return;
  }

  const tagsPayLoad = params.map((p) => {
    if (p.includes(":")) {
      var str = p;
      var index = str.indexOf(":");
      var arr = [str.slice(0, index), str.slice(index + 1)];
      return {
        key: arr[0],
        value: arr[1],
      };
    } else {
      return {
        key: "*",
        value: p,
      };
    }
  });

  let payload = {
    tags: tagsPayLoad,
    page: 1,
    size: 20,
  };

  try {
    const cameraTags = yield call(() => CameraApi.getCameraByTagName(payload));
    yield put(setCameraTags(cameraTags));
  } catch (error) {
    yield put(setError(error.toString()));
  }
}

export default function* watchCameraTagsLoad() {
  yield takeLatest(CAMERA_TAGS.LOAD, handleCameraTagsLoad);
}
