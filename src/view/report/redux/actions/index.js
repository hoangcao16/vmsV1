import { DATA_CHART } from "../constants";
import { isEmpty } from "lodash-es";

const loadDataChart = (params) => ({
  params: params,
  type: DATA_CHART.LOAD,
});

const setDataChart = (payload) => {
  return {
    type: DATA_CHART.LOAD_SUCCESS,
    dataChart: payload,
  };
};

const setError = (error) => ({
  type: DATA_CHART.LOAD_FAIL,
  error,
});

export { setDataChart, loadDataChart, setError };
