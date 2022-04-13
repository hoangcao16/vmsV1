import { CHANGE_CHART } from "../constants";

const changeChartReducer = (state = [], action) => {
  switch (action.type) {
    case CHANGE_CHART.LOAD_SUCCESS:
      return action.data;
    default:
      return state;
  }
};

export default changeChartReducer;
