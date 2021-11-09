import { call, put } from '@redux-saga/core/effects';
import UserApi from '../../../../../actions/api/user/UserApi';
import { fetchDataListUserSuccess } from '../actions/fetchDataListUser';

export function* asycFetchRequestGetDataListUser(action) {
  try {
    const response = yield call(() => UserApi.getAllUser(action?.params));

    yield put(fetchDataListUserSuccess(response));
  } catch (error) {
    console.log(error);
  }
}
