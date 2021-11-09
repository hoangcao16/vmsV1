import { all } from 'redux-saga/effects';
import dataChartSaga from './dataChartSaga';

export default function* rootSaga() {
  console.log('saga');
  yield all([dataChartSaga()]);
}
