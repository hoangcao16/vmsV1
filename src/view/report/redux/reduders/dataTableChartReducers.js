import { TABLE_DATA_CHART } from "../constants";

const dataTableChartReducer = (state = { data: [], date: {} }, action) => {
  if (action.type === TABLE_DATA_CHART.LOAD_SUCCESS) {
    return {
      ...state,
      data: action.dataChart.res.payload,
      date: action.dataChart?.date
    };
  }
  return state;
};

export default dataTableChartReducer;
