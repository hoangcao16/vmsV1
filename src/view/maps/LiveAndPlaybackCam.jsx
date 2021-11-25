import { Tooltip } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { ReactComponent as IconLiveOff } from "../../assets/icons/Icon-live-off.svg";
import { ReactComponent as IconLiveOn } from "../../assets/icons/icon-live-on.svg";
import { ReactComponent as IconPlaybackOff } from "../../assets/icons/icon-play-back-off.svg";
import { ReactComponent as IconPlayBackOn } from "../../assets/icons/Icon-play-back-on.svg";
const LiveAndPlaybackCam = ({ liveMode, onChaneModePlayCam }) => {
  const { t } = useTranslation();
  const renderItem = () => {
    let xhtml = "";
    if (liveMode) {
      xhtml = (
        <>
          <div className="live-item" onClick={() => onChaneModePlayCam(true)}>
            <Tooltip
              placement="top"
              title={t("view.user.detail_list.live")}
              arrowPointAtCenter={true}
            >
              <IconLiveOn />
            </Tooltip>
          </div>
          <div
            className="playBack-item"
            onClick={() => onChaneModePlayCam(false)}
          >
            <Tooltip
              placement="top"
              title={t("view.user.detail_list.playback")}
              arrowPointAtCenter={true}
            >
              <IconPlaybackOff />
            </Tooltip>
          </div>
        </>
      );
    } else {
      xhtml = (
        <>
          <div className="live-item" onClick={() => onChaneModePlayCam(true)}>
            <Tooltip
              placement="top"
              title={t("view.user.detail_list.live")}
              arrowPointAtCenter={true}
            >
              <IconLiveOff />
            </Tooltip>
          </div>
          <div
            className="playBack-item"
            onClick={() => onChaneModePlayCam(false)}
          >
            <Tooltip
              placement="top"
              title={t("view.user.detail_list.playback")}
              arrowPointAtCenter={true}
            >
              <IconPlayBackOn />
            </Tooltip>
          </div>
        </>
      );
    }
    return xhtml;
  };
  return <div className="live-playback-containner">{renderItem()}</div>;
};

export default LiveAndPlaybackCam;
