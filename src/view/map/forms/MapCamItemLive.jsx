/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import { Maximize2, Minimize2, X } from "react-feather";
import { useSelector, useDispatch } from "react-redux";
import { Row, Spin } from "antd";
import _ from "lodash";
import "antd/dist/antd.css";
import "../../../assets/scss/app-icons.scss";
import {
  deSelectCamLiveOnMap,
  removeCamLiveOnMap,
  selectOrDeSelectCamLiveOnMap,
} from "../../../redux/actions/map/camLiveAction";
import CameraService from "../../../lib/camera";
import Notification from "../../../components/vms/notification/Notification";
import CameraPlaybackService from "../../../lib/cameraPlayback";
import { getListCamLiveSelector } from "../../../redux/selectors/map/camera";

const MapCamItemLive = (props) => {
  const dispatch = useDispatch();
  const { camera, slotId, liveMode, playbackSeekTime } = props;
  const [isMaximize, setIsMaximize] = useState(false);
  const [loading, setLoading] = useState(false);
  const currentRef = useRef();
  const camsLiveSelector = useSelector(getListCamLiveSelector);
  let camLive = camsLiveSelector[slotId];
  const selectedIds = useSelector((state) => state.map.camsLive.selectedIds);
  const maxMinCamera = () => {
    setIsMaximize(!isMaximize);
  };
  const [pcList, setPCList] = useState([]);
  const pcListRef = useRef(pcList);
  useEffect(() => {
    return () => {
      closeAllRTCPeerConnection();
    };
  }, []);

  useEffect(() => {
    pcListRef.current = pcList;
  }, [pcList]);

  useEffect(() => {
    if (!camLive) {
      CameraService.closeCamera(slotId);
      closeRTCPeerConnection(slotId);
      return;
    }
    if (liveMode) {
      if (camLive && !camLive.isPlay && !camLive.messError) {
        CameraService.closeCamera(slotId);
        closeRTCPeerConnection(slotId);
        CameraService.playCameraOnline(camLive, slotId, dispatch).then(({pc, dc}) => {
          if (pc instanceof RTCPeerConnection) {
            let pcLstTmp = [...pcList];
            let isExist = false;
            for (let i = 0; i < pcLstTmp.length; i++) {
              if (pcLstTmp[i].slotIdx === slotId) {
                pcLstTmp[i].dc = dc;
                pcLstTmp[i].pc = pc;
                isExist = true;
                break;
              }
            }
            if (!isExist) {
              pcLstTmp.push({ slotIdx: slotId, pc: pc, dc: dc });
            }
            setPCList([...pcLstTmp]);
          }
        });
      } else if (!camLive) {
        CameraService.closeCamera(slotId);
        closeRTCPeerConnection(slotId);
      }
    } else {
      if (camLive?.first) {
        if (!playbackSeekTime) {
          Notification({
            type: "error",
            title: "",
            description: "Chưa chọn thời gian để play",
          });
          return;
        }
        // Play from camera list
        CameraPlaybackService.playbackCameraWithSeekTime(
          camLive,
          camLive.name,
          camLive.uuid,
          camLive.id,
          slotId,
          playbackSeekTime,
          dispatch
        ).then((r) => console.log(r));
        camLive.first = false;
      } else {
        if (playbackSeekTime && selectedIds.includes(slotId)) {
          CameraPlaybackService.playbackCameraWithSeekTime(
            camLive,
            camLive.name,
            camLive.uuid,
            camLive.id,
            slotId,
            playbackSeekTime,
            dispatch
          ).then((r) => console.log(r));
          return;
        }
      }

      if (!camLive) {
        CameraService.closeCamera(slotId);
      }
    }
  }, [camLive?.first, camLive?.name, liveMode, playbackSeekTime]);

  const closeAllRTCPeerConnection = () => {
    // CLOSE ALL STREAM
    let pcLstTmp = [...pcListRef.current];
    for (let i = 0; i < pcLstTmp.length; i++) {
      if (pcLstTmp[i].pc) {
        console.log(">>>>> close Data Chanel: ", pcLstTmp[i].dc);
        pcLstTmp[i].dc.close();
        pcLstTmp[i].pc.close();
      }
    }
  };

  const closeRTCPeerConnection = (slotIdx) => {
    // CLOSE STREAM
    let pcLstTmp = [...pcListRef.current];
    for (let i = 0; i < pcLstTmp.length; i++) {
      if (pcLstTmp[i].slotIdx === slotIdx) {
        if (pcLstTmp[i].pc) {
          console.log(">>>>> close Data Chanel: ", pcLstTmp[i].dc);
          pcLstTmp[i].dc.close();
          pcLstTmp[i].pc.close();
          pcLstTmp.splice(i, 1);
        }
        break;
      }
    }
    setPCList([...pcLstTmp]);
  };
  useEffect(() => {
    if (camLive && !camLive.isPlay) {
      currentRef.current.style.border = "";
      setLoading(true);
    } else {
      if (selectedIds === slotId && camLive?.isPlay) {
        currentRef.current.style.border = "1px solid yellow";
      } else {
        currentRef.current.style.border = "";
      }
      setLoading(false);
    }
  });

  const selectCameraSlot = (e) => {
    e.stopPropagation();
    if (camLive != null && camLive.isPlay) {
      dispatch(selectOrDeSelectCamLiveOnMap(slotId));
    }
  };
  const closeCamera = (e) => {
    e.stopPropagation();
    if (camLive.hls) {
      camLive.hls.destroy();
    }
    dispatch(deSelectCamLiveOnMap(slotId));
    dispatch(removeCamLiveOnMap(camLive));
    CameraService.closeCamera(slotId);
    closeRTCPeerConnection(slotId);
    setIsMaximize(false);
  };
  return (
    <Row gutter={12} className="map__live-card" id={slotId}>
      <div
        className={`map__live-slot ${isMaximize ? "map__live-card-full" : ""}`}
        onClick={(e) => selectCameraSlot(e)}
        ref={currentRef}
      >
        <Spin tip="Loading..." spinning={loading}>
          {camLive && camLive.isPlay && (
            <div className={`cam-toolbar__control`}>
              <div
                className="cam-toolbar__control__item mb-1"
                size="small"
                onClick={(e) => closeCamera(e)}
              >
                <X className="cam-toolbar__control__item__icon" />
              </div>

              <div
                className="cam-toolbar__control__item"
                size="small"
                onClick={() => maxMinCamera()}
              >
                {isMaximize && (
                  <Minimize2 className="cam-toolbar__control__item__icon" />
                )}
                {!isMaximize && (
                  <Maximize2 className="cam-toolbar__control__item__icon" />
                )}
              </div>
            </div>
          )}
          <video
            id={"video-slot-" + camera.slotId}
            className="video-js"
            preload="auto"
            width="100%"
            height="100%"
            poster={require("../../../assets/img/vms/cam-default.png")}
            data-setup="{}"
          />
          {camLive && (
            <span className={`map__live-slot-cam map__live-slot-cam-name`}>
              {camLive?.name}
            </span>
          )}
          {camLive && camLive.messError && (
            <span className="map__live-slot-not-permission map__live-slot-cam">
              {camLive.messError}
            </span>
          )}
        </Spin>
      </div>
    </Row>
  );
};

function checkPropsChange(prev, current) {
  return (
    _.isEqual(prev.camLive, current.camLive) &&
    _.isEqual(prev.camLiveSelector, current.camLiveSelector) &&
    _.isEqual(prev.liveMode, current.liveMode) &&
    _.isEqual(prev.playbackSeekTime, current.playbackSeekTime)
  );
}

export const MapCamItemLiveMemo = React.memo(MapCamItemLive, checkPropsChange);

// export default MapCamItemLive;
