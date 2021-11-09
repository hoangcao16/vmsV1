import {
    ADD_TRACKING_POINT_ON_MAP,
    ADD_TRACKING_POINT_ON_MAP_FAILED,
    ADD_TRACKING_POINT_ON_MAP_SUCCESS,
    DELETE_ALL_TRACKING_POINT_ON_MAP,
    DELETE_ALL_TRACKING_POINT_ON_MAP_FAILED,
    DELETE_ONE_TRACKING_POINT_ON_MAP,
    DELETE_ONE_TRACKING_POINT_ON_MAP_FAILED,
    DELETE_ONE_TRACKING_POINT_ON_MAP_SUCCESS,
    FETCH_ALL_TRACKING_POINT_ON_MAP,
    FETCH_ALL_TRACKING_POINT_ON_MAP_FAILED,
    FETCH_ALL_TRACKING_POINT_ON_MAP_SUCCESS,
    ADD_TRACKING_POINT,
    DELETE_TRACKING_POINT,
    UPDATE_CURRENT_LANG,
    SET_SELECTED_TRACKING_POINT,
    UPDATE_CAMERA_ON_MAP_BY_TRACKING_POINT,
    UPDATE_CAMERA_ON_MAP_BY_TRACKING_POINT_SUCCESS,
    UPDATE_CAMERA_ON_MAP_BY_TRACKING_POINT_FAILED,
    SET_TRACKING_POINTS_ON_MAP,
    UPDATE_TRACKING_POINT,
  } from "../../types/map";
  
  // fetch all tracking point on map
  const fetchAllTrackingPoint = (payload) => {
    return ({ type: FETCH_ALL_TRACKING_POINT_ON_MAP, payload: payload });
  };
  
  const fetchAllTrackingPointSuccess = (payload) => {
    return ({
        type: FETCH_ALL_TRACKING_POINT_ON_MAP_SUCCESS,
        payload: payload,
      });
  };
  const fetchAllTrackingPointFailed = (payload) => {
    return ({
        type: FETCH_ALL_TRACKING_POINT_ON_MAP_FAILED,
        payload: payload,
      });
  };
  
  const setTrackingPoints = (payload) => {
    return ({
        type: SET_TRACKING_POINTS_ON_MAP,
        payload: payload,
      });
  };
  
  const addNewTrackingPoint = (payload) => {
      return ({
          type: ADD_TRACKING_POINT,
          payload: payload,
        });
    };

    const updateTrackingPointAction = (payload) => {
      return ({
          type: UPDATE_TRACKING_POINT,
          payload: payload,
        });
    };
  
    const updateCurrentLang = (payload) => {
      return ({
          type: UPDATE_CURRENT_LANG,
          payload: payload,
        });
    };
  
  // add new tracking point on map
  const addTrackingPointOnMap = (payload) => {
    return ({ type: ADD_TRACKING_POINT_ON_MAP, payload: payload });
  };
  
  const addTrackingPointOnMapSuccess = (payload) => {
    return ({ type: ADD_TRACKING_POINT_ON_MAP_SUCCESS, payload: payload });
  };
  
  const addTrackingPointOnMapFailed = (payload) => {
    return ({ type: ADD_TRACKING_POINT_ON_MAP_FAILED, payload: payload });
  };
  
  // delete one tracking point  on map
  const deleteOneTrackingPoint = (payload) => {
    return ({ type: DELETE_ONE_TRACKING_POINT_ON_MAP, payload: payload });
  };
  
  // const deleteOneTrackingPointSuccess = (payload) => {
  //   return ({
  //       type: DELETE_ONE_TRACKING_POINT_ON_MAP_SUCCESS,
  //       payload: payload,
  //     });
  // };
  
  // const deleteOneTrackingPointFailed = (payload) => {
  //   return ({
  //       type: DELETE_ONE_TRACKING_POINT_ON_MAP_FAILED,
  //       payload: payload,
  //     });
  // };
  
  // delete all tracking point  on map
  const deleteAllTrackingPoint = (payload) => {
    return ({ type: DELETE_ALL_TRACKING_POINT_ON_MAP, payload: payload });
  };
  
  // const deleteAllTrackingPointSuccess = (payload) => {
  //   return ({
  //       type: DELETE_ONE_TRACKING_POINT_ON_MAP_SUCCESS,
  //       payload: payload,
  //     });
  // };
  
  // const deleteAllTrackingPointFailed = (payload) => {
  //   return ({
  //       type: DELETE_ALL_TRACKING_POINT_ON_MAP_FAILED,
  //       payload: payload,
  //     });
  // };

  const setSelectedTrackingPoint = (payload) => {
    return ({
        type: SET_SELECTED_TRACKING_POINT,
        payload: payload,
      });
  };

  // update camera on map by tacking point
const updateCameraOnMapByTrackingPoint = (payload) => {
  return {
      type: UPDATE_CAMERA_ON_MAP_BY_TRACKING_POINT,
      payload: payload,
    }
};

const updateCameraOnMapByTrackingPointSuccess = (payload) => {
  return {
      type: UPDATE_CAMERA_ON_MAP_BY_TRACKING_POINT_SUCCESS,
      payload: payload,
    }
};
const updateCameraOnMapByTrackingPointFailed = (payload) => {
  return {
      type: UPDATE_CAMERA_ON_MAP_BY_TRACKING_POINT_FAILED,
      payload: payload,
    }
};
  
  export {
    fetchAllTrackingPoint,
    fetchAllTrackingPointSuccess,
    fetchAllTrackingPointFailed,
    addTrackingPointOnMap,
    addTrackingPointOnMapSuccess,
    addTrackingPointOnMapFailed,
    deleteAllTrackingPoint,
    // deleteAllTrackingPointSuccess,
    // deleteAllTrackingPointFailed,
    deleteOneTrackingPoint,
    // deleteOneTrackingPointSuccess,
    // deleteOneTrackingPointFailed,
    addNewTrackingPoint,
    updateCurrentLang,
    setSelectedTrackingPoint,
    updateCameraOnMapByTrackingPoint,
    updateCameraOnMapByTrackingPointSuccess,
    updateCameraOnMapByTrackingPointFailed,
    setTrackingPoints,
    updateTrackingPointAction
  };
  