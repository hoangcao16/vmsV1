import { combineReducers } from 'redux';
import fetchDataListUserReducer from './fetchDataListUser';
import updateReducer from './update';

import getDataDetail from './../../../detailUser/redux/reducers/getDataDetail';
import getAllRole from './../../../detailUser/redux/reducers/getAllRole';
import getRoleByUser from './../../../detailUser/redux/reducers/getAllRoleByUser';

import getAllGroup from './../../../detailUser/redux/reducers/getAllGroup';
import getGroupByUser from './../../../detailUser/redux/reducers/getAllGroupByUser';

export default combineReducers({
  update: updateReducer,
  dataUser: fetchDataListUserReducer,
  dataUserDetail: getDataDetail,
  allRole: getAllRole,
  roleByUser: getRoleByUser,
  allGroup: getAllGroup,
  groupByUser: getGroupByUser
});
