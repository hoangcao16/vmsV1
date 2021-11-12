import { ALL_EMAIL } from '../constants';

const allEmailReducer = (state = [], action) => {
  if (action.type === ALL_EMAIL.LOAD_SUCCESS) {
    return action.emails;
  }

  return state;
};

export default allEmailReducer;
