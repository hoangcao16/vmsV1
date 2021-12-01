import React, { useState, useEffect } from "react";
import { AimOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { Tooltip, Spin } from "antd";
import { ReactComponent as CloseButtonIcon } from "../../assets/icons/btn-close.svg";
import { ReactComponent as EditButtonIcon } from "../../assets/icons/btn-edit.svg";
import { ReactComponent as CameraButtonSvg } from "../../assets/icons/icon-camera.svg";
import { TYPE_FORM_ACTION_ON_MAP } from "../common/vms/constans/map";
import camImgSrcDefault from "../../assets/img/vms/cam-default.png";
import adUnitImgSrcDefault from "../../assets/img/vms/adminis-unit-default.png";
import ExportEventFileApi from "../../actions/api/exporteventfile/ExportEventFileApi";
// import { useSelector, useDispatch } from "react-redux";

const CamInfoPopup = (props) => {
  const {
    type,
    dataDetailInfo,
    handlePinCam,
    onClosePopup,
    handleEditInfo,
    trans: t,
  } = props;
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const loadImageFileHanleler = (avatarFileName) => {
      if (avatarFileName) {
        ExportEventFileApi.getAvatar(avatarFileName).then((result) => {
          if (result.data) {
            let blob = new Blob([result.data], { type: "octet/stream" });
            let url = window.URL.createObjectURL(blob);
            setImageUrl(url);
          } else {
            setImageUrl("");
          }
        });
      }
    };
    loadImageFileHanleler(dataDetailInfo?.avatarFileName);
  }, [dataDetailInfo?.avatarFileName]);

  const renderCamInfo = () => (
    <>
      <li>
        <EnvironmentOutlined className="camera-info__icon camera-info__icon--black" />
        <span className="camera-info__detail-desc camera-info__detail-address">
          {dataDetailInfo ? dataDetailInfo.address : ""}
        </span>
      </li>

      <li>
        <span className="camera-info__detail-desc camera-info__detail-address camera-info__detail--adminis">
          {dataDetailInfo?.administrativeUnitName
            ? dataDetailInfo.administrativeUnitName
            : ""}
        </span>
      </li>

      <li>
        <span className="camera-info__detail-desc camera-info__detail-address camera-info__detail--venderName">
          {dataDetailInfo?.vendorName ? dataDetailInfo.vendorName : ""}
        </span>
      </li>

      <li>
        <AimOutlined className="camera-info__icon camera-info__icon--black" />
        <span className="camera-info__detail-desc camera-info__phone">
          {dataDetailInfo && dataDetailInfo.zoneName
            ? dataDetailInfo.zoneName
            : `${t("view.maps.not_provide")}`}
        </span>
      </li>
    </>
  );

  const renderAdminisUnitInfo = () => (
    <>
      <li>
        <EnvironmentOutlined className="camera-info__icon camera-info__icon--black" />
        <span className="camera-info__detail-desc">
          {dataDetailInfo
            ? `${dataDetailInfo.address}, ${
                dataDetailInfo.districtName !== ""
                  ? `${dataDetailInfo.districtName},`
                  : null
              } ${dataDetailInfo.districtName},${dataDetailInfo.provinceName}`
            : ""}
        </span>
      </li>

      <li>
        <span className="camera-info__detail-desc camera-info__detail--phone">
          {dataDetailInfo?.tel ? `+${dataDetailInfo.tel}` : "+XXXXXXXXXX"}
        </span>
      </li>

      <li>
        <AimOutlined className="camera-info__icon camera-info__icon--black" />
        <span className="camera-info__detail-desc ">
          {dataDetailInfo && dataDetailInfo.lat_ && dataDetailInfo.long_
            ? `${dataDetailInfo.lat_}/${dataDetailInfo.long_}`
            : `${t("view.maps.not_provide")}`}
        </span>
      </li>
    </>
  );

  return (
    <div className="camera-info">
      <div className="camera-info__header">
        {type === TYPE_FORM_ACTION_ON_MAP.cam && (
          <Spin
            tip={t("view.maps.loading")}
            className="camera-info__header--loading"
            id={`cam-loading-${dataDetailInfo.uuid}`}
          ></Spin>
        )}
        {type === TYPE_FORM_ACTION_ON_MAP.cam ? (
          <video
            id={`video-slot-${dataDetailInfo.uuid}`}
            className="video-js"
            preload="auto"
            width="100%"
            height="100%"
            poster={imageUrl ? imageUrl : camImgSrcDefault}
            data-setup="{}"
          />
        ) : (
          <img
            src={imageUrl ? imageUrl : adUnitImgSrcDefault}
            className="camera-info__header__img"
          />
        )}
        <div className="camera-info__header-action">
          <span
            className="camera-info__icon icon-item icon-item__pin"
            id={`icon-pin-cam-${dataDetailInfo.uuid}`}
          >
            <CameraButtonSvg
              onClick={() => {
                handlePinCam(type, dataDetailInfo);
              }}
            />
          </span>

          <span className="edit-info__icon icon-item">
            <EditButtonIcon onClick={() => handleEditInfo(dataDetailInfo)} />
          </span>

          <span className="close-info__icon icon-item">
            <CloseButtonIcon
              onClick={() => {
                onClosePopup(type, dataDetailInfo.uuid);
              }}
            />
          </span>
        </div>
      </div>
      <Tooltip placement="top" title={dataDetailInfo.name}>
        <h3 className="camera-info__title">
          <span>{dataDetailInfo ? dataDetailInfo.name : ""}</span>
        </h3>
      </Tooltip>
      <div className="camera-detail">
        <ul className="camera-info__detail">
          {type === TYPE_FORM_ACTION_ON_MAP.cam
            ? renderCamInfo()
            : renderAdminisUnitInfo()}
        </ul>
      </div>
    </div>
  );
};

export default CamInfoPopup;
