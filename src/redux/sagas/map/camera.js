import { reactLocalStorage } from "reactjs-localstorage";
import { all, call, put, select, takeLatest } from "redux-saga/effects";
import cameraApi from "../../../api/controller-api/cameraApi";
import Notification from "../../../components/vms/notification/Notification";
import { FORM_MAP_ITEM } from "../../../view/common/vms/constans/map";
import { NOTYFY_TYPE } from "../../../view/common/vms/Constant";
import mapActions from "../../actions/map";
import {
  addCameraOnMapFailed,
  addCameraOnMapSuccess,
  updateCameraOnMapByFilterFailed,
  updateCameraOnMapByFilterSuccess
} from "../../actions/map/cameraActions";
import { updateMapObject } from "../../actions/map/formMapActions";
import {
  ADD_CAMERA_ON_MAP,
  FETCH_ALL_CAMERA_ON_MAP,
  UPDATE_CAMERA_ON_MAP_BY_FILTER
} from "../../types/map";

const language = reactLocalStorage.get('language')
const { fetchAllCameraOnMapFailed, fetchAllCameraOnMapSuccess } = mapActions;


export function* fetchListCameraAction(action) {
  // const notifyMess = {
  //   type: NOTYFY_TYPE.success,
  //   title: '',
  //   description: 'Áp dụng bộ lọc camera thành công'
  // }
  try {
    const { params } = action.payload;
    
    const resp = yield call(cameraApi.getAll, params);
    if (resp && resp.payload) {
      const { payload, metadata } = resp;
      yield put(fetchAllCameraOnMapSuccess({ listCamera: payload, metadata }));
      // Notification(notifyMess);
    } else {
      yield put(fetchAllCameraOnMapFailed(null));
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.data.errors) {
      yield put(fetchAllCameraOnMapFailed(null));
      // notifyMess.type = NOTYFY_TYPE.warning;
      // notifyMess.description = error.response.data.errors.message || 'something is wrong from server side'
      // Notification(notifyMess);
    }
  }
}

export function* updateListCameraByFilterAction(action) {
  let notifyMess = {};
  if (language === "vn") {
    notifyMess = {
      type: NOTYFY_TYPE.success,
      title: "Đơn vị hành chính",
      description: "Bạn đã cập nhật thành công Camera",
    };
  } else {
    notifyMess = {
      type: NOTYFY_TYPE.success,
      title: "Administrative unit",
      description: "Successfully updated Camera",
    };
  }
  try {
    const formMapObject = {
      selectedPos: false,
      isOpenForm: false,
      formEditting: null,
      actionType: "",
      isEditForm: false,
    };
    const bodyCamInfo = action.payload;
    const resp = yield call(cameraApi.update, bodyCamInfo, bodyCamInfo.uuid);
    const formMapSelector = yield select((state) => state.map.form);
    if (resp && resp.payload) {
      yield put(updateCameraOnMapByFilterSuccess(resp.payload));
      yield put(
        updateMapObject({
          ...formMapSelector,
          ...formMapObject,
        })
      );
      sessionStorage.setItem(
        FORM_MAP_ITEM,
        JSON.stringify({ ...formMapSelector, ...formMapObject })
      );
      Notification(notifyMess);
    } else {
      yield put(updateCameraOnMapByFilterFailed(null));
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.data.errors) {
      yield put(updateCameraOnMapByFilterFailed(null));
      notifyMess.type = NOTYFY_TYPE.warning;
      if (language === "vn") {
        notifyMess.description =
          error.response.data.errors.message || "Có lỗi sai từ phía máy chủ";
      } else {
        notifyMess.description =
          error.response.data.errors.message ||
          "Something is wrong from server side";
      }
      Notification(notifyMess);
    }
  }
}

export function* addNewCamAction(action) {
  let notifyMess = {};
  if (language === "vn") {
    notifyMess = {
      type: NOTYFY_TYPE.success,
      title: "",
      description: "Bạn đã thêm thành công Camera",
    };
  } else {
    notifyMess = {
      type: NOTYFY_TYPE.success,
      title: "",
      description: "Successfully added Camera",
    };
  }
  try {
    const formMapObject = {
      selectedPos: false,
      isOpenForm: false,
      formEditting: null,
      actionType: "",
      isEditForm: false,
    };
    const bodyCamInfo = action.payload;
    const resp = yield call(cameraApi.createNew, bodyCamInfo);
    const formMapSelector = yield select((state) => state.map.form);
    if (resp && resp.payload) {
      yield put(addCameraOnMapSuccess(resp.payload));
      yield put(
        updateMapObject({
          ...formMapSelector,
          ...formMapObject,
        })
      );
      sessionStorage.setItem(
        FORM_MAP_ITEM,
        JSON.stringify({ ...formMapSelector, ...formMapObject })
      );
      Notification(notifyMess);
    } else {
      yield put(addCameraOnMapFailed(null));
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.data.errors) {
      yield put(addCameraOnMapFailed(null));
      notifyMess.type = NOTYFY_TYPE.warning;
      if (language === "vn") {
        notifyMess.description =
          error.response.data.errors.message || "Có lỗi xỷ ra từ phía máy chủ";
      } else {
        notifyMess.description =
          error.response.data.errors.message ||
          "Something is wrong from server side";
      }
      Notification(notifyMess);
    }
  }
}

export default function* watchCameraSaga() {
  yield all([
    yield takeLatest(FETCH_ALL_CAMERA_ON_MAP, fetchListCameraAction),
    yield takeLatest(
      UPDATE_CAMERA_ON_MAP_BY_FILTER,
      updateListCameraByFilterAction
    ),
    yield takeLatest(ADD_CAMERA_ON_MAP, addNewCamAction),
  ]);
}
