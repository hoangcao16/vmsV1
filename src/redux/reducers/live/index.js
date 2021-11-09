import { REMOVE_ALL_PLAYBACK_HLS_LIVE, REMOVE_PLAYBACK_HLS_LIVE, SET_PLAYBACK_HLS_LIVE } from "../../actions/live"

let initialState = {
    listPlayBack: []
}

const liveReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_PLAYBACK_HLS_LIVE:
            return { ...state, listPlayBack: [...state.listPlayBack, action.payload] }
        case REMOVE_PLAYBACK_HLS_LIVE:
            const cloneListHls = [...state.listPlayBack].filter((cam, _) => cam.uuid !== action.payload.uuid)

            return { ...state, listPlayBack: [...cloneListHls] }
        case REMOVE_ALL_PLAYBACK_HLS_LIVE:
            return { ...state, listPlayBack: [] }
        default:
            return { ...state }
    }
}
export default liveReducer
