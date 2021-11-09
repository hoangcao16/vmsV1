import { CAM_LIVE_ITEMS } from "../../view/common/vms/constans/map";

export const setCamLiveStorage = (listCamLive) => {
    listCamLive.length > 0 && listCamLive.forEach((cam) => {
        if (cam) {
            delete cam.hls;
        }
    })

    sessionStorage.setItem(
        CAM_LIVE_ITEMS,
        JSON.stringify(listCamLive)
    );
}