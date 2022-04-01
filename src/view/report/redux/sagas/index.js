import { all } from 'redux-saga/effects';
import dataChartSaga from './dataChartSaga';
import dataTableChartSaga from './dataTableChartSaga';

export default function* rootSaga() {
  yield all([dataChartSaga(), dataTableChartSaga()]);
}
