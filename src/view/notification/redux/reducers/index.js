import { combineReducers } from 'redux';
import errorReducer from './errorReducer';
import loadingReducer from './loadingReducer';
import notificationReducer from './notificationReduder';
import messageCountReducer from './messageCountReducer';
import pageReducer from './pageReducer';
import total from './totalNotif'

const rootReducer = combineReducers({
  isLoading: loadingReducer,
  notif: notificationReducer,
  error: errorReducer,
  messageCount: messageCountReducer,
  nextPage: pageReducer,
  total: total
});

export default rootReducer;
