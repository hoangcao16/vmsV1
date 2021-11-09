import { call, put } from '@redux-saga/core/effects';
import UserApi from '../../../../../actions/api/user/UserApi';
import { updateSuccess } from '../actions';

export function* asycUpdate(action) {
  try {
    const response = yield call(() => UserApi.update(action?.params));
    yield put(updateSuccess(response));
  } catch (error) {
    console.log(error);
  }
}
