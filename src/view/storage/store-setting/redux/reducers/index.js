import { combineReducers } from 'redux';
import errorReducer from './errorReducer';
import loadingReducer from './loadingReducer';
import allEmailReducer from './allEmailReducer';
import emailReducer from './email';

const rootReducer = combineReducers({
  isLoading: loadingReducer,
  allEmails: allEmailReducer,
  error: errorReducer,
  emails:emailReducer
});

export default rootReducer;
