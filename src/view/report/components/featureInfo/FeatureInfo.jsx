import React, { useEffect, useState } from 'react';
import './featureInfo.scss';
import CardCameraInfo from './CardCameraInfo';
import CameraApi from '../../../../actions/api/camera/CameraApi';
import { reactLocalStorage } from "reactjs-localstorage";
import { useTranslation } from 'react-i18next';


export default function FeatureInfo(props) {
  const [camera, setCamera] = useState([]);
  const {t} = useTranslation()

  useEffect(() => {
    CameraApi.getReportCamera().then((result) => {
      const convertData = result.map((r) => {
        return {
          ...r,
          color: getColor(r)
        };
      });
      setCamera(convertData);
    });
  }, []);

  const getColor = (r) => {
    if (r.cameraName === 'cameraIsWorking') {
      return 'green';
    }
    if (r.cameraName === 'cameraIsNotWorking') {
      return 'red';
    }
    if (r.cameraName === 'cameraAI') {
      return 'yellow';
    }
    return 'blue';
  };

  return (
    <div className="featureInfo">
      {camera.map((c) => {
        return (
          <CardCameraInfo
            key={c.cameraName}
            name={t(`view.report.${c.cameraName}`)}
            total={c.totalCamera}
            color={c.color}
          />
        );
      })}
    </div>
  );
}


