import React, { useEffect, useRef } from "react";
import "./thumnail-video.scss";
import _ from "lodash";
import { format } from "../../../utility/vms/duration";

const ThumbnailVideo = (props) => {
  const { duration, playerVideo, fileCurrent } = props;
  const controlBarRef = useRef(null);
  const cbLeftRef = useRef(null);
  const cbRightRef = useRef(null);
  const startVideoRef = useRef(null);
  const endVideoRef = useRef(null);
  const controllerRef = useRef(null);
  const currentRef = useRef(null);
  const progressLineRef = useRef(null);

  let startVdCurrent = 0;
  let startVdMouseDown = false;
  let startVdX = 0;
  let endVdCurrent = 0;
  let endVdMouseDown = false;
  let endVdX = 0;

  let startTime = 0;
  let endTime = duration;

  const renderImage = () => {
    const thumbWidth = window.innerWidth * 0.6666;
    const numOfImg = Math.ceil(thumbWidth / (80 * 3));
    let fakeImages = [];
    if (fileCurrent.thumbnailData) {
      for (let i = 0; i < fileCurrent.thumbnailData.length; i++) {
        for (let j = 0; j < numOfImg; j++) {
          fakeImages.push(fileCurrent.thumbnailData[i]);
        }
      }
    }
    return (
      <div className="frames">
        {fakeImages.map((image, key) => {
          const src = "data:image/jpeg;base64," + image;
          return (
            <div className="image" key={`image_${key}`}>
              <img
                className="frame loaded"
                key={`thumbnail_image_${key}`}
                src={src}
                alt=""
              />
            </div>
          );
        })}
      </div>
    );
  };

  const startVideoMouseDown = (event) => {
    startVdMouseDown = true;
    startVdX = event.clientX;
    event.preventDefault();
  };

  const endVideoMouseDown = (event) => {
    endVdMouseDown = true;
    endVdX = event.clientX;
    event.preventDefault();
  };

  const windowMouseUpEventHandler = (event) => {
    startVdMouseDown = false;
    endVdMouseDown = false;
    event.preventDefault();
  };

  const controlBarMouseUp = (event) => {
    if (!endVdMouseDown && !startVdMouseDown) {
      const position = controllerRef.current.getBoundingClientRect();
      const width = position.width;
      const x = event.clientX - position.left;
      const timeCurrentX = (x * 100) / width;
      if (
        timeCurrentX >= startVdCurrent &&
        timeCurrentX <= 100 - endVdCurrent
      ) {
        currentRef.current.style.left = timeCurrentX + "%";
      }
      if (props) {
        const valueSeek = (timeCurrentX * duration) / 100;
        playerVideo.current.currentTime = valueSeek;
        if (duration !== 0)
          progressLineRef.current.setAttribute("data-value", format(valueSeek));
      }
    }
    if (startVdMouseDown) {
      playerVideo.current.currentTime = startTime;
      if (duration !== 0)
        progressLineRef.current.setAttribute("data-value", format(startTime));
    }
    startVdMouseDown = false;
    endVdMouseDown = false;
    event.preventDefault();
  };

  const controlBarMouseMove = (event) => {
    if (startVdMouseDown || endVdMouseDown) {
      playerVideo.current.pause();
      const position = controllerRef.current.getBoundingClientRect();
      const width = position.width;

      if (startVdMouseDown) {
        const x = event.clientX - position.left;
        let timeCurrentX = (x * 100) / width;
        const oldStartTime = startTime;
        startTime = (timeCurrentX * duration) / 100;
        if (startTime < 0) {
          startTime = 0;
          timeCurrentX = 0;
        }
        if (Math.floor(startTime) < Math.floor(endTime) - 6 && startTime > 0) {
          startVdCurrent = timeCurrentX;
          controlBarRef.current.style.left = timeCurrentX + "%";
          startVideoRef.current.style.width = timeCurrentX + "%";
          currentRef.current.style.left = timeCurrentX + "%";
          startVdX = event.clientX;
          cbLeftRef.current.setAttribute("data-content", format(startTime));
          cbLeftRef.current.setAttribute(
            "data-start_time",
            Math.floor(startTime)
          );
        } else {
          startTime = oldStartTime;
        }
        if (duration !== 0)
          progressLineRef.current.setAttribute("data-value", format(startTime));
      }

      if (endVdMouseDown) {
        const x = position.right - event.clientX;
        let timeCurrentX = (x * 100) / width;
        const oldEndTime = endTime;
        endTime = ((100 - timeCurrentX) * duration) / 100;
        if (endTime > duration) {
          endTime = duration;
          timeCurrentX = 0;
        }
        if (Math.floor(endTime) > Math.floor(startTime) + 6) {
          endVdCurrent = timeCurrentX;
          controlBarRef.current.style.right = timeCurrentX + "%";
          endVideoRef.current.style.width = timeCurrentX + "%";
          endVdX = event.clientX;
          cbRightRef.current.setAttribute("data-content", format(endTime));
          cbRightRef.current.setAttribute("data-end_time", Math.floor(endTime));
        } else {
          endTime = oldEndTime;
        }
      }
    }
    event.preventDefault();
  };

  const timeUpEventHandler = (event) => {
    if (
      duration !== 0 &&
      playerVideo.current != null &&
      cbRightRef.current != null
    ) {
      currentRef.current.style.left =
        playerVideo.current.currentTime * (100 / duration) + "%";
      let value = format(playerVideo.current.currentTime);
      if (playerVideo.current.playbackRate !== 1) {
        value =
          format(playerVideo.current.currentTime) +
          " (x" +
          playerVideo.current.playbackRate +
          ")";
      }
      progressLineRef.current.setAttribute("data-value", value);
    }
  };

  const rateChangeEventHandler = (event) => {
    let value = format(playerVideo.current.currentTime);
    if (playerVideo.current.playbackRate !== 1) {
      value =
        format(playerVideo.current.currentTime) +
        " (x" +
        playerVideo.current.playbackRate +
        ")";
    }
    progressLineRef.current.setAttribute("data-value", value);
  };

  const pauseEventHandler = (event) => {
    const pauseEle = document.getElementById("video-control-pause");
    const playEle = document.getElementById("video-control-play");
    pauseEle.style.display = "none";
    playEle.style.display = "block";
  };

  const playEventHandler = (event) => {
    const pauseEle = document.getElementById("video-control-pause");
    const playEle = document.getElementById("video-control-play");
    pauseEle.style.display = "block";
    playEle.style.display = "none";
  };

  // const loadStartEventHandler = (event) => {
  // cbLeftRef.current.setAttribute("data-content", format(0));
  // cbRightRef.current.setAttribute("data-content", format(duration));
  // };

  useEffect(() => {
    startVideoRef.current.style.width = "0%";
    currentRef.current.style.left = "0%";
    controlBarRef.current.style.left = "0%";
    controlBarRef.current.style.right = "0%";
    startVideoRef.current.style.width = "0%";
    endVideoRef.current.style.width = "0%";
    cbLeftRef.current.setAttribute("data-start_time", Math.floor(startTime));
    cbRightRef.current.setAttribute("data-end_time", Math.floor(endTime));
    cbLeftRef.current.setAttribute("data-content", format(0));
    cbRightRef.current.setAttribute("data-content", format(duration));

    currentRef.current.style.left = "0%";
    playerVideo.current.addEventListener("timeupdate", timeUpEventHandler);
    // playerVideo.current.addEventListener('loadstart', loadStartEventHandler);
    playerVideo.current.addEventListener("pause", pauseEventHandler);
    playerVideo.current.addEventListener("play", playEventHandler);
    playerVideo.current.addEventListener("ratechange", rateChangeEventHandler);
    window.addEventListener("mouseup", windowMouseUpEventHandler);
    return () => {
      if (playerVideo.current != null) {
        playerVideo.current.removeEventListener(
          "timeupdate",
          timeUpEventHandler
        );
        // playerVideo.current.removeEventListener("loadstart", loadStartEventHandler);
        playerVideo.current.removeEventListener("pause", pauseEventHandler);
        playerVideo.current.removeEventListener("play", playEventHandler);
        playerVideo.current.removeEventListener(
          "ratechange",
          rateChangeEventHandler
        );
        window.removeEventListener("mouseup", windowMouseUpEventHandler);
      }
    };
  }, [fileCurrent, duration]);

  return (
    <>
      <div
        data-prevent-html2-canvas=""
        style={{ width: "100%" }}
        className="disable-select"
      >
        <div className="component_storyboard storyboard">{renderImage()}</div>

        <div
          ref={controllerRef}
          onMouseUp={controlBarMouseUp}
          onMouseMove={controlBarMouseMove}
          className="shared-components_control-bars control-bars"
          id="control-bars"
        >
          <div
            ref={startVideoRef}
            className="mask left"
            style={{ width: "0%" }}
          />
          <div
            ref={endVideoRef}
            className="mask right"
            style={{ width: "0%" }}
          />
          <div
            ref={currentRef}
            className="progress-output"
            style={{ left: "0%" }}
          >
            <div
              ref={progressLineRef}
              data-value={format(0)}
              className="progress-line"
            />
          </div>
          <div
            ref={controlBarRef}
            className="control-bars-wrapper"
            style={{ left: "0%", right: "0%" }}
          >
            <div
              onMouseDown={startVideoMouseDown}
              data-content={format(0)}
              id="cb-left"
              ref={cbLeftRef}
              data-start_time={startTime}
              className="control-bar cb-left active"
            />
            <div
              onMouseDown={endVideoMouseDown}
              ref={cbRightRef}
              data-content={format(duration)}
              data-end_time={endTime}
              id="cb-right"
              className="control-bar cb-right"
            />
            <div
              className="selected-range-output"
              style={{ visibility: "visible" }}
            />
          </div>
        </div>

        <div
          data-value="00:13.6"
          className="time-stripe"
          style={{ left: "47.5965%", visibility: "hidden" }}
        ></div>
      </div>
    </>
  );
};

function thumbnailVideoPropsAreEqual(prevThumbVideo, nextThumbVideo) {
  return (
    _.isEqual(prevThumbVideo.fileCurrent, nextThumbVideo.fileCurrent) &&
    _.isEqual(prevThumbVideo.zoom, nextThumbVideo.zoom) &&
    prevThumbVideo.duration === nextThumbVideo.duration
  );
}

export const MemoizedThumbnailVideo = React.memo(
  ThumbnailVideo,
  thumbnailVideoPropsAreEqual
);
