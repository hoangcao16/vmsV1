import { put, takeLatest } from 'redux-saga/effects';
import { setMessageCount } from '../actions/messageCount';
import { setPage } from '../actions/page';
import { MESSAGE_UNREAD } from '../constants';

export function* handleMessageUnreadLoad(action) {
  yield put(setMessageCount(0));
  yield put(setPage(0));
}

export default function* watchNotificationLoad() {
  yield takeLatest(MESSAGE_UNREAD.LOAD, handleMessageUnreadLoad);
}
