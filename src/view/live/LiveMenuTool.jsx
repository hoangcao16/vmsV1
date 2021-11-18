import {
    DownOutlined, LeftOutlined, MinusOutlined, PlusOutlined, RightOutlined, UpOutlined
} from "@ant-design/icons";
import { Button } from "antd";
import { isEmpty } from "lodash-es";
import React, { useEffect, useState } from "react";
import { reactLocalStorage } from "reactjs-localstorage";
import ptzControllerApi from '../../api/ptz/ptzController';
import "./LiveMenuTool.scss";

const LiveMenuTool = (props) => {
    const { idCamera, reloadLiveMenuTool } = props;
    const [presetLists, setPresetLists] = useState([]);
    const [presetTourLists, setPresetTourLists] = useState([])
    const getAllPreset = async (params) => {
        if (idCamera) {
            const payload = await ptzControllerApi.getAllPreset(params);
            if (payload == null) {
                return
            }
            if (payload) {
                setPresetLists(payload.data)
            }
        }
    }
    const getAllPresetTour = async (params) => {
        if (idCamera) {
            const payload = await ptzControllerApi.getAllPresetTour(params);
            if (payload == null) {
                return
            }
            if (payload) {
                setPresetTourLists(payload.data)
            }
        }
    }
    //get all preset
    useEffect(() => {
        if (checkPermissionViewCamera(idCamera)) {
            let params = {
                cameraUuid: idCamera,
            };
            getAllPreset(params)
        }
    }, [idCamera, reloadLiveMenuTool])


    //get all preset tour
    useEffect(() => {
        if (checkPermissionViewCamera(idCamera)) {
            let params = {
                cameraUuid: idCamera,
            };
            getAllPresetTour(params)
        }

    }, [idCamera, reloadLiveMenuTool]
    )

    const onPanLeftStart = async () => {
        const payload = {
            cameraUuid: idCamera,
            direction: "left",
            isStop: 0,
            speed: 1,
        };
        try {
            await ptzControllerApi.postPan(payload);
        } catch (error) {
            console.log(error);
        }
    };

    const onPanLeftEnd = async () => {
        const payload = {
            cameraUuid: idCamera,
            direction: "left",
            isStop: 1,
            speed: 1,
        };
        try {
            await ptzControllerApi.postPan(payload);
        } catch (error) {
            console.log(error);
        }
    };

    const onPanRightStart = async () => {
        const payload = {
            cameraUuid: idCamera,
            direction: "right",
            isStop: 0,
            speed: 1,
        };
        try {
            await ptzControllerApi.postPan(payload);
        } catch (error) {
            console.log(error);
        }
    };

    const onPanRightEnd = async () => {
        const payload = {
            cameraUuid: idCamera,
            direction: "right",
            isStop: 1,
            speed: 1,
        };
        try {
            await ptzControllerApi.postPan(payload);
        } catch (error) {
            console.log(error);
        }
    };

    const onTiltUpStart = async () => {
        const payload = {
            cameraUuid: idCamera,
            direction: "up",
            isStop: 0,
            speed: 1,
        };
        try {
            await ptzControllerApi.postTilt(payload);
        } catch (error) {
            console.log(error);
        }
    };

    const onTiltUpEnd = async () => {
        const payload = {
            cameraUuid: idCamera,
            direction: "up",
            isStop: 1,
            speed: 1,
        };
        try {
            await ptzControllerApi.postTilt(payload);
        } catch (error) {
            console.log(error);
        }
    };

    const onTiltDownStart = async () => {
        const payload = {
            cameraUuid: idCamera,
            direction: "down",
            isStop: 0,
            speed: 1,
        };
        try {
            await ptzControllerApi.postTilt(payload);
        } catch (error) {
            console.log(error);
        }
    };

    const onTiltDownEnd = async () => {
        const payload = {
            cameraUuid: idCamera,
            direction: "down",
            isStop: 1,
            speed: 1,
        };
        try {
            await ptzControllerApi.postTilt(payload);
        } catch (error) {
            console.log(error);
        }
    };

    const onZoomInStart = async () => {
        const payload = {
            cameraUuid: idCamera,
            direction: "in",
            isStop: 0,
            speed: 1,
        };
        try {
            await ptzControllerApi.postZoom(payload);
        } catch (error) {
            console.log(error);
        }
    };

    const onZoomInEnd = async () => {
        const payload = {
            cameraUuid: idCamera,
            direction: "in",
            isStop: 1,
            speed: 1,
        };
        try {
            await ptzControllerApi.postZoom(payload);
        } catch (error) {
            console.log(error);
        }
    };

    const onZoomOutStart = async () => {
        const payload = {
            cameraUuid: idCamera,
            direction: "out",
            isStop: 0,
            speed: 1,
        };
        try {
            await ptzControllerApi.postZoom(payload);
        } catch (error) {
            console.log(error);
        }
    };

    const onZoomOutEnd = async () => {
        const payload = {
            cameraUuid: idCamera,
            direction: "out",
            isStop: 1,
            speed: 1,
        };
        try {
            await ptzControllerApi.postZoom(payload);
        } catch (error) {
            console.log(error);
        }
    };

    const onChangeSelectPreset = async () => {
        const value = document.getElementById('select__preset').value;
        const body = {
            cameraUuid: idCamera,
            idPreset: value,
        };
        try {
            await ptzControllerApi.postCallPreset(body);
        } catch (error) {
            console.log(error);
        }
    }

    const onChangeSelectPresetTour = async () => {
        const value = document.getElementById('select__preset-tour').value;
        const body = {
            cameraUuid: idCamera,
            idPresetTour: value,
        };
        try {
            await ptzControllerApi.postCallPresetTour(body);
        } catch (error) {
            console.log(error);
        }
    }


    const renderOptionPreset = () => {
        return presetLists?.map((item, index) =>
            <option key={index} value={item?.idPreset}>{item?.name}</option>
        )
    }

    const renderOptionPresetTour = () => {
        return presetTourLists?.map((item, index) =>
            <option key={index} value={item?.idPresetTour}>{item?.name}</option>
        )
    }

    const checkPermissionViewCamera = (idCamera) => {
        const permissionUser = reactLocalStorage.getObject('permissionUser');
        if (!isEmpty(permissionUser?.roles)) {
            const roles = permissionUser?.roles;
            for (const role of roles) {
                if (role.role_code === 'superadmin')
                    return true
            }
        }
        if (!isEmpty(permissionUser?.p_cameras)) {
            const p_cameras = permissionUser.p_cameras;
            for (const camera of p_cameras) {
                if (idCamera == camera.cam_uuid) {
                    const permissions = camera.permissions;
                    for (const permission of permissions) {
                        if (permission == 'view_online') {
                            return true;
                        }
                    }

                }
            }
        }
        return false;
    }
    return (
        <div className='toolbar__ptz--control'>
            <div className='toolbar__ptz--direction'>
                <div className='toolbar__ptz toolbar__ptz-pan'>
                    <Button
                        className='toolbar__link'
                        size='small'
                        disabled={!idCamera}
                        onMouseDown={onPanLeftStart}
                        onMouseUp={onPanLeftEnd}
                        icon={<LeftOutlined className='toolbar__link-icon' />}
                    ></Button>
                    <Button
                        className='toolbar__link'
                        size='small'
                        onMouseDown={onPanRightStart}
                        onMouseUp={onPanRightEnd}
                        disabled={!idCamera}
                        icon={<RightOutlined className='toolbar__link-icon' />}
                    ></Button>
                </div>
                <div className='toolbar__ptz toolbar__ptz-tilt'>
                    <Button
                        className='toolbar__link'
                        size='small'
                        disabled={!idCamera}
                        onMouseDown={onTiltDownStart}
                        onMouseUp={onTiltDownEnd}
                        icon={<DownOutlined className='toolbar__link-icon' />}
                    ></Button>
                    <Button
                        className='toolbar__link'
                        size='small'
                        disabled={!idCamera}
                        onMouseDown={onTiltUpStart}
                        onMouseUp={onTiltUpEnd}
                        icon={<UpOutlined className='toolbar__link-icon' />}
                    ></Button>
                </div>
                <div className='toolbar__ptz toolbar__ptz-zoom'>
                    <Button
                        className='toolbar__link'
                        size='small'
                        disabled={!idCamera}
                        onMouseDown={onZoomInStart}
                        onMouseUp={onZoomInEnd}
                        icon={<PlusOutlined className='toolbar__link-icon' />}
                    ></Button>
                    <Button
                        className='toolbar__link'
                        size='small'
                        disabled={!idCamera}
                        onMouseDown={onZoomOutStart}
                        onMouseUp={onZoomOutEnd}
                        icon={<MinusOutlined className='toolbar__link-icon' />}
                    ></Button>
                </div>
            </div>
            <div className='toolbar__ptz--call'>
                <div className='toolbar__ptz toolbar__preset'>
                    <select
                        disabled={!checkPermissionViewCamera(idCamera)}
                        id='select__preset'
                        onChange={(e) => {
                            e.stopPropagation()
                            onChangeSelectPreset()
                        }}
                        defaultValue=''
                    >
                        <option value='' disabled hidden >Preset</option>
                        {renderOptionPreset()}
                    </select>

                </div>
                <div className='toolbar__ptz toolbar__preset-tour'>
                    <select
                        disabled={!checkPermissionViewCamera(idCamera)}
                        id='select__preset-tour'
                        onChange={(e) => {
                            e.stopPropagation()
                            onChangeSelectPresetTour()
                        }}
                        defaultValue=''
                    >
                        <option value='' disabled hidden >Preset Tour</option>
                        {renderOptionPresetTour()}
                    </select>
                </div>
            </div>
        </div >
    );
};

export default LiveMenuTool;
