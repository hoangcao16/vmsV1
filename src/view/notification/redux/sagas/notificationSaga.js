import { call, put, takeLatest, select } from 'redux-saga/effects';
import HardDriveListApi from '../../../../actions/api/hard-drive-list/HardDriveListApi';
import { setError, setNotification } from '../actions';
import { setTotalNotif } from '../actions/totalNotif';
import { NOTIFICATION } from '../constants';

export const getPage = (state) => state.notification.nextPage;
export function* handleNotificationLoad(action) {
  try {
    const page = yield select(getPage);
    const notif = yield call(() =>
      HardDriveListApi.getAllMessageWarning({ page: page, pageSize: 20 })
    );
    yield put(setNotification(notif?.messageInfo));
    yield put(setTotalNotif(notif?.sizeMessage));
  } catch (error) {
    yield put(setError(error.toString()));
  }
}

export default function* watchNotificationLoad() {
  yield takeLatest(NOTIFICATION.LOAD, handleNotificationLoad);
}
