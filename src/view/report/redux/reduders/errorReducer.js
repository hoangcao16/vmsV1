import { DATA_CHART } from '../constants';

const errorReducer = (state = null, action) => {
  switch (action.type) {
    case DATA_CHART.LOAD_FAIL:
      return action.error;
    case DATA_CHART.LOAD:
    case DATA_CHART.LOAD_SUCCESS:
      return null;

    default:
      return state;
  }
};

export default errorReducer;
