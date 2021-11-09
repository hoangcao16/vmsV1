import React from "react";
import {Skeleton} from "antd";
import MapCamItem from "./MapCamItem";

const MapCameraList = ({
                           cameras,
                           handleSelectCameraCallback,
                           handleFocusCameraCallback,
                           isOpenForm,
                           isLoading
                       }) => {
    const handleSelectCamera = (camera, index) => {
        if (isOpenForm) {
            handleSelectCameraCallback(camera, index);
        } else {
            handleFocusCameraCallback(camera);
        }
    };
    return (
        <ul className="mt-1 list-unstyled border h-100">
            <Skeleton loading={isLoading} active paragraph={{rows: 10}}>
                {cameras?.map((camera, index) =>
                    <MapCamItem isControlCam={true} key={camera.id} camera={camera} handleSelectCamera={handleSelectCamera}/>
                )}
            </Skeleton>
        </ul>
    );
};

export default MapCameraList;
