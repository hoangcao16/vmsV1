import { all } from 'redux-saga/effects';
import dataChartSaga from './dataChartSaga';

export default function* rootSaga() {
  yield all([dataChartSaga()]);
}
