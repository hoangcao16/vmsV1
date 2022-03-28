import { CHANGE_CHART } from "../constants";

const changeChart = (data) => ({
  type: CHANGE_CHART.LOAD_SUCCESS,
  data,
});

export { changeChart };
