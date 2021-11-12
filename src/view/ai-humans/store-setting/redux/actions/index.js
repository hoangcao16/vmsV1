import { ALL_EMAIL } from '../constants';

const loadAllEmail = (params) => ({
  params: params,
  type: ALL_EMAIL.LOAD
});

const setAllEmail = (emails) => ({
  type: ALL_EMAIL.LOAD_SUCCESS,
  emails
});

const setError = (error) => ({
  type: ALL_EMAIL.LOAD_FAIL,
  error
});

export { setAllEmail, loadAllEmail, setError };
