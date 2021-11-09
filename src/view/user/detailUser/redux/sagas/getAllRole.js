import { call, put } from '@redux-saga/core/effects';
import UserApi from '../../../../../actions/api/user/UserApi';
import { getAllRoleSuccess } from '../action/getAllRole';

export function* asycGetAllRole(action) {
  try {
    const response = yield call(() => UserApi.getAllRole());

    const convertedData = response?.map((r) => {
      return {
        name: r.name,
        uuid: r.uuid
      };
    });

    yield put(getAllRoleSuccess(convertedData));
  } catch (error) {
    console.log(error);
  }
}
