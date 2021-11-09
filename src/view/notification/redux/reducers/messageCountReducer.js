import { MESSAGE_COUNT } from '../constants';

const messageCountReducer = (state = 0, action) => {

  if (action.type === MESSAGE_COUNT.LOAD_SUCCESS) {
    return action.messageCount;
  }
  return state;
};

export default messageCountReducer;
