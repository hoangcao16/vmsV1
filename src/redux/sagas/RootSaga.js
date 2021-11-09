import { all } from '@redux-saga/core/effects';
import cameraGroup from '../../view/camera/redux/sagas/index';
import userSaga from '../../view/user/dataListUser/redux/sagas';
import cameraSaga from './map/index';
import notificationSaga from '../../view/notification/redux/sagas/index';
import allEmailSaga from '../../view/storage/store-setting/redux/sagas/index'
import dataChartSaga from "../../../src/view/report/redux/sagas/index"



export default function* RootSaga() {
  yield all([
    userSaga(),
    cameraGroup(),
    cameraSaga(),
    notificationSaga(),
    allEmailSaga(),
    dataChartSaga()
  ]);
}
