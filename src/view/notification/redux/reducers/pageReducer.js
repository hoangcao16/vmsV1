import { NOTIFICATION, PAGE } from '../constants';

const pageReducer = (state = 0, action) => {
  switch (action.type) {
    case NOTIFICATION.LOAD_SUCCESS:
      return state + 1;
    case PAGE.LOAD_SUCCESS:
      return 0;
    default:
      return state;
  }
};

export default pageReducer;
