import { TOTAL_NOTIF } from '../constants';

const total = (state = 0, action) => {
  switch (action.type) {
    case TOTAL_NOTIF.LOAD_SUCCESS:
      return action.total;
    default:
      return state;
  }
};

export default total;
