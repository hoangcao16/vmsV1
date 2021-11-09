import { call, put, all, takeEvery, select} from 'redux-saga/effects';
import {UPDATE_CAMERA_ON_MAP_BY_TRACKING_POINT} from '../../types/map'
import cameraApi from '../../../api/controller-api/cameraApi';
import { NOTYFY_TYPE, STATUS_CODE } from '../../../view/common/vms/Constant';
import Notification from "../../../components/vms/notification/Notification"
import { updateCameraOnMapByTrackingPointFailed, updateCameraOnMapByTrackingPointSuccess } from '../../actions/map/trackingPointActions';

export function* updateListCameraByTrackingPointAction(action) {
  const notifyMess = {
    type: NOTYFY_TYPE.success,
    title: '',
    description: 'Bạn đã cập nhật thành công Camera theo tracking point thành công'
  }
  try {
    const {body, id, type} = action.payload;
    const resp = yield call(cameraApi.getCamsByTrackingPoint, body);
    if (resp && resp.payload) {
      const payload = resp.payload;
      payload.length > 0 && payload[0].listCamera.length  && payload[0].listCamera.forEach((point) => {
        point.trackingPointId = id
        point.source = 1;
      });

      let listCamByTrackPoint = yield select(state =>  state.map.trackingPoint.listCamByTrackingPoint);
      if(type === 'update') {
        listCamByTrackPoint = listCamByTrackPoint.filter((cam) => cam.trackingPointId !== id);
      }
      const listCamFilter = payload[0]?.listCamera?.filter(
        (cam, idx) => {
          return !listCamByTrackPoint.find(
            (item) => item.uuid === cam.uuid && item.source === cam.source
          );
        }
      );
      const newListTrackingPoint = [...listCamByTrackPoint, ...listCamFilter];
      yield put(updateCameraOnMapByTrackingPointSuccess(newListTrackingPoint));
    } else {
      yield put(updateCameraOnMapByTrackingPointFailed(null))
    }
  } catch(error) {
    if (error.response && error.response.data && error.response.data.errors) {
      yield put(updateCameraOnMapByTrackingPointFailed(null))
      notifyMess.type = NOTYFY_TYPE.warning;
      notifyMess.description = error.response.data.errors.message || 'something is wrong from server side'
      Notification(notifyMess); 
    } 
  }
}

export default function* watchCameraSaga() {
  yield all([
    yield takeEvery(UPDATE_CAMERA_ON_MAP_BY_TRACKING_POINT, updateListCameraByTrackingPointAction),
  ])
}
