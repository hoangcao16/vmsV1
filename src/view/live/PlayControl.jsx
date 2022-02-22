import { CaretRightOutlined, PauseOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiSkipBack, FiSkipForward } from "react-icons/fi";
import { SEEK_BACK, SEEK_FORWARD } from "../common/vms/constans/playback";

const PlayControl = (props) => {
  const { t } = useTranslation();
  const { playbackCameraSeekTypeCallback, pauseOrPlayCallback } = props;
  const [isPlaying, setIsPlaying] = useState(false);

  const checkDisabled = () => {};
  const pauseOrPlay = () => {
    setIsPlaying(!isPlaying);
    pauseOrPlayCallback(isPlaying);
  };
  useEffect(() => {
    // playbackCamera(SEEK_BACK)
  }, []);

  const handleSeekBack = () => {
    playbackCameraSeekTypeCallback(SEEK_BACK);
  };
  const handleSeekForward = () => {
    playbackCameraSeekTypeCallback(SEEK_FORWARD);
  };

  return (
    <div className="playControl">
      {/* <div
        className={`${
          checkDisabled() ? "playIconContainer__disabled" : "playIconContainer"
        }`}
      >
        <FiRewind className="playIcon" onClick={() => {}} />
      </div> */}
      <div
        className={`${
          checkDisabled() ? "playIconContainer__disabled" : "playIconContainer"
        }`}
      >
        <Tooltip
          placement="bottomLeft"
          title={t("view.user.detail_list.back5")}
        >
          <FiSkipBack className="playIcon" onClick={handleSeekBack} />
        </Tooltip>
      </div>
      <div
        className={`${
          checkDisabled()
            ? "playIcon2Container__disabled"
            : "playIcon2Container"
        }`}
      >
        <div className="control__icon">
          {isPlaying ? (
            <Tooltip
              placement="bottomLeft"
              title={t("view.user.detail_list.pause")}
            >
              <CaretRightOutlined
                className="playIcon2"
                onClick={() => {
                  pauseOrPlay();
                }}
              />
            </Tooltip>
          ) : (
            <Tooltip
              placement="bottomLeft"
              title={t("view.user.detail_list.play")}
            >
              <PauseOutlined
                className="playIcon2"
                onClick={() => {
                  pauseOrPlay();
                }}
              />
            </Tooltip>
          )}
        </div>
      </div>
      <div
        className={`${
          checkDisabled() ? "playIconContainer__disabled" : "playIconContainer"
        }`}
      >
        <Tooltip
          placement="bottomLeft"
          title={t("view.user.detail_list.forward5")}
        >
          <FiSkipForward className="playIcon" onClick={handleSeekForward} />
        </Tooltip>
      </div>
      {/* <div
        className={`${
          checkDisabled() ? "playIconContainer__disabled" : "playIconContainer"
        }`}
      >
        <FiFastForward className="playIcon" onClick={() => {}} />
      </div> */}
    </div>
  );
};

export default PlayControl;
