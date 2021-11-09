import { call, put, takeLatest } from 'redux-saga/effects';
import HardDriveListApi from '../../../../actions/api/hard-drive-list/HardDriveListApi';
import { setError, setMessageCount } from '../actions/messageCount';
import { MESSAGE_COUNT } from '../constants';

export function* handleMessageCountLoad(action) {
  try {
    const messageCount = yield call(() =>
      HardDriveListApi.getBadge()
    );
    yield put(setMessageCount(messageCount));
  } catch (error) {
    yield put(setError(error.toString()));
  }
}

export default function* watchMessageCountLoad() {
  yield takeLatest(MESSAGE_COUNT.LOAD, handleMessageCountLoad);
}
