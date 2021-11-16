import { all } from 'redux-saga/effects';
import treeCamGroupSaga from './treeCamGroupSaga';

export default function* rootSaga() {
  yield all([treeCamGroupSaga()]);
}
