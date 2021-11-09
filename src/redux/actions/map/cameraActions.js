import {
  FETCH_ALL_CAMERA_ON_MAP,
  UPDATE_CAMERA_ON_MAP,
  CAMERA_APP_FILTER,
  FETCH_ALL_CAMERA_ON_MAP_SUCCESS,
  FETCH_ALL_CAMERA_ON_MAP_FAILED,
  UPDATE_CAMERA_ON_MAP_BY_FILTER_SUCCESS,
  UPDATE_CAMERA_ON_MAP_BY_FILTER,
  UPDATE_CAMERA_ON_MAP_FAILED,
  UPDATE_CAMERA_ON_MAP_SUCCESS,
  ADD_CAMERA_ON_MAP,
  ADD_CAMERA_ON_MAP_SUCCESS,
  ADD_CAMERA_ON_MAP_FAILED,
  UPDATE_CAMERA_ON_MAP_BY_FILTER_FAILED
} from "../../types/map";


const cameraWithApplyFilter = (payload) => {
  return { type: CAMERA_APP_FILTER, payload: payload }
};

// fetch list camera on map
const fetchAllCameraOnMap = (payload = {}) => {
  return { type: FETCH_ALL_CAMERA_ON_MAP, payload: payload }
};

const fetchAllCameraOnMapSuccess = (payload) => {
  return { type: FETCH_ALL_CAMERA_ON_MAP_SUCCESS, payload: payload }
};

const fetchAllCameraOnMapFailed = (payload) => {
  return { type: FETCH_ALL_CAMERA_ON_MAP_FAILED, payload: payload }
};

// add new camera on map
const addCameraOnMap = (payload) => {
  return { type: ADD_CAMERA_ON_MAP, payload: payload }
};

const addCameraOnMapSuccess = (payload) => {
  return { type: ADD_CAMERA_ON_MAP_SUCCESS, payload: payload }
};

const addCameraOnMapFailed = (payload) => {
  return { type: ADD_CAMERA_ON_MAP_FAILED, payload: payload }
};

// update camera on map
const updateCameraOnMap = (payload) => {
  return { type: UPDATE_CAMERA_ON_MAP, payload: payload }
};

const updateCameraOnMapSuccess = (payload) => {
  return { type: UPDATE_CAMERA_ON_MAP_SUCCESS, payload: payload }
};

const updateCameraOnMapFailed = (payload) => {
  return { type: UPDATE_CAMERA_ON_MAP_FAILED, payload: payload }
};
const updateCameraOnMapOnlineByFilter = (payload) => {
  return dispatch => dispatch({type: "UPDATE_CAMERA_ON_MAP", payload: payload})
}


// update camera on map by filter
const updateCameraOnMapByFilter = (payload) => {
  return { type: UPDATE_CAMERA_ON_MAP_BY_FILTER, payload: payload }
};

const updateCameraOnMapByFilterSuccess = (payload) => {
  return {
      type: UPDATE_CAMERA_ON_MAP_BY_FILTER_SUCCESS,
      payload: payload,
    }
};

const updateCameraOnMapByFilterFailed = (payload) => {
  return { type: UPDATE_CAMERA_ON_MAP_BY_FILTER_FAILED, payload: payload }
};





export {
  cameraWithApplyFilter,
  updateCameraOnMap,
  updateCameraOnMapSuccess,
  updateCameraOnMapFailed,
  updateCameraOnMapOnlineByFilter,
  updateCameraOnMapByFilter,
  updateCameraOnMapByFilterSuccess,
  updateCameraOnMapByFilterFailed,
  fetchAllCameraOnMap,
  fetchAllCameraOnMapSuccess,
  fetchAllCameraOnMapFailed,
  addCameraOnMap,
  addCameraOnMapSuccess,
  addCameraOnMapFailed
};
