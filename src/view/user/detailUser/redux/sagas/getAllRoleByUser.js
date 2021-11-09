import { call, put } from '@redux-saga/core/effects';
import UserApi from '../../../../../actions/api/user/UserApi';
import { getRoleByUserSuccess } from '../action/getAllRoleByUser';

export function* asycGetRoleByUser(action) {
  try {
    const response = yield call(() => UserApi.getRoleByUser(action?.params));

    const convertedData = response?.roles.map((r) => {
      return {
        name: r.role_name,
        uuid: r.role_uuid
      };
    });

    yield put(getRoleByUserSuccess(convertedData));
  } catch (error) {
    console.log(error);
  }
}
