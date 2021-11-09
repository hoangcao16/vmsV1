
export const SET_PLAYBACK_HLS_LIVE = 'SET_PLAYBACK_HLS_LIVE';
export const REMOVE_PLAYBACK_HLS_LIVE = 'REMOVE_PLAYBACK_HLS_LIVE';
export const REMOVE_ALL_PLAYBACK_HLS_LIVE = 'REMOVE_ALL_PLAYBACK_HLS_LIVE';
export const setPlayBackHlsLive = (payload) => {
    return {
        type: SET_PLAYBACK_HLS_LIVE,
        payload
    }
}

export const removePlayBackHlsLive = (payload) => {
    return {
        type: REMOVE_PLAYBACK_HLS_LIVE,
        payload
    }
}


export const removeAllPlayBackHlsLive = () => {
    return {
        type: REMOVE_ALL_PLAYBACK_HLS_LIVE,
    }
}