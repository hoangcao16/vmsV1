import getServerCamproxyForPlay from "../utility/vms/camera";
import playCamApi from "../api/camproxy/cameraApi";
import { NOTYFY_TYPE } from "../view/common/vms/Constant";
import Notification from "../components/vms/notification/Notification";
import {
  viewCamIsNotPermission,
  updatePlayCamLive,
} from "../redux/actions/map/camLiveAction";
import { reactLocalStorage } from "reactjs-localstorage";
import { getEmail, getToken } from "../api/token";

const language = reactLocalStorage.get("language");
let notifyMess = {};
if (language === "vn") {
  notifyMess = {
    type: NOTYFY_TYPE.warning,
    title: "Xem trực tiếp",
    description: "Bạn đã thêm thành công Camera",
  };
} else {
  notifyMess = {
    type: NOTYFY_TYPE.warning,
    title: "View online",
    description: "Successfully add new Camera",
  };
}
class CameraService {
  closeCamera = (itemId) => {
    const cell = document.getElementById("video-slot-" + itemId);
    if (document.querySelector(`#cam-loading-${itemId}`)) {
      document.querySelector(`#cam-loading-${itemId}`).style.display = "block";
    }
    if (document.querySelector(`#icon-pin-cam-${itemId}`)) {
      document.querySelector(`#icon-pin-cam-${itemId}`).style.display = "none";
    }
    if (cell) {
      cell.srcObject = null;
    }
    // cell.style.display = "none";
  };

  async playCameraOnline(cam, slotIdx, dispatch) {
    try {
      if (cam.uuid === "" || cam.uuid == null) {
        if (language === "vn") {
          notifyMess.description = "Thông tin Camera không hợp lệ";
          Notification(notifyMess);
          throw new Error("Thông tin Camera không hợp lệ");
        } else {
          notifyMess.description = "Invalid Camera information";
          Notification(notifyMess);
          throw new Error("Invalid Camera information");
        }
      }
      //camproxy controller --> camUuid --> http: camprox
      const data = await getServerCamproxyForPlay(cam.uuid);
      if (data === null) {
        if (language === "vn") {
          notifyMess.description =
            "Bạn không có quyền để xem trực tiếp Camera này";
          Notification(notifyMess);
          dispatch && dispatch(viewCamIsNotPermission(cam));
          throw new Error("Bạn không có quyền để xem trực tiếp Camera này");
        } else {
          notifyMess.description =
            "You don't have permission to view this Camera in live mode";
          Notification(notifyMess);
          dispatch && dispatch(viewCamIsNotPermission(cam));
          throw new Error(
            "You don't have permission to view this Camera in live mode"
          );
        }
      }

      const pc = new RTCPeerConnection();
      pc.addTransceiver("video");
      pc.oniceconnectionstatechange = () => {};
      // const spin = document.getElementById('spin-slot-' + slotIdx)
      pc.ontrack = (event) => {
        //binding and play
        // cam.isPlay = true;
        dispatch && !cam.isPlay && dispatch(updatePlayCamLive(cam.uuid));
        const cell = document.getElementById("video-slot-" + slotIdx);
        if (cell) {
          cell.srcObject = event.streams[0];
          cell.autoplay = true;
          cell.controls = false;
          cell.style = "width:100%;height:100%;display:block;object-fit:fill;";
        }
        const camLoadingElm = document.querySelector(
          `#cam-loading-${cam.uuid}`
        );
        if (camLoadingElm) {
          camLoadingElm.style.display = "none";
        }
        const iconPinCamElm = document.querySelector(
          `#icon-pin-cam-${cam.uuid}`
        );
        if (iconPinCamElm) {
          iconPinCamElm.style.display = "inline-block";
        }
        // spin.style.display = 'none'
        return { status: "success" };
      };

      const thisTime = new Date().getTime();
      const token =
        slotIdx + "##" + getToken() + "##" + getEmail() + "##" + thisTime;

      const API = data.camproxyApi;
      pc.createOffer({
        iceRestart: false,
      }).then((offer) => {
        // spin.style.display = 'block'
        pc.setLocalDescription(offer).then((r) => {});
        //call api
        playCamApi
          .playCamera(API, {
            token: token,
            camUuid: cam.uuid,
            offer: offer,
            viewType: "live",
          })
          .then((res) => {
            if (res) {
              pc.setRemoteDescription(res).then((r) => {});
            } else {
              if (language === "vn") {
                notifyMess.description = "Không thể xem trực tiếp Camera";
                Notification(notifyMess);
                dispatch && dispatch(viewCamIsNotPermission(cam));
                try {
                  throw new Error("Không thể xem trực tiếp Camera");
                } catch (e) {
                  console.log(e);
                }
              } else {
                notifyMess.description = "Cant' view this Camera in live mode";
                Notification(notifyMess);
                dispatch && dispatch(viewCamIsNotPermission(cam));
                throw new Error("Cant' view this Camera in live mode");
              }
            }
          });
      });

      return pc;
    } catch (error) {
      console.log("error:", error);
      dispatch && dispatch(viewCamIsNotPermission(cam));
      const camLoadingElm = document.querySelector(`#cam-loading-${cam.uuid}`);
      if (camLoadingElm) {
        setTimeout(() => {
          camLoadingElm.style.display = "none";
        }, 1000);
      }
      const iconPinCamElm = document.querySelector(`#icon-pin-cam-${cam.uuid}`);
      if (iconPinCamElm) {
        iconPinCamElm.style.display = "none";
      }
      return { error };
    }
  }
}

export default new CameraService();
