import { combineReducers } from 'redux';
import errorReducer from './errorReducer';
import loadingReducer from './loadingReducer';
import dataChartReducer from './dataChartReducer';
import changeTitleReducer from './changeTitleReducer';
import changeChartReducer from './changeChartReducer';

const rootReducer = combineReducers({
  isLoading: loadingReducer,
  chartData: dataChartReducer,
  error: errorReducer,
  title: changeTitleReducer,
  isShowLineAndPieChart: changeChartReducer
});

export default rootReducer;
