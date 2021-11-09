import {
    FETCH_ALL_BOOKMARK,
    FETCH_ALL_BOOKMARK_SUCCESS,
    FETCH_ALL_BOOKMARK_FAILED,
} from "../../types/bookmark";

// fetch list camera on map
const fetchBookmark = (payload = {}) => {
    return { type: FETCH_ALL_BOOKMARK, payload: payload }
};

const fetchBookmarkSuccess = (payload) => {
    return { type: FETCH_ALL_BOOKMARK_SUCCESS, payload: payload }
};

const fetchBookmarkFailed = (payload) => {
    return { type: FETCH_ALL_BOOKMARK_FAILED, payload: payload }
};
