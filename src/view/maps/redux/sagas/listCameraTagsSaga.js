import { call, put, takeLatest } from "redux-saga/effects";
import CameraApi from "../../../../actions/api/camera/CameraApi";
import { setCameraTags, setError } from "../actions/listCameraTagsAction";
import { CAMERA_TAGS } from "../constants";

export function* handleCameraTagsLoad(action) {
  //biến đổi payload

  let payload = {
    tags: [
      {
        key: "*",
        value: "Duy Tan",
      },
      {
        key: "Tọa độ",
        value: 105.0,
      },
    ],
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
