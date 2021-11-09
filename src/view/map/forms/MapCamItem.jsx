import React, {useState, useEffect} from "react";
import {Tooltip} from "antd";
import {ReactComponent as PlayCamIcon} from "../../../assets/icons/icon-play-cam.svg";
import {ReactComponent as PauseCamIcon} from "../../../assets/icons/icon-pause-cam.svg";
import {useSelector, useDispatch} from "react-redux";
import {
    removeCamLiveOnMap,
    setCamsLiveOnMap
} from "../../../redux/actions/map/camLiveAction";

import { useTranslation } from 'react-i18next';

const MapCamItem = ({camera, handleSelectCamera, isControlCam}) => {
    const { t } = useTranslation();
    const [playCam, setPlayCam] = useState(false);
    const [showControlCam, setShowControlCam] = useState(false);
    const camsLiveSelector = useSelector(state => state.map.camsLive.listCamLive);
    const dispatch = useDispatch();
    const onSelectCam = (e) => {
        handleSelectCamera(camera);
    };

    const handleClick = (e) => {
        if(isControlCam) {
            e.preventDefault();
            e.stopPropagation();
            setShowControlCam(!showControlCam);   
        }
    };

    const handlePlayCam = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setPlayCam(true);
        dispatch(setCamsLiveOnMap({...camera, isPlay: false, first: true}))
    }

    const handlePauseCam = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setPlayCam(false)
        dispatch(removeCamLiveOnMap(camera))
    }

    useEffect(() => {
        if (isControlCam) {
            if (camsLiveSelector.find(cam => cam.uuid === camera.uuid)) {
                setPlayCam(true)
            } else {
                setPlayCam(false)
            }
        }
    }, [camsLiveSelector, camera])
    return (
        <>
            <div onClick={handleClick}
                className={`d-flex p-1 align-items-center card-cam__item ${showControlCam ? 'active' : ''}`}>
                <div
                    className="camera-list__cam card-cam__item__content"
                >
                    <i
                        className={
                            "rounded-circle  d-inline-block camera-status " +
                            (camera.recordingStatus ? "bg-success" : "bg-secondary")
                        }
                    />
                    <Tooltip
                        placement="left"
                        zIndex={190000000}
                        align={"center"}
                        autoAdjustOverflow={true}
                        arrowPointAtCenter={true}
                        overlayClassName="camera-list__cam__tooltip"
                        title={() => (
                            <div>
                                <p>{t('view.map.name')}: {camera.name}</p>
                                <p>{t('view.map.administrative_unit_uuid')}: {camera.administrativeUnitName}</p>
                                <p>{t('view.map.zone')}: {camera.zoneName}</p>
                            </div>
                        )}
                    >
            <span onClick={onSelectCam} className="camera-list__cam__text">
              {camera.name}
            </span>
                    </Tooltip>
                </div>
                {isControlCam && showControlCam && (
                    <div className="card-cam__item__control">
                        {playCam ? <PlayCamIcon onClick={handlePauseCam}/> : <PauseCamIcon onClick={handlePlayCam}/>}
                    </div>
                )}
            </div>
        </>
    );
};

export default MapCamItem;
