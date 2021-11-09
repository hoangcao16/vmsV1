import { CHANGE_TITLE } from '../constants';

const changeTitle = (dataTitle) => ({
  type: CHANGE_TITLE.LOAD_SUCCESS,
  dataTitle
});

export { changeTitle };
