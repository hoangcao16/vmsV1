import { Popover, Space, Spin, Tooltip, Button, Modal } from "antd";
import React, { useEffect, useRef, useState } from "react";
import {
  Camera,
  Maximize2,
  Menu,
  Minimize2,
  Video,
  X,
} from "react-feather";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { v4 as uuidV4 } from "uuid";
import permissionCheck from "../../actions/function/MyUltil/PermissionCheck";
import permissionCheckByCamera from "../../actions/function/MyUltil/PermissionCheckByCamera";
import { formatWithMilliseconds } from "../../utility/vms/duration";
import AiInforTable from "./AiInforTable"
import MenuControl from "./menuControl";
import "./LiveCameraSlot.scss";
import { BellFilled } from "@ant-design/icons";

const LiveCameraSlot = (props) => {
  const {
    idCamera,
    slotId,
    addedCameras,
    startCaptureCamera,
    stopCaptureCamera,
    startSnapshotCamera,
    maxMinCamera,
    isMaximize,
    closeCamera,
    onSelectVideoSlot,
    setCurrentMenuControl,
    currentMenuControl,
    liveMode,
    zoomOutByDoubleClick,
    setReloadLiveMenuTool,
    reloadLiveMenuTool,
    changeLiveMode,
  } = props;
  const { t } = useTranslation();
  const [showMenus, setShowMenus] = useState({});
  const [showNoti, setShowNoti] = useState({});
  const [openMenuControl, setOpenMenuControl] = useState(false);
  const [oldRecState, setOldRecState] = useState(false);
  const [countInMinis, setCountInMinis] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [stopTime, setStopTime] = useState(0);
  const [currLiveMode, setCurrLiveMode] = useState(liveMode);
  const [isOpenModalControlPanel, setIsOpenModalControlPanel] = useState(false);
  const [typeAICamera, setTypeAICamera] = useState("live");
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  const requestId = useRef(uuidV4());
  const countRef = useRef(countInMinis);
  countRef.current = countInMinis;
  const startRef = useRef(startTime);
  startRef.current = startTime;
  const stopRef = useRef(stopTime);
  stopRef.current = stopTime;
  const addedCamerasRef = useRef([...addedCameras]);
  addedCamerasRef.current = [...addedCameras];
  const timer = useRef(null);

  const findCameraIndexInGrid = (slotId) => {
    return addedCameras.findIndex((item) => item.id === slotId);
  };
  const onSelectedVideoSlot = () => {
    setShowMenus(true);
    setShowNoti(true);
  };
  const onUnSelectedVideoSlot = () => {
    setShowMenus(false);
    setShowNoti(false);
  };

  const captureCameraHandler = (slotId) => {
    if (!recMode) {
      const currTime = new Date().getTime();
      setStartTime(currTime);
      setStopTime(0);
      setCurrLiveMode(liveMode);

      timer.current = setInterval(() => {
        if (startRef.current > 0) {
          const currTime = new Date().getTime();
          setCountInMinis(currTime - startRef.current);
          if (countRef.current > maxCount) {
            stopCaptureCamera(
              slotId,
              startRef.current,
              currTime,
              requestId.current,
              currLiveMode,
              addedCamerasRef.current
            );
            setStartTime(0);
            setStopTime(currTime);
          }
        }
      }, 1000);

      startCaptureCamera(slotId, currTime, requestId.current, liveMode);
    } else {
      stopCaptureHandler();
    }
    setOldRecState(!recMode);
  };
  const closeCameraHandler = (slotId) => {
    stopCaptureHandler();
    closeCamera(slotId);
  };
  const stopCaptureHandler = () => {
    const currTime = new Date().getTime();
    if (recMode) {
      stopCaptureCamera(
        slotId,
        startRef.current,
        currTime,
        requestId.current,
        currLiveMode,
        addedCamerasRef.current
      );
    }
    setStartTime(0);
    setStopTime(0);
    setCountInMinis(0);
    clearTimeout(timer.current);
  };
  const clearWhenError = () => {
    setStartTime(0);
    setStopTime(0);
    setCountInMinis(0);
    clearTimeout(timer.current);
  };

  const showNotiInfo = () => {
    setIsInfoModalVisible(true);
  };

  const slotIdx = findCameraIndexInGrid(slotId);
  const toolbarCss = showMenus === true ? "video-toolbar__control-0" : "";
  const notiCss = showNoti == true ? "video-toolbar__control-0" : "dpn";
  const camName = addedCameras[slotIdx]?.name ? addedCameras[slotIdx].name : "";
  const liveCss = addedCameras[slotIdx]?.name ? "video__label--active" : "";
  const recMode = !!addedCameras[slotIdx]?.isRec;
  const hasError = !!addedCameras[slotIdx]?.hasError;
  const maxCount = 10 * 60 * 1000;

  useEffect(() => {
    if (oldRecState && !recMode) {
      //Change from recording state to stop
      stopCaptureHandler();
    }
  }, [recMode]);

  useEffect(() => {
    if (hasError) clearWhenError();
  }, [hasError]);

  useEffect(() => {
    return () => clearTimeout(timer.current);
  }, []);

  useEffect(() => {
    setOpenMenuControl(false);
  }, [idCamera]);

  useEffect(() => {
    setOpenMenuControl(false);
  }, [isMaximize]);

  return (
    <>
      <div
        // onDoubleClick={() => onDoubleClick()}
        onMouseEnter={() => onSelectedVideoSlot()}
        onMouseLeave={() => onUnSelectedVideoSlot()}
        onClick={() => onSelectVideoSlot(slotId)}
        id={"wrapper-slot-" + slotId}
      >
        <div className="video-info">
          {camName.length > 30 ? (
            <Tooltip placement="bottom" title={camName}>
              <span className="video-info__name">
                {camName.slice(0, 30)}...
              </span>
            </Tooltip>
          ) : (
            <span className="video-info__name">{camName}</span>
          )}
        </div>

        {recMode && (
          <span
            className={`video__label ${liveCss}`}
          >{`Rec ${formatWithMilliseconds(countInMinis)}`}</span>
        )}
        {liveMode && !recMode && (
          <span className={`video__label ${liveCss}`}>Live</span>
        )}
        {!liveMode && !recMode && (
          <span className={`video__label ${liveCss}`}>Play</span>
        )}

        {typeAICamera !== "live" ? (
          <div className={`bell ${notiCss}`}>
            <Tooltip
              placement="right"
              title={t("components.bookmark.notification")}
              arrowPointAtCenter={true}
              overlayStyle={{ position: "fixed" }}
            >
              <Button
                type="primary"
                className={"bell-button"}
                onClick={showNotiInfo}
                style={{ marginTop: 5, marginBottom: 5 }}
              >
                <BellFilled className="bell-button__icon"/>
              </Button>
            </Tooltip>
          </div>
        ) : (
          <></>
        )}

        <div>
          {
            <div className={`video-toolbar__control ${toolbarCss}`}>
              {/*{recMode && <label className='video-toolbar__status'>{`REC ${formatWithMilliseconds(countInMinis)}`}</label>}*/}
              {!permissionCheck("capture_video_cam") ? (
                <></>
              ) : (
                <Tooltip title={t("view.user.record")}>
                  <div
                    className={
                      recMode ? "video-toolbar__capture" : "video-toolbar__link"
                    }
                    size="small"
                    onClick={() => captureCameraHandler(slotId)}
                  >
                    <Video className="video-toolbar__icon" size={12} />
                  </div>
                </Tooltip>
              )}

              {!permissionCheck("capture_img_cam") ? (
                <></>
              ) : (
                <Tooltip title={t("view.storage.capture_snapshot")}>
                  <div
                    className="video-toolbar__link"
                    size="small"
                    onClick={() => startSnapshotCamera(slotId)}
                  >
                    <Camera className="video-toolbar__icon" size={12} />
                  </div>
                </Tooltip>
              )}
              {isMaximize ? (
                <div
                  className="video-toolbar__link"
                  size="small"
                  onClick={() => maxMinCamera(slotId)}
                >
                  {isMaximize && (
                    <Minimize2 className="video-toolbar__icon" size={12} />
                  )}
                </div>
              ) : (
                <Tooltip title={t("view.live.zoom")}>
                  <div
                    className="video-toolbar__link"
                    size="small"
                    onClick={() => maxMinCamera(slotId)}
                  >
                    {!isMaximize && (
                      <Maximize2 className="video-toolbar__icon" size={12} />
                    )}
                  </div>
                </Tooltip>
              )}

              <Popover
                placement="top"
                visible={openMenuControl}
                content={
                  <MenuControl
                    setOpenMenuControl={setOpenMenuControl}
                    setCurrentMenuControl={setCurrentMenuControl}
                    slotId={slotId}
                    isOpenModal={currentMenuControl === slotId}
                    idCamera={idCamera}
                    setReloadLiveMenuTool={setReloadLiveMenuTool}
                    reloadLiveMenuTool={reloadLiveMenuTool}
                    isOpenModalControlPanel={isOpenModalControlPanel}
                    setIsOpenModalControlPanel={setIsOpenModalControlPanel}
                    changeLiveMode={changeLiveMode}
                    typeAICamera={typeAICamera}
                    setTypeAICamera={setTypeAICamera}
                  />
                }
                overlayClassName="control-panel-popover"
                trigger="click"
              >
                {!permissionCheckByCamera("setup_preset", idCamera) ||
                !permissionCheckByCamera("ptz_control", idCamera) ? (
                  <></>
                ) : (
                  <Tooltip title={t("view.live.menu_preset")}>
                    <div
                      className="video-toolbar__link"
                      size="small"
                      onClick={() => {
                        setOpenMenuControl(!openMenuControl);
                      }}
                    >
                      <Menu className="video-toolbar__icon" size={12} />
                    </div>
                  </Tooltip>
                )}
              </Popover>
              <Tooltip title={t("view.live.close_camera")}>
                <div
                  className="video-toolbar__link"
                  size="small"
                  onClick={() => {
                    setOpenMenuControl(false);
                    closeCameraHandler(slotId);
                    setIsOpenModalControlPanel(false);
                  }}
                >
                  <X className="video-toolbar__icon" size={12} />
                </div>
              </Tooltip>
            </div>
          }
        </div>
        <Space size="middle">
          <Spin
            className="video-js"
            size="large"
            id={"spin-slot-" + slotId}
            style={{ display: "none" }}
          />
        </Space>
        <video
          className="video-js"
          width="100%"
          autoPlay="1"
          id={"video-slot-" + slotId}
          style={{ display: "none" }}
        >
          {t("noti.browser_not_support_video")}
        </video>
      </div>

      <AiInforTable 
        showNotiInfo={showNotiInfo}
        isInfoModalVisible={isInfoModalVisible}
        setIsInfoModalVisible={setIsInfoModalVisible}
      />
    </>
  );
};

const mapStateToProps = (state) => ({
  openModalPresetSetting: state.openModalPresetSetting,
});

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(LiveCameraSlot);
