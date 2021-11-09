
import { EMAIL } from '../constants';

const emailReducer = (state = [], action) => {
  if (action.type === EMAIL.LOAD_SUCCESS) {
    return action.emails;
  }

  return state;
};

export default emailReducer;
