import { DATA_CHART, TABLE_DATA_CHART } from "../constants";

const loadDataChart = (params) => ({
  params: params,
  type: DATA_CHART.LOAD,
});

const loadTableDataChart = (params) => ({
  params: params,
  type: TABLE_DATA_CHART.LOAD,
});

const setDataChart = (payload) => {
  return {
    type: DATA_CHART.LOAD_SUCCESS,
    dataChart: payload,
  };
};

const setTableDataChart = (payload) => {
  return {
    type: TABLE_DATA_CHART.LOAD_SUCCESS,
    dataChart: payload,
  };
};

const setError = (error) => ({
  type: DATA_CHART.LOAD_FAIL,
  error,
});

const setTableDataError = (error) => ({
  type: TABLE_DATA_CHART.LOAD_FAIL,
  error,
});

export {
  setDataChart,
  loadDataChart,
  setError,
  setTableDataChart,
  loadTableDataChart,
  setTableDataError,
};
