import { DATA_CHART } from "../constants";

const dataChartReducer = (state = { data: [], dataPieChart: [] }, action) => {
  if (action.type === DATA_CHART.LOAD_SUCCESS) {
    return {
      ...state,
      data: action.dataChart.chartEvents,
      dataPieChart: action.dataChart.percents,
    };
  }
  return state;
};

export default dataChartReducer;
