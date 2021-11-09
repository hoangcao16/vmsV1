import { call, put } from '@redux-saga/core/effects';
import { reactLocalStorage } from 'reactjs-localstorage';
import UserApi from '../../../../../actions/api/user/UserApi';
import { getGroupByUserSuccess } from '../action/getAllGroupByUser';

export function* asycGetGroupByUser(action) {
  try {
    const response = yield call(() => UserApi.getGroupByUser(action?.params));

    const convertedData = response?.groups.map((r) => r.group_uuid);

    yield put(getGroupByUserSuccess(convertedData));
  } catch (error) {
    console.log(error);
  }
}
