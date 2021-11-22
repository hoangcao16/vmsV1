import { SaveOutlined } from '@ant-design/icons';
import { Button, Tooltip } from "antd";
import "antd/dist/antd.css";
import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import "../../../assets/scss/app-icons.scss";
import { deleteListCamLive, getListCamLive, saveListCamLive, updateListCamLive } from "../../../redux/actions/map/camLiveAction";
import { getListCamLiveSelector } from "../../../redux/selectors/map/camera";
import { CAM_LIVE_ITEMS } from "../../common/vms/constans/map";
import { MapCamItemLiveMemo } from "./MapCamItemLive";



const MapListCamLive = (props) => {
    const { t } = useTranslation();
    const { liveMode } = props;
    const [isCollapsedCameraLive, setIsCollapsedCameraForm] = useState(false);
    const camsLiveSelector = useSelector(getListCamLiveSelector);
    const { playbackSeekTime, loading, camLiveObject } = useSelector(state => state.map.camsLive);
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
        if (listCamLiveFilter.length > 0) {
            if (camLiveObject?.uuid) {
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
            {/* <div className="camera-live__save">
                <Button
                    loading={loading}
                    onClick={handleSaveListLiveCam}
                    type="primary"
                    shape="round"
                    size="middle"
                >
                    {t('view.map.save_live_camera', { cam: t('camera') })}
                </Button>
            </div> */}

            <Tooltip title={t('view.map.save_live_camera', { cam: t('camera') })}>
                <Button
                    loading={loading}
                    onClick={handleSaveListLiveCam}
                    type="primary"
                    shape="round"
                    size="middle"
                    className="camera-live__save"
                    style={{ position: 'absolute', left: '8px', top: '2px', height: '40px', width: '40px', padding: '0', background: '#1380FF', zIndex: '999', border: '0' }}
                    icon={<SaveOutlined style={{ color: "#FCFEFF", fontSize: '20px' }} />}
                >
                </Button>
            </Tooltip>


            <a className="toggle-collapse" onClick={toggleCollapsedCameraLive} />
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
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

        </div>
    );
};
export default MapListCamLive;
