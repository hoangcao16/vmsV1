import { PAGE } from '../constants';

const loadPage = (params) => ({
  params: params,
  type: PAGE.LOAD
});

const setPage = (pageCount) => ({
  type: PAGE.LOAD_SUCCESS,
  pageCount
});

const setError = (error) => ({
  type: PAGE.LOAD_FAIL,
  error
});

export { setPage, loadPage, setError };
