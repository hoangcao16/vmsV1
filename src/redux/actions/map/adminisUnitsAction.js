import {
    FETCH_ALL_ADMINIS_UNITS_ON_MAP_FAILED,
    FETCH_ALL_ADMINIS_UNITS_ON_MAP,
    FETCH_ALL_ADMINIS_UNITS_ON_MAP_SUCCESS,
    ADD_ADMINIS_UNIT_ON_MAP,
    ADD_ADMINIS_UNIT_ON_MAP_FAILED,
    ADD_ADMINIS_UNIT_ON_MAP_SUCCESS,
    UPDATE_ADMINIS_UNIT_ON_MAP,
    UPDATE_ADMINIS_UNIT_ON_MAP_FAILED,
    UPDATE_ADMINIS_UNIT_ON_MAP_SUCCESS,
  } from "../../types/map";
  
  const fetchAllAdminisUnits = (payload) => {
    return { type: FETCH_ALL_ADMINIS_UNITS_ON_MAP, payload: payload }
  };
  
  const fetchAllAdminisUnitsSuccess = (payload) => {
    return {
        type: FETCH_ALL_ADMINIS_UNITS_ON_MAP_SUCCESS,
        payload: payload,
      }
  };
  const fetchAllAdminisUnitsFailed = (payload) => {
    return { type: FETCH_ALL_ADMINIS_UNITS_ON_MAP_FAILED, payload: payload }
  };
  
  // add new adminis unit on map
  const addAdminisUnitOnMap = (payload) => {
    return { type: ADD_ADMINIS_UNIT_ON_MAP, payload: payload }
  };
  
  const addAdminisUnitOnMapSuccess = (payload) => {
    return { type: ADD_ADMINIS_UNIT_ON_MAP_SUCCESS, payload: payload }
  };
  
  const addAdminisUnitOnMapFailed = (payload) => {
    return { type: ADD_ADMINIS_UNIT_ON_MAP_FAILED, payload: payload }
  };
  
  // update camera on map
  const updateAdminisUnitOnMap = (payload) => {
    return { type: UPDATE_ADMINIS_UNIT_ON_MAP, payload: payload }
  };
  
  const updateAdminisUnitOnMapSuccess = (payload) => {
    return { type: UPDATE_ADMINIS_UNIT_ON_MAP_SUCCESS, payload: payload }
  };
  
  const updateAdminisUnitOnMapFailed = (payload) => {
    return { type: UPDATE_ADMINIS_UNIT_ON_MAP_FAILED, payload: payload };
  };
  
  const deleteOneAdminisUnits = (payload) => {
    return { type: "UPDATE_CAMERA_ON_MAP", payload: payload };
  };
  
  const deleteAllAdminisUnits = (payload) => {
    return { type: "UPDATE_CAMERA_ON_MAP", payload: payload };
  };
  
  
  
  export {
    fetchAllAdminisUnits,
    fetchAllAdminisUnitsSuccess,
    fetchAllAdminisUnitsFailed,
    addAdminisUnitOnMap,
    addAdminisUnitOnMapSuccess,
    addAdminisUnitOnMapFailed,
    updateAdminisUnitOnMap,
    updateAdminisUnitOnMapSuccess,
    updateAdminisUnitOnMapFailed,
  };
  