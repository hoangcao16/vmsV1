import { VideoCameraOutlined, YoutubeOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
const LiveAndPlaybackCam = ({ liveMode, onChaneModePlayCam }) => {
  const { t } = useTranslation();
  const renderSwitchMode = () => {
    let xhtml = "";
    if (liveMode) {
      xhtml = (
        <>
          <Tooltip
            placement="top"
            title={t("view.user.detail_list.live")}
            arrowPointAtCenter={true}
          >
            <Button
              className="live-item choosed"
              onClick={() => onChaneModePlayCam(true)}
              icon={<VideoCameraOutlined />}
            ></Button>
          </Tooltip>

          <Tooltip
            placement="top"
            title={t("view.user.detail_list.playback")}
            arrowPointAtCenter={true}
          >
            <Button
              className="playBack-item "
              onClick={() => onChaneModePlayCam(false)}
              icon={<YoutubeOutlined />}
            ></Button>
          </Tooltip>
        </>
      );
    } else {
      xhtml = (
        <>
          <Tooltip
            placement="top"
            title={t("view.user.detail_list.live")}
            arrowPointAtCenter={true}
          >
            <Button
              className="live-item"
              onClick={() => onChaneModePlayCam(true)}
              icon={<VideoCameraOutlined />}
            ></Button>
          </Tooltip>

          <Tooltip
            placement="top"
            title={t("view.user.detail_list.playback")}
            arrowPointAtCenter={true}
          >
            <Button
              className="playBack-item choosed"
              onClick={() => onChaneModePlayCam(false)}
              icon={<YoutubeOutlined />}
            ></Button>
          </Tooltip>
        </>
      );
    }
    return xhtml;
  };
  return <div className="switch-mode"> {renderSwitchMode()}</div>;
};

export default LiveAndPlaybackCam;
