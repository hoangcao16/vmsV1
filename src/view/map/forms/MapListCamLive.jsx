import React, {useEffect, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {Button} from "antd";
import _ from "lodash";

import "antd/dist/antd.css";
import "../../../assets/scss/app-icons.scss";
import {getListCamLiveSelector} from "../../../redux/selectors/map/camera";
import {MapCamItemLiveMemo} from "./MapCamItemLive";
import { deleteListCamLive, getListCamLive, saveListCamLive, updateListCamLive } from "../../../redux/actions/map/camLiveAction";
import { CAM_LIVE_ITEMS } from "../../common/vms/constans/map";
import { useTranslation } from 'react-i18next';

const MapListCamLive = (props) => {
    const { t } = useTranslation();
    const {liveMode} = props;
    const [isCollapsedCameraLive, setIsCollapsedCameraForm] = useState(false);
    const camsLiveSelector = useSelector(getListCamLiveSelector);
    const {playbackSeekTime, loading, camLiveObject} = useSelector(state => state.map.camsLive);
    const dispatch = useDispatch();
    const [cameraSlots, setCameraSlots] = useState([
        {
            pc: null,
            slotId: 0,
            camId: "",
            isPlay: false,
            hls: null
        },
        {
            pc: null,
            slotId: 1,
            camId: "",
            isPlay: false,
            hls: null
        },
        {
            pc: null,
            slotId: 2,
            camId: "",
            isPlay: false,
            hls: null
        },
        {
            pc: null,
            slotId: 3,
            camId: "",
            isPlay: false,
            hls: null
        },
    ]);



    const toggleCollapsedCameraLive = () => {
        setIsCollapsedCameraForm(!isCollapsedCameraLive);
    };



    const handleSaveListLiveCam = () => {
        const listCamLiveFilter = camsLiveSelector.filter((cam) => cam.isPlay);
        const cameraUuids = listCamLiveFilter.map((cam) => cam.uuid);
        const payload = {
            type: "4x1",
            cameraUuids
        }
        sessionStorage.setItem(CAM_LIVE_ITEMS, JSON.stringify(listCamLiveFilter));
        if(listCamLiveFilter.length > 0) {
            if(camLiveObject?.uuid) {
            dispatch(updateListCamLive(payload, camLiveObject?.uuid))
           } else {
            dispatch(saveListCamLive(payload))
           }
        } else {
            camLiveObject?.uuid && dispatch(deleteListCamLive(camLiveObject?.uuid))
        }
    };

    useEffect(() => {
        const params = {
            type: '4x1',
            page: 1,
            size: 10
        }
        dispatch(getListCamLive(params))
    }, [])

    return (
        <div
            className={
                "camera-live position-absolute d-flex flex-column  mh-100" +
                (isCollapsedCameraLive ? " collapsed" : "")
            }
        >
            <div className="camera-live__save">
                <Button
                    loading={loading}
                    onClick={handleSaveListLiveCam}
                    type="primary"
                    shape="round"
                    size="middle"
                >
                    {t('view.map.save_live_camera', { cam: t('camera') })}
                </Button>
            </div>

            <a className="toggle-collapse" onClick={toggleCollapsedCameraLive}/>
            {cameraSlots?.map((cam, index) => (
                <MapCamItemLiveMemo
                    key={index}
                    camera={cam}
                    liveMode={liveMode}
                    slotId={index}
                    playbackSeekTime={playbackSeekTime}
                    // camLive={camsLiveSelector[index]}
                />
            ))}
        </div>
    );
};
export default MapListCamLive;
