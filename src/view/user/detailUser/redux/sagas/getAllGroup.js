import { call, put } from '@redux-saga/core/effects';
import UserApi from '../../../../../actions/api/user/UserApi';
import { getAllGroupSuccess } from '../action/getAllGroup';

export function* asycGetAllGroup(action) {
  try {
    const response = yield call(() => UserApi.getAllGroup());


    const convertedData = response?.map((r) => {
        return {
          name: r.name,
          uuid: r.uuid
        };
      });
  

    yield put(getAllGroupSuccess(convertedData));
  } catch (error) {
    console.log(error);
  }
}
