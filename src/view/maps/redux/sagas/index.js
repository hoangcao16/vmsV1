import { all } from "redux-saga/effects";
import tagsSaga from "./tagsSaga";
import listCameraTagsSaga from "./listCameraTagsSaga";

export default function* rootSaga() {
  yield all([tagsSaga(), listCameraTagsSaga()]);
}
