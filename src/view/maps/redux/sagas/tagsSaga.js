import { call, put, takeLatest } from "redux-saga/effects";
import TagApi from "../../../../actions/api/tag";
import { setError, setTags } from "../actions/tagsActions";
import { TAGS } from "../constants";

export function* handleTagsLoad(action) {
  try {
    const tags = yield call(() => TagApi.getAllTags());

    const tagsConvert = tags.map((t)=> t.key)
    
    yield put(setTags(tagsConvert));
  } catch (error) {
    yield put(setError(error.toString()));
  }
}

export default function* watchTagsLoad() {
  yield takeLatest(TAGS.LOAD, handleTagsLoad);
}
