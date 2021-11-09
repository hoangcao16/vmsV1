import React from "react";
import { FaLessThanEqual } from "react-icons/fa";
import { ReactComponent as IconLiveOff } from "../../assets/icons/Icon-live-off.svg";
import { ReactComponent as IconLiveOn } from "../../assets/icons/icon-live-on.svg";
import { ReactComponent as IconPlaybackOff } from "../../assets/icons/icon-play-back-off.svg";
import { ReactComponent as IconPlayBackOn } from "../../assets/icons/Icon-play-back-on.svg";
import { Button } from "antd";
import { VideoCameraOutlined, YoutubeOutlined } from "@ant-design/icons";
const LiveAndPlaybackCam = ({ liveMode, onChaneModePlayCam }) => {
  const renderSwitchMode = () => {
    let xhtml = "";
    if (liveMode) {
      xhtml = (
        <>
          <Button
            className='live-item choosed'
            onClick={() => onChaneModePlayCam(true)}
            icon={<VideoCameraOutlined />}
          ></Button>
          <Button
            className='playBack-item '
            onClick={() => onChaneModePlayCam(false)}
            icon={<YoutubeOutlined />}
          ></Button>
        </>
      );
    } else {
      xhtml = (
        <>
          <Button
            className='live-item'
            onClick={() => onChaneModePlayCam(true)}
            icon={<VideoCameraOutlined />}
          ></Button>
          <Button
            className='playBack-item choosed'
            onClick={() => onChaneModePlayCam(false)}
            icon={<YoutubeOutlined />}
          ></Button>
        </>
      );
    }
    return xhtml;
  };
  return <div className='switch-mode'> {renderSwitchMode()}</div>;
};

export default LiveAndPlaybackCam;
