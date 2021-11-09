import { call, put } from '@redux-saga/core/effects';
import UserApi from '../../../../../actions/api/user/UserApi';
import { getDataDetailSuccess } from '../action';

export function* asycGetDataUserDetail(action) {
  try {
    const response = yield call(() => UserApi.getDetailUser(action?.params));

    yield put(getDataDetailSuccess(response));
  } catch (error) {
    console.log(error);
  }
}
