import { all } from 'redux-saga/effects';
import notificationSaga from './notificationSaga';
import messageCountSaga from './messageCountSaga';
import messageUnread from './messageUnread';
import pageSaga from './pageSaga';

export default function* rootSaga() {
  yield all([
    notificationSaga(),
    messageCountSaga(),
    messageUnread(),
    pageSaga()
  ]);
}
