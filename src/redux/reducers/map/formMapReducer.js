import {
  UPDATE_MAP_OBJECT,
  UPDATE_STYLE_MAP,
  RESET_MAP_OBJECT,
} from "../../types/map";
import { STYLE_MODE } from "../../../view/common/vms/constans/map";

const initialState = {
  selectedPos: false,
  isOpenForm: false,
  formEditting: null,
  editMode: false,
  actionType: "",
  selectedMapStyle: STYLE_MODE.normal,
  isEditForm: false, 
};

const formMapReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_MAP_OBJECT: {
      console.log('update:',{ ...state, ...action.payload } )
      return { ...state, ...action.payload };
    }

    case RESET_MAP_OBJECT: {
      return {
        selectedPos: false,
        isOpenForm: false,
        formEditting: null,
        editMode: false,
        actionType: "",
        selectedMapStyle: STYLE_MODE.normal,
        isEditForm: false,
      };
    }

    case UPDATE_STYLE_MAP: {
      return { ...state, selectedMapStyle: action.payload };
    }
    default: {
      return state;
    }
  }
};

export default formMapReducer;
