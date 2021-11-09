import { NOTIFICATION } from '../constants';

const loadNotification = (params) => ({
  params: params,
  type: NOTIFICATION.LOAD
});

const setNotification = (notification) => ({
  type: NOTIFICATION.LOAD_SUCCESS,
  notification
});

const setError = (error) => ({
  type: NOTIFICATION.LOAD_FAIL,
  error
});

export { setNotification, loadNotification, setError };
