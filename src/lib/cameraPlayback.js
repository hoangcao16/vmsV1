import Notification from "../components/vms/notification/Notification";
import lionSvcApi from "../api/lion/cameraApi";
import playbackApi from "../api/playback/cameraApi";
import Hls from "hls.js";
import {updatePlayCamLive, setPlaybackHls, viewCamIsNotOperation} from "../redux/actions/map/camLiveAction";

class CameraPlaybackService {
    constructor() {
    }

    async playbackCameraWithSeekTime(
        cameraSlot,
        name,
        camUuid,
        camId,
        originSlotId,
        seekTime,
        dispatch
    ) {
        if (camId == "" || camId == null) {
            Notification({
                type: "warning",
                title: "Playback",
                description: "Camera không xác định",
            });
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
                console.log("payload:", payload);
                if (payload === null) return;
                const videoCellName = "video-slot-" + originSlotId;
                const video = document.getElementById(videoCellName);
                const videoSrc =
                    data.playbackUrl +
                    "/play/hls/" +
                    payload.reqUuid +
                    "/index.m3u8";
                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = videoSrc;
                } else if (Hls.isSupported()) {
                    video.srcObject = null;
                    if(cameraSlot.hls){
                        cameraSlot.hls.destroy()
                    }
                    const hls = new Hls({
                        autoStartLoad: true,
                        startPosition: -1,
                        debug: false,
                    });

                    hls.loadSource(videoSrc);
                    hls.attachMedia(video);
                    // hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
                    //     console.log(
                    //         "manifest loaded, found " +
                    //         data.levels.length +
                    //         " quality level"
                    //     );
                    // });
                    // hls.on(Hls.Events.MEDIA_ATTACHED, function (event, data) {
                    //     console.log(
                    //         "media attched loaded, found " +
                    //         data.levels.length +
                    //         " quality level"
                    //     );
                    // });
                    // hls.on(Hls.Events.ERROR, function (event, data) {
                    //     if (data.fatal) {
                    //         switch (data.type) {
                    //             case Hls.ErrorTypes.NETWORK_ERROR:
                    //                 // try to recover network error
                    //                 console.log('fatal network error encountered, try to recover');
                    //                 hls.startLoad();
                    //                 break;
                    //             case Hls.ErrorTypes.MEDIA_ERROR:
                    //                 console.log('fatal media error encountered, try to recover');
                    //                 hls.recoverMediaError();
                    //                 break;
                    //             default:
                    //                 // cannot recover
                    //                 // tmp[slotIdx].hls.destroy();
                    //                 break;
                    //         }
                    //     }
                    // });

                    video.autoplay = true;
                    video.controls = false;
                    video.style =
                        "width:100%;height:100%;display:block;object-fit:fill;";
                    video.style.display = "block";
                    // video.style.border = '1px solid yellow';
                    // video.play();
                    // dispatch(updatePlayCamLive(camUuid));
                    cameraSlot.hls = hls
                    dispatch(setPlaybackHls(cameraSlot))
                    return
                }
            }
        } catch (e) {
            console.log("e:", e.toString());
            dispatch &&  !cameraSlot?.isPlay && dispatch(viewCamIsNotOperation(cameraSlot));
            Notification({
                type: "warning",
                title: "Playback",
                description: e.toString(),
            });
            // dispatch(viewCamIsNotOperation(camLive))
        }
    };
}

export default new CameraPlaybackService();