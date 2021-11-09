import { DATA_CHART } from '../constants';

const dataChartReducer = (state = [], action) => {
  if (action.type === DATA_CHART.LOAD_SUCCESS) {
    return action.dataChart;
  }
  return state;
};

export default dataChartReducer;
