import React, { useEffect, useState } from "react";
import Bookmark from "../../components/vms/bookmark/Bookmark";
import LiveAndPlaybackCam from "./LiveAndPlaybackCam";
import LiveMenuTool from "./LiveMenuTool";
import "./LiveMenuTool.scss";
import PlaybackMenuTool from "./PlaybackMenuTool";
import PlaybackSliderTime from "./slider/PlaybackSliderTime";
import grid1 from "../../assets/img/icons/map/grid1.png";
import grid2 from "../../assets/img/icons/map/grid2.png";
import grid3 from "../../assets/img/icons/map/grid3.png";
import grid4 from "../../assets/img/icons/map/grid4.png";
import { Tooltip } from "antd";
import { useTranslation } from "react-i18next";

const MenuTools = (props) => {
  const { t } = useTranslation();
  const [gridSize, setGridSize] = useState(16);

  useEffect(() => {
    setGridSize(props.defaultSize);
  }, [props.defaultSize]);

  const {
    updateGridSize2,
    handleBookmarkSaveCallback,
    handleOpenBookmarkSetting,
    liveMode,
    onChaneModePlayCam,
    playbackCameraSeekTypeCallback,
    playbackCameraSeekTimeCallback,
    pauseOrPlayCallback,
    currSelectedCamUuid,
    playbackByDragSlideTime,
    dateTimeSeek,
    playbackChangeSpeedCallback,
    resetSpeed,
    reloadLiveMenuTool,
    curSpeed,
  } = props;
  return (
    <div>
      <div className="row toolbar py-1">
        <div className="toolbar__grid-selection toolbar__selected-mode">
          <Tooltip
            placement="top"
            title={t("view.user.detail_list.gird1")}
            arrowPointAtCenter={true}
          >
            <div
              className=""
              size="small"
              onClick={() => {
                updateGridSize2(1);
                setGridSize(1);
              }}
            >
              {gridSize === 1 ? (
                <span
                  className="app-icon mr-1"
                  style={{ backgroundImage: `url(${grid1})` }}
                ></span>
              ) : (
                <span className="app-icon icon-grid-1 mr-1"></span>
              )}
            </div>
          </Tooltip>

          <Tooltip
            placement="top"
            title={t("view.user.detail_list.gird2")}
            arrowPointAtCenter={true}
          >
            <div
              className=""
              size="small"
              onClick={() => {
                updateGridSize2(4);
                setGridSize(4);
              }}
            >
              {gridSize === 4 ? (
                <span
                  className="app-icon mr-1"
                  style={{ backgroundImage: `url(${grid2})` }}
                ></span>
              ) : (
                <span className="app-icon icon-grid-4 mr-1"></span>
              )}
            </div>
          </Tooltip>
          <Tooltip
            placement="top"
            title={t("view.user.detail_list.gird3")}
            arrowPointAtCenter={true}
          >
            <div
              className=""
              size="small"
              onClick={() => {
                updateGridSize2(9);
                setGridSize(9);
              }}
            >
              {gridSize === 9 ? (
                <span
                  className="app-icon mr-1"
                  style={{ backgroundImage: `url(${grid3})` }}
                ></span>
              ) : (
                <span className="app-icon icon-grid-9 mr-1"></span>
              )}
            </div>
          </Tooltip>
          <Tooltip
            placement="top"
            title={t("view.user.detail_list.gird4")}
            arrowPointAtCenter={true}
          >
            <div
              className=""
              size="small"
              onClick={() => {
                updateGridSize2(16);
                setGridSize(16);
              }}
            >
              {gridSize === 16 ? (
                <span
                  className="app-icon mr-1"
                  style={{ backgroundImage: `url(${grid4})` }}
                ></span>
              ) : (
                <span className="app-icon icon-grid-16"></span>
              )}
            </div>
          </Tooltip>
          <LiveAndPlaybackCam
            liveMode={liveMode}
            onChaneModePlayCam={onChaneModePlayCam}
          />
        </div>

        <div className="container--change">
          {liveMode && (
            <LiveMenuTool
              idCamera={currSelectedCamUuid}
              reloadLiveMenuTool={reloadLiveMenuTool}
            />
          )}
          {!liveMode && (
            <PlaybackMenuTool
              playbackCameraSeekTypeCallback={playbackCameraSeekTypeCallback}
              playbackCameraSeekTimeCallback={playbackCameraSeekTimeCallback}
              pauseOrPlayCallback={pauseOrPlayCallback}
              playbackChangeSpeedCallback={playbackChangeSpeedCallback}
              resetSpeed={resetSpeed}
              curSpeed={curSpeed}
            />
          )}
        </div>

        <div className="toolbar__bookmark">
          <Bookmark
            handleBookmarkSaveCallback={handleBookmarkSaveCallback}
            handleOpenBookmarkSetting={handleOpenBookmarkSetting}
          />
        </div>
      </div>
      {!liveMode && (
        <PlaybackSliderTime
          playbackByDragSlideTime={playbackByDragSlideTime}
          dateTimeSeek={dateTimeSeek}
        />
      )}
    </div>
  );
};

export default MenuTools;
