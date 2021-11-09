import { CHANGE_TITLE } from '../constants';

const changeTitleReducer = (state = '', action) => {
  switch (action.type) {
    case CHANGE_TITLE.LOAD_SUCCESS:
      return action.dataTitle;
    default:
      return state;
  }
};

export default changeTitleReducer;
