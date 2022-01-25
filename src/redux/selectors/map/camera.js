import { createSelector } from "reselect";

export const getCamActiveOnMap = (state) => state.map.camsLive.listCamLive;
export const getListAllCamera = (state) => state.map.camera.listAllCamera;

export const getListCamLiveSelector = createSelector(
  [getCamActiveOnMap, getListAllCamera],
  (listCamLive, ListAllCamera) => {
    return (
      listCamLive?.map((cam) => {
        if (ListAllCamera !== undefined) {
          const camIndex = ListAllCamera?.findIndex(
            (cam1) => cam1.uuid === cam.uuid
          );
          if (camIndex !== -1) {
            cam = { ...ListAllCamera[camIndex], ...cam };
          }
          return cam;
        } else {
          ListAllCamera = []
          const camIndex = ListAllCamera?.findIndex(
            (cam1) => cam1.uuid === cam.uuid
          );
          if (camIndex !== -1) {
            cam = { ...ListAllCamera[camIndex], ...cam };
          }
          return cam;
        }
      }) || []
    );
  }
);
