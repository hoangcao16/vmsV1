import { CHANGE_COUNT } from '../constants';

const changeCount = (data) => ({
  type: CHANGE_COUNT.LOAD_SUCCESS,
  data
});

export { changeCount };
