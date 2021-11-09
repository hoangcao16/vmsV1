import {
    SET_CAMS_LIVE,
    REMOVE_CAM_LIVE,
    UPDATE_CAM_LIVE,
    NOT_PERMISSION_VIEW_CAM,
    REMOVE_ALL_CAM_LIVE,
    PLAYBACK_SEEK_TIME,
    NOT_OPERATION_VIEW_CAM,
    SELECT_OR_DESELECT_CAMERA_LIVE,
    DESELECT_CAMERA_LIVE, SET_PLAYBACK_HLS, GET_LIST_CAM_LIVE, GET_LIST_CAM_LIVE_SUCCESS, GET_LIST_CAM_LIVE_ERROR, SAVE_LIST_CAM_LIVE, SAVE_LIST_CAM_LIVE_SUCCESS, SAVE_LIST_CAM_LIVE_ERROR, UPDATE_LIST_CAM_LIVE, UPDATE_LIST_CAM_LIVE_SUCCESS, UPDATE_LIST_CAM_LIVE_ERROR, DELETE_LIST_CAM_LIVE, DELETE_LIST_CAM_LIVE_SUCCESS, DELETE_LIST_CAM_LIVE_ERROR,
  } from "../../types/map";
  

  const setCamsLiveOnMap = (payload) => {
    return { type: SET_CAMS_LIVE, payload: payload }
  };
  
  const removeCamLiveOnMap = (payload) => {
    return { type: REMOVE_CAM_LIVE, payload: payload }
  };
  
  const updatePlayCamLive = (payload) => {
    return { type: UPDATE_CAM_LIVE, payload: payload }
  };
  
  const updatePlayBackCam = (payload) => {
    return { type: updatePlayBackCam, payload: payload }
  };
  
  const viewCamIsNotPermission = (payload) => {
    return { type: NOT_PERMISSION_VIEW_CAM, payload: payload }
  };
  
  const viewCamIsNotOperation = (payload) => {
    return { type: NOT_OPERATION_VIEW_CAM, payload: payload }
  };
  
  
  const removeAllCamLiveOnMap = (payload) => {
    return { type: REMOVE_ALL_CAM_LIVE, payload: payload }
  };
  
  const selectOrDeSelectCamLiveOnMap = (payload) => {
    return { type: SELECT_OR_DESELECT_CAMERA_LIVE, payload: payload }
  };
  
  const deSelectCamLiveOnMap = (payload) => {
    return { type: DESELECT_CAMERA_LIVE, payload: payload }
  };
  
  const setPlaybackHls = (payload) => {
    return { type: SET_PLAYBACK_HLS, payload: payload }
  };
  
  const seekPlaybackOnMap = (payload) => {
    return { type: PLAYBACK_SEEK_TIME, payload: payload }
  };
  
  const getListCamLive = (params) => {
    return {
      type: GET_LIST_CAM_LIVE,
      params
    }
  }
  
  const getListCamLiveSuccess = (payload) => {
    return {
      type: GET_LIST_CAM_LIVE_SUCCESS,
      payload
    }
  }
  const getListCamLiveError = (payload) => {
    return {
      type: GET_LIST_CAM_LIVE_ERROR,
      payload
    }
  }
  const saveListCamLive = (payload) => {
    return {
      type: SAVE_LIST_CAM_LIVE,
      payload
    }
  }
  const saveListCamLiveSuccess = () => {
    return {
      type: SAVE_LIST_CAM_LIVE_SUCCESS
    }
  }
  const saveListCamLiveError = (payload) => {
    return {
      type: SAVE_LIST_CAM_LIVE_ERROR,
      payload
    }
  }
  
  const updateListCamLive = (payload, id) => {
    return {
      type: UPDATE_LIST_CAM_LIVE,
      payload,
      id
    }
  }
  const updateListCamLiveSuccess = () => {
    return {
      type: UPDATE_LIST_CAM_LIVE_SUCCESS
    }
  }
  const updateListCamLiveError = (payload) => {
    return {
      type: UPDATE_LIST_CAM_LIVE_ERROR,
      payload
    }
  }

  const deleteListCamLive = (id) => {
    return {
      type: DELETE_LIST_CAM_LIVE,
      id
    }
  }
  const deleteListCamLiveSuccess = () => {
    return {
      type: DELETE_LIST_CAM_LIVE_SUCCESS
    }
  }
  const deleteListCamLiveError = (payload) => {
    return {
      type: DELETE_LIST_CAM_LIVE_ERROR,
      payload
    }
  }
  
  
  
  
  export {
    setCamsLiveOnMap,
    removeCamLiveOnMap,
    updatePlayCamLive,
    viewCamIsNotPermission,
    removeAllCamLiveOnMap,
    selectOrDeSelectCamLiveOnMap,
    deSelectCamLiveOnMap,
    seekPlaybackOnMap,
    viewCamIsNotOperation,
    setPlaybackHls,
    updatePlayBackCam,
    getListCamLive,
    getListCamLiveSuccess,
    getListCamLiveError,
    saveListCamLive,
    saveListCamLiveSuccess,
    saveListCamLiveError,
    updateListCamLive,
    updateListCamLiveSuccess,
    updateListCamLiveError,
    deleteListCamLive,
    deleteListCamLiveSuccess,
    deleteListCamLiveError
  };
  