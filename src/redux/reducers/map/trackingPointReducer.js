import {
  LAT_LNG,
  TRACKING_POINTS,
} from "../../../view/common/vms/constans/map";
import cloneDeep from "lodash/cloneDeep"
import {
  FETCH_ALL_TRACKING_POINT_ON_MAP,
  FETCH_ALL_TRACKING_POINT_ON_MAP_FAILED,
  FETCH_ALL_TRACKING_POINT_ON_MAP_SUCCESS,
  ADD_TRACKING_POINT,
  UPDATE_CURRENT_LANG,
  UPDATE_CAMERA_ON_MAP_BY_TRACKING_POINT,
  UPDATE_CAMERA_ON_MAP_BY_TRACKING_POINT_SUCCESS,
  UPDATE_CAMERA_ON_MAP_BY_TRACKING_POINT_FAILED,
  SET_SELECTED_TRACKING_POINT,
  DELETE_ONE_TRACKING_POINT_ON_MAP,
  SET_TRACKING_POINTS_ON_MAP,
  DELETE_ALL_TRACKING_POINT_ON_MAP,
  UPDATE_TRACKING_POINT
} from "../../types/map";

const initialState = {
  listCamByTrackingPoint: [],
  metadata: {},
  trackingPoints: localStorage.getItem(TRACKING_POINTS)
    ? JSON.parse(localStorage.getItem(TRACKING_POINTS) || "[]")
    : [],
  currentLang: LAT_LNG,
  selectedTrackPoint: null,
  isLoading: false,
  errors: null,
};

const trackingPointMapReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TRACKING_POINTS_ON_MAP: {
      return { ...state, trackingPoints: action.payload };
    }

    case FETCH_ALL_TRACKING_POINT_ON_MAP: {
      return { ...state, listCamByTrackingPoint: [], metadata: {}, isLoading: true };
    }
    case FETCH_ALL_TRACKING_POINT_ON_MAP_SUCCESS: {
      return { ...state, ...action.payload, isLoading: false };
    }

    case FETCH_ALL_TRACKING_POINT_ON_MAP_FAILED: {
      return {
        ...state,
        listCamByTrackingPoint: [],
        metadata: {},
        isLoading: false,
      };
    }

    case ADD_TRACKING_POINT: {
      return {
        ...state,
        trackingPoints: [...state.trackingPoints, action.payload],
      };
    }
    case UPDATE_TRACKING_POINT: {
      const cloneTrackingPoints = cloneDeep(state.trackingPoints);
      cloneTrackingPoints.forEach((trackPoint, index) => {
        if (trackPoint.id === action.payload.id) {
          cloneTrackingPoints[index] = { ...action.payload };
        }
      })
      localStorage.setItem(TRACKING_POINTS, JSON.stringify(cloneTrackingPoints));
      return {
        ...state,
        trackingPoints: [...cloneTrackingPoints],
      };
    }
    case UPDATE_CURRENT_LANG: {
      return { ...state, currentLang: action.payload };
    }
    case UPDATE_CAMERA_ON_MAP_BY_TRACKING_POINT: {
      return { ...state, isLoading: true };
    }

    case UPDATE_CAMERA_ON_MAP_BY_TRACKING_POINT_SUCCESS: {
      return {
        ...state,
        listCamByTrackingPoint: action.payload,
        isLoading: false,
      };
    }

    case UPDATE_CAMERA_ON_MAP_BY_TRACKING_POINT_FAILED: {
      return { ...state, isLoading: false };
    }

    case DELETE_ONE_TRACKING_POINT_ON_MAP: {
      const selectedPoint = action.payload;
      const camFilterByTrackPoint = state.listCamByTrackingPoint.filter(cam => !(cam.trackingPointId === selectedPoint.id));
      const trackingPointFilter = state.trackingPoints.filter(point => !(point.id === selectedPoint.id));
      localStorage.setItem(TRACKING_POINTS, JSON.stringify(trackingPointFilter))
      return {
        ...state,
        listCamByTrackingPoint: [...camFilterByTrackPoint],
        trackingPoints: [...trackingPointFilter],
        selectedTrackPoint: null,
      };
    }

    case DELETE_ALL_TRACKING_POINT_ON_MAP: {
      localStorage.removeItem(TRACKING_POINTS)
      return {
        ...state,
        listCamByTrackingPoint: [],
        trackingPoints: [],
        selectedTrackPoint: null,
      };
    }

    case SET_SELECTED_TRACKING_POINT: {
      return { ...state, selectedTrackPoint: action.payload }
    }

    default: {
      return state;
    }
  }
};

export default trackingPointMapReducer;
