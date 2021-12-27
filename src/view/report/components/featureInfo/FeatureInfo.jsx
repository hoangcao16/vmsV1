import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { reactLocalStorage } from "reactjs-localstorage";
import CameraApi from "../../../../actions/api/camera/CameraApi";
import CardCameraInfo from "./CardCameraInfo";
import "./featureInfo.scss";

export default function FeatureInfo(props) {
  const [camera, setCamera] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    CameraApi.getReportCamera().then((result) => {
      const convertData = result.map((r) => {
        return {
          ...r,
          color: getColor(r),
        };
      });
      const sortData = [];
      sortData[0] = convertData[3];
      sortData[1] = convertData[2];
      sortData[2] = convertData[0];
      sortData[3] = convertData[1];
      setCamera(sortData);
    });
  }, []);

  const getColor = (r) => {
    if (r.cameraName === "totalCamera") {
      return "blue";
    }
    if (r.cameraName === "cameraAI") {
      return "yellow";
    }
    if (r.cameraName === "cameraIsWorking") {
      return "green";
    }
    return "red";
  };
  return (
    <div className="featureInfo">
      {camera.map((c) => {
        return (
          <CardCameraInfo
            key={c?.cameraName}
            name={t(`view.report.${c?.cameraName}`)}
            total={c?.totalCamera}
            color={c?.color}
          />
        );
      })}
    </div>
  );
}
