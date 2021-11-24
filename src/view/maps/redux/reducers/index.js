import { combineReducers } from 'redux';
import errorReducer from './errorReducer';
import loadingReducer from './loadingReducer';
import tagsReducer from './tagsReducer';
import listCameraTagsReducer from './listCameraTagsReducer';

const rootReducer = combineReducers({
  isLoading: loadingReducer,
  tags: tagsReducer,
  error: errorReducer,
  cameraTags:listCameraTagsReducer
});

export default rootReducer;
