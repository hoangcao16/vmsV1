import { isEmpty } from 'lodash';
import { put, takeLatest, call } from 'redux-saga/effects';
import HardDriveListApi from '../../../../../actions/api/hard-drive-list/HardDriveListApi';
import UserApi from '../../../../../actions/api/user/UserApi';
import { setAllEmail, setError } from '../actions';
import { setEmails } from '../actions/email';
import { ALL_EMAIL } from '../constants';

export function* handleAllEmailLoad(action) {
  try {
    const data = {
      page: '',
      size: 100000,
      searchName: '',
      unit: ''
    };
    const listUser = yield call(() => UserApi.getAllUser(data));

    const emailByList = yield call(() => HardDriveListApi.getAllMail(data)) ||
      [];
    const emailByUser = listUser.payload.map((u) => u.email);

    let uniqEmail;
    if (!isEmpty(emailByList)) {
      uniqEmail = [...new Set([...emailByUser, emailByList.email])];
    } else {
      uniqEmail = [...new Set([...emailByUser])];
    }

    yield put(setAllEmail(uniqEmail));

    yield put(setEmails(emailByList.email));
  } catch (error) {
    yield put(setError(error.toString()));
  }
}

export default function* watchTreeCamGroupLoad() {
  yield takeLatest(ALL_EMAIL.LOAD, handleAllEmailLoad);
}
