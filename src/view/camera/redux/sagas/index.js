import { all } from 'redux-saga/effects';
import treeCamGroupSaga from './treeCamGroupSaga';

export default function* rootSaga() {
  console.log('saga');
  yield all([treeCamGroupSaga()]);
}
