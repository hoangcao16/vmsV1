import { MESSAGE_UNREAD } from '../constants';

const loadMessageUnread = (params) => ({
  params: params,
  type: MESSAGE_UNREAD.LOAD
});

const setMessageUnread = (messageCount) => ({
  type: MESSAGE_UNREAD.LOAD_SUCCESS,
  messageCount
});

const setError = (error) => ({
  type: MESSAGE_UNREAD.LOAD_FAIL,
  error
});

export { setMessageUnread, loadMessageUnread, setError };
