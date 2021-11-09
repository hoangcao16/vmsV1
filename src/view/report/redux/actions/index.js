import { DATA_CHART } from '../constants';

const loadDataChart = (params) => ({
  params: params,
  type: DATA_CHART.LOAD
});

const setDataChart = (dataChart) => ({
  type: DATA_CHART.LOAD_SUCCESS,
  dataChart
});

const setError = (error) => ({
  type: DATA_CHART.LOAD_FAIL,
  error
});

export { setDataChart, loadDataChart, setError };
