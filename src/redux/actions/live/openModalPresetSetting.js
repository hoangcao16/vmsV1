import { OPENMODALPRESETSETTING } from "../../types/live";

const openModalPresetSetting = (state) => ({
  type: OPENMODALPRESETSETTING.LOAD_SUCCESS,
  state,
});

export { openModalPresetSetting };
