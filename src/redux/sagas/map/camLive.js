import { all, call, put, takeLatest } from "redux-saga/effects";
import camLiveApi from "../../../api/controller-api/cameraLive";
import Notification from "../../../components/vms/notification/Notification";
import { CAM_LIVE_ITEMS } from "../../../view/common/vms/constans/map";
import { NOTYFY_TYPE, STATUS_CODE } from "../../../view/common/vms/Constant";
import {
  deleteListCamLiveError,
  deleteListCamLiveSuccess,
  getListCamLiveError,
  getListCamLiveSuccess,
  saveListCamLiveError,
  saveListCamLiveSuccess,
  updateListCamLiveError,
  updateListCamLiveSuccess,
} from "../../actions/map/camLiveAction";
import {
  DELETE_LIST_CAM_LIVE,
  GET_LIST_CAM_LIVE,
  SAVE_LIST_CAM_LIVE,
  UPDATE_LIST_CAM_LIVE,
} from "../../types/map";

export const setPlayLiveCamByDefault = (payload = []) => {
  const camLiveObject = payload[0] || {};
  const listCammUuid = payload[0]?.cameraUuids || [];
  const listData =
    listCammUuid?.map((cam) => {
      return { uuid: cam, isPlay: false };
    }) || [];
  sessionStorage.setItem(CAM_LIVE_ITEMS, JSON.stringify(listData));
  return { listCamLive: listData, camLiveObject: camLiveObject };
};

export function* fetchListCamLiveAction(action) {
  const notifyMess = {
    type: NOTYFY_TYPE.success,
    title: "",
    description: "",
  };
  try {
    const { params } = action;
    const resp = yield call(camLiveApi.getAll, params);
    if (resp && resp.payload) {
      const { payload, metadata } = resp;
      const convertPayload = setPlayLiveCamByDefault(payload);
      yield put(getListCamLiveSuccess({ metadata, ...convertPayload }));
    } else {
      yield put(getListCamLiveError(null));
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.data.errors) {
      yield put(getListCamLiveError(null));
      notifyMess.type = NOTYFY_TYPE.warning;
      notifyMess.description =
        error.response.data.errors.message ||
        "something is wrong from server side";
      Notification(notifyMess);
    }
  }
}

export function* saveListCamLiveAction(action) {
  const notifyMess = {
    type: NOTYFY_TYPE.success,
    title: "",
    description: "",
  };
  try {
    const { payload: bodyInfor } = action;
    const resp = yield call(camLiveApi.createNew, bodyInfor);

    if (resp && resp.code === STATUS_CODE.SUCCESS) {
      yield put(saveListCamLiveSuccess(resp.payload));
      notifyMess.type = NOTYFY_TYPE.success;
      notifyMess.description = "Lưu camera trực tuyến thành công";
      Notification(notifyMess);
    } else {
      yield put(saveListCamLiveError(null));
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.data.errors) {
      yield put(getListCamLiveError(null));
      notifyMess.type = NOTYFY_TYPE.warning;
      notifyMess.description =
        error.response.data.errors.message ||
        "something is wrong from server side";
      Notification(notifyMess);
    }
  }
}

export function* updateListCamLiveAction(action) {

  const notifyMess = {
    type: NOTYFY_TYPE.success,
    title: "",
    description: "",
  };
  try {
    const { payload: bodyInfor, id } = action;
    const resp = yield call(camLiveApi.update, bodyInfor, id);

    if (resp && resp.code === STATUS_CODE.SUCCESS) {
      yield put(updateListCamLiveSuccess(resp.payload));
      notifyMess.type = NOTYFY_TYPE.success;
      notifyMess.description = "Cập nhật thông tin camra trực tuyến thành công";
      Notification(notifyMess);
    } else {
      yield put(updateListCamLiveError(null));
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.data.errors) {
      yield put(updateListCamLiveError(null));
      notifyMess.type = NOTYFY_TYPE.warning;
      notifyMess.description =
        error.response.data.errors.message ||
        "something is wrong from server side";
      Notification(notifyMess);
    }
  }
}

export function* deleteListCamLiveAction(action) {
  const notifyMess = {
    type: NOTYFY_TYPE.success,
    title: "",
    description: "",
  };
  try {
    const { id } = action;
    const resp = yield call(camLiveApi.delete, id);
    const { code } = resp;
    if (code === STATUS_CODE.SUCCESS) {
      yield put(deleteListCamLiveSuccess({}));
      notifyMess.type = NOTYFY_TYPE.success;
      notifyMess.description = "Xóa thông tin camera trực tuyến thành công";
      Notification(notifyMess);
    } else {
      yield put(deleteListCamLiveError(null));
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.data.errors) {
      yield put(deleteListCamLiveError(null));
      notifyMess.type = NOTYFY_TYPE.warning;
      notifyMess.description =
        error.response.data.errors.message ||
        "something is wrong from server side";
      Notification(notifyMess);
    }
  }
}

export default function* watchCamLiveSaga() {
  yield all([
    yield takeLatest(GET_LIST_CAM_LIVE, fetchListCamLiveAction),
    yield takeLatest(SAVE_LIST_CAM_LIVE, saveListCamLiveAction),
    yield takeLatest(UPDATE_LIST_CAM_LIVE, updateListCamLiveAction),
    yield takeLatest(DELETE_LIST_CAM_LIVE, deleteListCamLiveAction),
  ]);
}
