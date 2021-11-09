import { DATA_CHART } from '../constants';

const loadingReducer = (state = false, action) => {
  switch (action.type) {
    case DATA_CHART.LOAD:
      return true;
    case DATA_CHART.LOAD_SUCCESS:
      return false;
    case DATA_CHART.LOAD_FAIL:
      return false;

    default:
      return state;
  }
};

export default loadingReducer;
