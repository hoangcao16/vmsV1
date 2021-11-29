import { TAGS } from '../constants';

const loadTags = (params) => ({
  params: params,
  type: TAGS.LOAD
});

const setTags = (tagsData) => ({
  type: TAGS.LOAD_SUCCESS,
  tagsData
});

const setError = (error) => ({
  type: TAGS.LOAD_FAIL,
  error
});

export { setTags, loadTags, setError };
