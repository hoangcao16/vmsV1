import { all } from 'redux-saga/effects';
import allEmailSaga from './allEmailSaga';

export default function* rootSaga() {
  yield all([allEmailSaga()]);
}
