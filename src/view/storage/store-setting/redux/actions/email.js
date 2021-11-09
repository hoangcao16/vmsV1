import { EMAIL } from '../constants';

const loadAllEmails = (params) => ({
  params: params,
  type: EMAIL.LOAD
});

const setEmails = (emails) => ({
  type: EMAIL.LOAD_SUCCESS,
  emails
});

const setError = (error) => ({
  type: EMAIL.LOAD_FAIL,
  error
});

export { setEmails, loadAllEmails, setError };
