import { all, put, select } from '@redux-saga/core/effects';
import watchBookmarkSaga from "./bookmarks";

export default function* RootSaga() {
  yield all([watchBookmarkSaga()]);
}
