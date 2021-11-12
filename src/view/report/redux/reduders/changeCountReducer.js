import { CHANGE_COUNT } from '../constants';

const changeCountReducer = (state = 1, action) => {
  switch (action.type) {
    case CHANGE_COUNT.LOAD_SUCCESS:
      return action.data;
    default:
      return state;
  }
};

export default changeCountReducer;
