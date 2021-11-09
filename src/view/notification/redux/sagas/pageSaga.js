import { put, takeLatest } from 'redux-saga/effects';
import { setNotification } from '../actions';
import { setMessageCount } from '../actions/messageCount';
import { setPage } from '../actions/page';
import { MESSAGE_UNREAD, PAGE } from '../constants';

export function* handlePageLoad(action) {
  yield put(setPage(0));
 
}

export default function* watchPageLoad() {
  yield takeLatest(PAGE.LOAD, handlePageLoad);
}
