import { DATA_CHART } from "../constants";

const dataChartReducer = (state = { data: []}, action) => {
  if (action.type === DATA_CHART.LOAD_SUCCESS) {
    return {
      ...state,
      data: action.dataChart,
    };
  }
  return state;
};

export default dataChartReducer;
