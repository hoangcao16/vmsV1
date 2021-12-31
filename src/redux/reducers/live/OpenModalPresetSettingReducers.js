import { OPENMODALPRESETSETTING } from "../../types/live";

const openModalPresetSetting = (state = false, action) => {
  switch (action.type) {
    case OPENMODALPRESETSETTING.LOAD_SUCCESS:
      return action;
    default:
      return state;
  }
};

export default openModalPresetSetting;
