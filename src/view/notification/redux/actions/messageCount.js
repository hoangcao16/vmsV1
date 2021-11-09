import { MESSAGE_COUNT } from '../constants';

const loadMessageCount = (params) => ({
  params: params,
  type: MESSAGE_COUNT.LOAD
});

const setMessageCount = (messageCount) => ({
  type: MESSAGE_COUNT.LOAD_SUCCESS,
  messageCount
});

const setError = (error) => ({
  type: MESSAGE_COUNT.LOAD_FAIL,
  error
});

export { setMessageCount, loadMessageCount, setError };
