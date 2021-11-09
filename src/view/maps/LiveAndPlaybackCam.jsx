import React from "react";
import { FaLessThanEqual } from "react-icons/fa";
import { ReactComponent as IconLiveOff } from "../../assets/icons/Icon-live-off.svg";
import { ReactComponent as IconLiveOn } from "../../assets/icons/icon-live-on.svg";
import { ReactComponent as IconPlaybackOff } from "../../assets/icons/icon-play-back-off.svg";
import { ReactComponent as IconPlayBackOn } from "../../assets/icons/Icon-play-back-on.svg";
const LiveAndPlaybackCam = ({ liveMode, onChaneModePlayCam }) => {
  const renderItem = () => {
    let xhtml = "";
    if (liveMode) {
      xhtml = (
        <>
          <div className="live-item" onClick={() => onChaneModePlayCam(true)}>
            <IconLiveOn />
          </div>
          <div className="playBack-item" onClick={() => onChaneModePlayCam(false)}>
            <IconPlaybackOff />
          </div>
        </>
      );
    } else {
        xhtml = (
            <>
              <div className="live-item" onClick={() => onChaneModePlayCam(true)}>
                <IconLiveOff />
              </div>
              <div className="playBack-item" onClick={() => onChaneModePlayCam(false)}>
                <IconPlayBackOn />
              </div>
            </>
        );
    }
    return xhtml;
};
return <div className="live-playback-containner">{renderItem()}</div>;

}

export default LiveAndPlaybackCam;
