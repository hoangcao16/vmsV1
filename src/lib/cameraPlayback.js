import Hls from "hls.js";
import lionSvcApi from "../api/lion/cameraApi";
import playbackApi from "../api/playback/cameraApi";
import Notification from "../components/vms/notification/Notification";
import { setPlaybackHls, viewCamIsNotOperation } from "../redux/actions/map/camLiveAction";
import { reactLocalStorage } from "reactjs-localstorage";

const language = reactLocalStorage.get('language')

class CameraPlaybackService {


    async playbackCameraWithSeekTime(
        cameraSlot,
        camUuid,
        camId,
        originSlotId,
        seekTime,
        dispatch
    ) {
        if (camId === "" || camId === null) {
            if (language === 'vn') {
                Notification({
                    type: "warning",
                    title: "Playback",
                    description: "Camera không xác định",
                });
            } else {
                Notification({
                    type: "warning",
                    title: "Playback",
                    description: "Unknown Camera",
                });
            }
            // dispatch(viewCamIsNotOperation(camLive))
            return;
        }
        const playbackPermissionReq = {
            cameraUuid: camUuid,
            startTime: seekTime,
        };
        try {
            const data = await lionSvcApi.checkPermissionForViewOnline(
                playbackPermissionReq
            );
            if (data) {
                const startReq = {
                    cameraId: camId,
                    date: seekTime,
                    token: data.token,
                };
                const payload = await playbackApi.startPlayback(
                    data.playbackUrl,
                    startReq
                );
                if (payload === null) return;
                const videoCellName = "video-slot-" + originSlotId;
                const video = document.getElementById(videoCellName);

                console.log('data',video);
                const videoSrc =
                    data.playbackUrl +
                    "/play/hls/" +
                    payload.reqUuid +
                    "/index.m3u8";
                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = videoSrc;
                } else if (Hls.isSupported()) {
                    video.srcObject = null;
                    if (cameraSlot.hls) {
                        cameraSlot.hls.destroy()
                    }
                    const hls = new Hls({
                        autoStartLoad: true,
                        startPosition: -1,
                        debug: false,
                    });

                    hls.loadSource(videoSrc);
                    hls.attachMedia(video);


                    video.autoplay = true;
                    video.controls = false;
                    video.style =
                        "width:100%;height:100%;display:block;object-fit:fill;";
                    video.style.display = "block";
                    cameraSlot.hls = hls
                    dispatch(setPlaybackHls(cameraSlot))
                    return
                }
            }
        } catch (e) {
            dispatch && !cameraSlot?.isPlay && dispatch(viewCamIsNotOperation(cameraSlot));
            Notification({
                type: "warning",
                title: "Playback",
                description: e.toString(),
            });
        }
    };
}

export default new CameraPlaybackService();