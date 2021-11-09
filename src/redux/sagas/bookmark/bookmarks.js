import { call, put, takeLatest, select, all } from 'redux-saga/effects';
import { FETCH_ALL_BOOKMARK, FETCH_ALL_BOOKMARK_SUCCESS, FETCH_ALL_BOOKMARK_FAILED } from '../../types/bookmarks'
import { NOTYFY_TYPE, STATUS_CODE } from '../../../view/common/vms/Constant';
import mapActions from '../../actions/bookmark';
import Notification from "../../../components/vms/notification/Notification"
import bookmarkApi from "../../../api/controller-api/bookmarkApi";

const { fetchBookmarkSuccess, fetchBookmarkFailed } = mapActions;

export function* fetchListBookmarkAction(action) {
    // const notifyMess = {
    //     type: NOTYFY_TYPE.success,
    //     title: 'Màn hình ưa thích',
    //     description: 'Áp dụng bộ lọc camera thành công'
    // }
    try {
        const { params } = action.payload;
        const resp = yield call(bookmarkApi.getAll, params);
        if (resp && resp.payload) {
            const { code, payload, metadata } = resp;
            yield put(fetchBookmarkSuccess({ bookmarks: payload, metadata }));
            // Notification(notifyMess);
        } else {
            yield put(fetchBookmarkFailed(null))
        }
    } catch (error) {
        if (error.response && error.response.data && error.response.data.errors) {
            // notifyMess.type = NOTYFY_TYPE.warning;
            // notifyMess.description = error.response.data.errors.message || 'something is wrong from server side'
            // Notification(notifyMess);
        }
    }
}


export default function* watchBookmarkSaga() {
    yield all([
        yield takeLatest(FETCH_ALL_BOOKMARK, fetchListBookmarkAction),
    ])
}
