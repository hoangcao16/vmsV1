import { NOTIFICATION, PAGE } from '../constants';

const notificationReducer = (state = [], action) => {
  if (action.type === NOTIFICATION.LOAD_SUCCESS) {
    return [...state, ...action.notification];
  }

  if (action.type === PAGE.LOAD_SUCCESS) {
    return [];
  }
  return state;
};

export default notificationReducer;
