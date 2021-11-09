import { all } from 'redux-saga/effects';
import allEmailSaga from './allEmailSaga';

export default function* rootSaga() {
  console.log('saga');
  yield all([allEmailSaga()]);
}
