import { CAMERA_TAGS } from '../constants';

const cameraTagsReducer = (state = [], action) => {

  if (action.type === CAMERA_TAGS.LOAD_SUCCESS) {
    return action.cameraTagsData;
  }

  return state;
};

export default cameraTagsReducer;
