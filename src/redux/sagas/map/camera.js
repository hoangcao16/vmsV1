import { call, put, takeLatest, select, all } from 'redux-saga/effects';
import { ADD_CAMERA_ON_MAP, FETCH_ALL_CAMERA_ON_MAP, UPDATE_CAMERA_ON_MAP_BY_FILTER } from '../../types/map'
import cameraApi from '../../../api/controller-api/cameraApi';
import { NOTYFY_TYPE, STATUS_CODE } from '../../../view/common/vms/Constant';
import mapActions from '../../actions/map';
import { addCameraOnMapFailed, addCameraOnMapSuccess, updateCameraOnMapByFilterFailed, updateCameraOnMapByFilterSuccess } from '../../actions/map/cameraActions';
import { updateMapObject } from '../../actions/map/formMapActions';
import { FORM_MAP_ITEM } from '../../../view/common/vms/constans/map';
import Notification from "../../../components/vms/notification/Notification"
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
      const { code, payload, metadata } = resp;
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
  const notifyMess = {
    type: NOTYFY_TYPE.success,
    title: '',
    description: 'Bạn đã cập nhật thành công Camera'
  }
  try {
    const formMapObject = {
      selectedPos: false,
      isOpenForm: false,
      formEditting: null,
      actionType: '',
      isEditForm: false
    }
    const bodyCamInfo = action.payload;
    const resp = yield call(cameraApi.update, bodyCamInfo, bodyCamInfo.uuid);
    const formMapSelector = yield select(state => state.map.form);
    if (resp && resp.payload) {
      yield put(updateCameraOnMapByFilterSuccess(resp.payload));
      yield put(updateMapObject({
        ...formMapSelector,
        ...formMapObject
      }))
      sessionStorage.setItem(FORM_MAP_ITEM, JSON.stringify({ ...formMapSelector, ...formMapObject }));
      Notification(notifyMess);
    } else {
      yield put(updateCameraOnMapByFilterFailed(null));
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.data.errors) {
      yield put(updateCameraOnMapByFilterFailed(null));
      notifyMess.type = NOTYFY_TYPE.warning;
      notifyMess.description = error.response.data.errors.message || 'something is wrong from server side'
      Notification(notifyMess);
    }
  }
}

export function* addNewCamAction(action) {
  const notifyMess = {
    type: NOTYFY_TYPE.success,
    title: '',
    description: 'Bạn đã thêm thành công Camera'
  }
  try {
    const formMapObject = {
      selectedPos: false,
      isOpenForm: false,
      formEditting: null,
      actionType: '',
      isEditForm: false
    }
    const bodyCamInfo = action.payload;
    const resp = yield call(cameraApi.createNew, bodyCamInfo);
    const formMapSelector = yield select(state => state.map.form);
    console.log("resprespresprespresp", resp)
    if (resp && resp.payload) {
      yield put(addCameraOnMapSuccess(resp.payload));
      yield put(updateMapObject({
        ...formMapSelector,
        ...formMapObject
      }))
      sessionStorage.setItem(FORM_MAP_ITEM, JSON.stringify({ ...formMapSelector, ...formMapObject }));
      Notification(notifyMess);
    } else {
      yield put(addCameraOnMapFailed(null));
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.data.errors) {
      yield put(addCameraOnMapFailed(null));
      notifyMess.type = NOTYFY_TYPE.warning;
      notifyMess.description = error.response.data.errors.message || 'something is wrong from server side'
      Notification(notifyMess);
    }
  }
}

export default function* watchCameraSaga() {
  yield all([
    yield takeLatest(FETCH_ALL_CAMERA_ON_MAP, fetchListCameraAction),
    yield takeLatest(UPDATE_CAMERA_ON_MAP_BY_FILTER, updateListCameraByFilterAction),
    yield takeLatest(ADD_CAMERA_ON_MAP, addNewCamAction),
  ])
}