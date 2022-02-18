import { combineReducers } from 'redux';
import user from '../../view/user/dataListUser/redux/reducers';
import cameraGroup from './../../../src/view/camera/redux/reducers/index';
import notificationReducer from './../../view/notification/redux/reducers/index';
import auth from './auth/';
import cameraReducer from './camera/';
import customizer from './customizer/';
import mapReducer from './map';
import liveReducer from "./live"

import chartData from './../../view/report/redux/reduders/index';

import email from './../../view/storage/store-setting/redux/reducers/index';
import quickSearch from './../../view/maps/redux/reducers/index';
import openModalPresetSetting from './live/OpenModalPresetSettingReducers';
import updateData from './live/UpdateDataReducers';

const rootReducer = combineReducers({
  customizer: customizer,
  auth: auth,
  camera: cameraReducer,
  user: user,
  cameraGroup: cameraGroup,
  map: mapReducer,
  notification: notificationReducer,
  email: email,
  chart: chartData,
  live: liveReducer,
  quickSearch:quickSearch,
  openModalPresetSetting: openModalPresetSetting,
  updateData: updateData
});

export default rootReducer;
