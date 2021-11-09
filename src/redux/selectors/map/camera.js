import { createSelector } from 'reselect'

export const getCamActiveOnMap = (state) => state.map.camsLive.listCamLive;
export const getListCamera = (state) => state.map.camera.listCamera;

export const getListCamLiveSelector = createSelector(
    [getCamActiveOnMap, getListCamera],
    (listCamLive, listCamera) => {
        return listCamLive?.map(cam => {
            const camIndex = listCamera?.findIndex(cam1 => cam1.uuid === cam.uuid)
            if(camIndex !== -1) {
                 cam = {...listCamera[camIndex], ...cam};
            }
            return cam;
        }) || []
    }
);