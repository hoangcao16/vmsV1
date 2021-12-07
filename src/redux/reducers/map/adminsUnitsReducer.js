import {
  ADD_ADMINIS_UNIT_ON_MAP,
  ADD_ADMINIS_UNIT_ON_MAP_FAILED,
  ADD_ADMINIS_UNIT_ON_MAP_SUCCESS,
  FETCH_ALL_ADMINIS_UNITS_ON_MAP,
  FETCH_ALL_ADMINIS_UNITS_ON_MAP_SUCCESS,
  FETCH_ALL_CAMERA_ON_MAP_FAILED,
  UPDATE_ADMINIS_UNIT_ON_MAP,
  UPDATE_ADMINIS_UNIT_ON_MAP_FAILED,
  UPDATE_ADMINIS_UNIT_ON_MAP_SUCCESS,
} from "../../types/map";

const initialState = {
  listAdminisUnit: [],
  metadata: {},
  adminisUnitditting: null,
  isLoading: false,
  errors: null,
};

const adminisUnitsonMapReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ALL_ADMINIS_UNITS_ON_MAP: {
      return { ...state, listAdminisUnit: [], metadata: {}, isLoading: true };
    }
    case FETCH_ALL_ADMINIS_UNITS_ON_MAP_SUCCESS: {
      return { ...state, ...action.payload, isLoading: false };
    }

    case FETCH_ALL_CAMERA_ON_MAP_FAILED: {
      return { ...state, listAdminisUnit: [], metadata: {}, isLoading: false };
    }
    case UPDATE_ADMINIS_UNIT_ON_MAP: {
      return { ...state, isLoading: true };
    }

    case UPDATE_ADMINIS_UNIT_ON_MAP_SUCCESS: {
      const editedAdUnit = action.payload;
      const { listAdminisUnit } = state;
      const index = listAdminisUnit.findIndex(
        (item) => item.id === editedAdUnit.id
      );
      if (index !== -1) {
        const newList = [
          ...listAdminisUnit.slice(0, index),
          editedAdUnit,
          ...listAdminisUnit.slice(index + 1),
        ];
        return {
          ...state,
          listAdminisUnit: [...newList],
          isLoading: false,
        };
      }
      return {
        ...state,
      };
    }

    case UPDATE_ADMINIS_UNIT_ON_MAP_FAILED: {
      return { ...state, isLoading: false };
    }

    case ADD_ADMINIS_UNIT_ON_MAP: {
      return { ...state, isLoading: false };
    }

    case ADD_ADMINIS_UNIT_ON_MAP_SUCCESS: {
      const newAdUnit = action.payload;
      return {
        ...state,
        listAdminisUnit: [newAdUnit, ...state.listAdminisUnit],
        isLoading: false,
      };
    }
    case ADD_ADMINIS_UNIT_ON_MAP_FAILED: {
      return { ...state, isLoading: false };
    }
    default: {
      return state;
    }
  }
};

export default adminisUnitsonMapReducer;
