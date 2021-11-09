import { combineReducers } from 'redux';
import errorReducer from './errorReducer';
import loadingReducer from './loadingReducer';
import treeCamGroupReducer from './treeCamGroupReducer';

const rootReducer = combineReducers({
  isLoading: loadingReducer,
  treeData: treeCamGroupReducer,
  error: errorReducer
});

export default rootReducer;
