import {
  RESET_MAP_OBJECT,
  UPDATE_MAP_OBJECT,
  UPDATE_STYLE_MAP,
} from "../../types/map";

const setMapStyle = (payload) => {
  return { type: UPDATE_STYLE_MAP, payload: payload };
};

const updateMapObject = (payload) => {
  return {
    type: UPDATE_MAP_OBJECT,
    payload: payload,
  };
};

const resetMapObject = () => {
  return {
    type: RESET_MAP_OBJECT,
  };
};

export { updateMapObject, resetMapObject, setMapStyle };
