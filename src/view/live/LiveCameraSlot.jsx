import React, { useEffect, useRef, useState } from "react";
import { Camera, Maximize2, Minimize2, Video, Menu, X } from "react-feather";
import { Space, Spin } from "antd";
import { Popover } from "antd";
import MenuControl from "./menuControl";
import { formatWithMilliseconds } from "../../utility/vms/duration";
import { v4 as uuidV4 } from "uuid";

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
        curSpeed
    } = props;

    const [showMenus, setShowMenus] = useState({});
    const [openMenuControl, setOpenMenuControl] = useState(false);
    const [oldRecState, setOldRecState] = useState(false);
    const [countInMinis, setCountInMinis] = useState(0);
    const [startTime, setStartTime] = useState(0);
    const [stopTime, setStopTime] = useState(0);
    const [currLiveMode, setCurrLiveMode] = useState(liveMode);
    const [isOpenModalControlPanel, setIsOpenModalControlPanel] = useState(false)
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
    };
    const onUnSelectedVideoSlot = () => {
        setShowMenus(false);
    };

    const onDoubleClick = () => {
        zoomOutByDoubleClick(slotId)
    }
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
                        stopCaptureCamera(slotId, startRef.current, currTime, requestId.current, currLiveMode, addedCamerasRef.current);
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
            stopCaptureCamera(slotId, startRef.current, currTime, requestId.current, currLiveMode, addedCamerasRef.current);
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
    }

    const slotIdx = findCameraIndexInGrid(slotId);
    const toolbarCss = showMenus === true ? "video-toolbar__control-0" : "";
    const camName = addedCameras[slotIdx]?.name ? addedCameras[slotIdx].name : "";
    const liveCss = addedCameras[slotIdx]?.name ? "video__label--active" : "";
    const recMode = !!addedCameras[slotIdx]?.isRec;
    const hasError = !!addedCameras[slotIdx]?.hasError;
    const maxCount = 10 * 60 * 1000;

    useEffect(() => {
        if (oldRecState && !recMode) { //Change from recording state to stop
            stopCaptureHandler();
        }
    }, [recMode])

    useEffect(() => {
        if (hasError) clearWhenError();
    }, [hasError]);

    useEffect(() => {
        return () => clearTimeout(timer.current);
    }, []);

    return (
        <div
            onDoubleClick={() => onDoubleClick()}
            onMouseEnter={() => onSelectedVideoSlot()}
            onMouseLeave={() => onUnSelectedVideoSlot()}
            onClick={() => onSelectVideoSlot(slotId)}
            id={"wrapper-slot-" + slotId}
        >
            <div className='video-info'>
                <span className='video-info__name'>{camName}</span>
            </div>

            {recMode && <span className={`video__label ${liveCss}`}>{`Rec ${formatWithMilliseconds(countInMinis)}`}</span>}
            {(liveMode && !recMode) && <span className={`video__label ${liveCss}`}>Live</span>}
            {(!liveMode && !recMode) && <span className={`video__label ${liveCss}`}>Play</span>}

            <div>
                {
                    <div className={`video-toolbar__control ${toolbarCss}`}>
                        {/*{recMode && <label className='video-toolbar__status'>{`REC ${formatWithMilliseconds(countInMinis)}`}</label>}*/}
                        <a
                            className={recMode ? 'video-toolbar__capture' : 'video-toolbar__link'}
                            size='small'
                            onClick={() => captureCameraHandler(slotId)}
                        >
                            <Video className='video-toolbar__icon' size={12} />
                        </a>
                        <a className='video-toolbar__link' size='small'
                            onClick={() => startSnapshotCamera(slotId)}
                        >
                            <Camera className='video-toolbar__icon' size={12} />
                        </a>
                        <a
                            className='video-toolbar__link'
                            size='small'
                            onClick={() => maxMinCamera(slotId)}
                        >
                            {isMaximize && <Minimize2 className='video-toolbar__icon' size={12} />}
                            {!isMaximize && <Maximize2 className='video-toolbar__icon' size={12} />}
                        </a>
                        <Popover
                            placement='top'
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
                                />
                            }
                            overlayClassName='control-panel-popover'
                            trigger='click'
                        >
                            <a
                                className='video-toolbar__link'
                                size='small'
                                onClick={() => {
                                    setOpenMenuControl(!openMenuControl);
                                }}
                            >
                                <Menu className='video-toolbar__icon' size={12} />
                            </a>
                        </Popover>
                        <a
                            className='video-toolbar__link'
                            size='small'
                            onClick={() => {
                                setOpenMenuControl(false);
                                closeCameraHandler(slotId);
                                setIsOpenModalControlPanel(false);
                            }}
                        >
                            <X className='video-toolbar__icon' size={12} />
                        </a>
                    </div>
                }
            </div>
            <Space size='middle'>
                <Spin
                    className='video-js'
                    size='large'
                    id={"spin-slot-" + slotId}
                    style={{ display: "none" }}
                />
            </Space>
            <video
                className='video-js'
                width='100%'
                autoPlay='1'
                id={"video-slot-" + slotId}
                style={{ display: "none" }}
            >
                {/*<source*/}
                {/*    src={addedCameras[item].streamUrl}*/}
                {/*    type="video/mp4"*/}
                {/*/>*/}
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

export default LiveCameraSlot;
