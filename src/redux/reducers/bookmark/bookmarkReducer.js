import {
    FETCH_ALL_BOOKMARK,
    FETCH_ALL_BOOKMARK_SUCCESS,
    FETCH_ALL_BOOKMARK_FAILED
} from "../../types/bookmarks";


const initialState = {
    bookmarks: [],
};


const bookmarkReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_ALL_BOOKMARK: {
            return {...state, listCamera: [], metadata: {}, isLoading: true};
        }

        case FETCH_ALL_BOOKMARK_SUCCESS: {
            return {...state, ...action.payload, isLoading: false};
        }

        case FETCH_ALL_BOOKMARK_FAILED: {
            return {...state, listCamera: [], metadata: {}, isLoading: false};
        }
    }
};

export default bookmarkReducer;
