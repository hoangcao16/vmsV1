import { combineReducers } from 'redux';
import user from '../../view/user/dataListUser/redux/reducers';
import cameraGroup from './../../../src/view/camera/redux/reducers/index';
import notificationReducer from './../../view/notification/redux/reducers/index';
import auth from './auth/';
import calenderReducer from './calendar/';
import cameraReducer from './camera/';
import chatReducer from './chat/';
import customizer from './customizer/';
import dataList from './data-list/';
import emailReducer from './email/';
import mapReducer from './map';
import navbar from './navbar/Index';
import todoReducer from './todo/';
import liveReducer from "./live"

import chartData from './../../view/report/redux/reduders/index';

import email from './../../view/storage/store-setting/redux/reducers/index';

const rootReducer = combineReducers({
  calendar: calenderReducer,
  emailApp: emailReducer,
  todoApp: todoReducer,
  chatApp: chatReducer,
  customizer: customizer,
  auth: auth,
  navbar: navbar,
  dataList: dataList,
  camera: cameraReducer,
  user: user,
  cameraGroup: cameraGroup,
  map: mapReducer,
  notification: notificationReducer,
  email: email,
  chart: chartData,
  live: liveReducer
});

export default rootReducer;
