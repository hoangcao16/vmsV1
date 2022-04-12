import { DATA_CHART } from "../constants";

const dataChartReducer = (state = { data: [], percent: {} }, action) => {
  if (action.type === DATA_CHART.LOAD_SUCCESS) {
    console.log("Save scucesss");
    return {
      ...state,
      data: action.dataChart,
      date: action.dataChart,
      percent: action.dataChart,
    };
  }
  return state;
};

export default dataChartReducer;
