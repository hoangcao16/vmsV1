import { combineReducers } from 'redux';
import errorReducer from './errorReducer';
import loadingReducer from './loadingReducer';
import dataChartReducer from './dataChartReducer';
import changeTitleReducer from './changeTitleReducer';
import changeChartReducer from './changeChartReducer';
import dataTableChartReducers from "./dataTableChartReducers"

const rootReducer = combineReducers({
  isLoading: loadingReducer,
  chartData: dataChartReducer,
  dataTableChart: dataTableChartReducers,
  error: errorReducer,
  title: changeTitleReducer,
  typeChart: changeChartReducer,
});

export default rootReducer;
