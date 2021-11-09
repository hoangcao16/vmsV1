import { all, takeLatest } from '@redux-saga/core/effects';
import {
  GET_ROLE,
  GET_ROLE_BY_USER,
  GET_USER_DETAIL
} from '../../../detailUser/redux/action';
import { GET_GROUP } from '../../../detailUser/redux/action/getAllGroup';
import { GET_GROUP_BY_USER } from '../../../detailUser/redux/action/getAllGroupByUser';
import { asycGetAllGroup } from '../../../detailUser/redux/sagas/getAllGroup';
import { asycGetGroupByUser } from '../../../detailUser/redux/sagas/getAllGroupByUser';
import { asycGetAllRole } from '../../../detailUser/redux/sagas/getAllRole';
import { asycGetRoleByUser } from '../../../detailUser/redux/sagas/getAllRoleByUser';
import { asycGetDataUserDetail } from '../../../detailUser/redux/sagas/getDataDetail';
import {
  SEND_REQUEST_GET_LIST_DATA_USER,
  SEND_REQUEST_UPDATE
} from '../actions';
import { asycFetchRequestGetDataListUser } from './fetchDataListUserSaga';
import { asycUpdate } from './update';

export default function* root() {
  yield all([
    yield takeLatest(SEND_REQUEST_UPDATE, asycUpdate),
    yield takeLatest(
      SEND_REQUEST_GET_LIST_DATA_USER,
      asycFetchRequestGetDataListUser
    ),
    yield takeLatest(GET_USER_DETAIL, asycGetDataUserDetail),
    yield takeLatest(GET_ROLE, asycGetAllRole),
    yield takeLatest(GET_ROLE_BY_USER, asycGetRoleByUser),

    yield takeLatest(GET_GROUP, asycGetAllGroup),
    yield takeLatest(GET_GROUP_BY_USER, asycGetGroupByUser)
  ]);
}
