import React from "react";
import { Skeleton } from "antd";
import MapCamItem from "./MapCamItem";
import { isEmpty } from "lodash";
import { useTranslation } from "react-i18next";

const MapCameraList = ({
  cameras,
  handleSelectCameraCallback,
  handleFocusCameraCallback,
  isOpenForm,
  isLoading,
}) => {
  const { t } = useTranslation();
  const handleSelectCamera = (camera, index) => {
    if (isOpenForm) {
      handleSelectCameraCallback(camera, index);
    } else {
      handleFocusCameraCallback(camera);
    }
  };


  return (
    <ul className="mt-1 list-unstyled border h-100">
      <Skeleton loading={isLoading} active paragraph={{ rows: 10 }}>
        {!isEmpty(cameras) ? (
          cameras?.map((camera, index) => (
            <MapCamItem
              isControlCam={true}
              key={camera.id}
              camera={camera}
              handleSelectCamera={handleSelectCamera}
            />
          ))
        ) : (
          <div style={{color:'white',padding:10}}>{t("view.user.detail_list.no_valid_results_found")}</div>
        )}
      </Skeleton>
    </ul>
  );
};

export default MapCameraList;
