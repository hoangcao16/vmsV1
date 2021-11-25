import { TAGS } from '../constants';

const tagsReducer = (state = [], action) => {

  if (action.type === TAGS.LOAD_SUCCESS) {
    return action.tagsData;
  }

  return state;
};

export default tagsReducer;
