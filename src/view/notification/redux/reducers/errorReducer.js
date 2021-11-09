import { NOTIFICATION } from '../constants';

const errorReducer = (state = null, action) => {
  switch (action.type) {
    case NOTIFICATION.LOAD_FAIL:
      return action.error;
    case NOTIFICATION.LOAD:
    case NOTIFICATION.LOAD_SUCCESS:
      return null;

    default:
      return state;
  }
};

export default errorReducer;
