import React, { useRef, useState, useEffect } from "react";
import { Modal } from "antd";
import ControlPanel from "./ControlPanel";
import DragM from "dragm";
import ptzControllerApi from "../../../api/ptz/ptzController";
import Notification from "../../../components/vms/notification/Notification";
import { NOTYFY_TYPE } from "../../common/vms/Constant";
import "./ModalControlPanel.scss";
const ModalPanel = ({ isOpen, onCloseModal, idCamera }) => {
  const [zoomPercent, setZoomPercent] = useState(30);

  const onPanLeftStart = async () => {
    const payload = {
      cameraUuid: idCamera,
      direction: "left",
      isStop: 0,
      speed: 1,
    };
    try {
      const isPost = await ptzControllerApi.postPan(payload);
    } catch (error) {
      console.log(error);
    }
  };

  const onPanLeftEnd = async () => {
    const payload = {
      cameraUuid: idCamera,
      direction: "left",
      isStop: 1,
      speed: 1,
    };
    try {
      const isPost = await ptzControllerApi.postPan(payload);
    } catch (error) {
      console.log(error);
    }
  };

  const onPanRightStart = async () => {
    const payload = {
      cameraUuid: idCamera,
      direction: "right",
      isStop: 0,
      speed: 1,
    };
    try {
      const isPost = await ptzControllerApi.postPan(payload);
    } catch (error) {
      console.log(error);
    }
  };

  const onPanRightEnd = async () => {
    const payload = {
      cameraUuid: idCamera,
      direction: "right",
      isStop: 1,
      speed: 1,
    };
    try {
      const isPost = await ptzControllerApi.postPan(payload);
    } catch (error) {
      console.log(error);
    }
  };

  const onTiltUpStart = async () => {
    const payload = {
      cameraUuid: idCamera,
      direction: "up",
      isStop: 0,
      speed: 1,
    };
    try {
      const isPost = await ptzControllerApi.postTilt(payload);
    } catch (error) {
      console.log(error);
    }
  };

  const onTiltUpEnd = async () => {
    const payload = {
      cameraUuid: idCamera,
      direction: "up",
      isStop: 1,
      speed: 1,
    };
    try {
      const isPost = await ptzControllerApi.postTilt(payload);
    } catch (error) {
      console.log(error);
    }
  };

  const onTiltDownStart = async () => {
    const payload = {
      cameraUuid: idCamera,
      direction: "down",
      isStop: 0,
      speed: 1,
    };
    try {
      const isPost = await ptzControllerApi.postTilt(payload);
    } catch (error) {
      console.log(error);
    }
  };

  const onTiltDownEnd = async () => {
    const payload = {
      cameraUuid: idCamera,
      direction: "down",
      isStop: 1,
      speed: 1,
    };
    try {
      const isPost = await ptzControllerApi.postTilt(payload);
    } catch (error) {
      console.log(error);
    }
  };

  const onZoomInStart = async () => {
    const payload = {
      cameraUuid: idCamera,
      direction: "in",
      isStop: 0,
      speed: 1,
    };
    try {
      const isPost = await ptzControllerApi.postZoom(payload);
    } catch (error) {
      console.log(error);
    }
  };

  const onZoomInEnd = async () => {
    const payload = {
      cameraUuid: idCamera,
      direction: "in",
      isStop: 1,
      speed: 1,
    };
    try {
      const isPost = await ptzControllerApi.postZoom(payload);
    } catch (error) {
      console.log(error);
    }
  };

  const onZoomOutStart = async () => {
    const payload = {
      cameraUuid: idCamera,
      direction: "out",
      isStop: 0,
      speed: 1,
    };
    try {
      const isPost = await ptzControllerApi.postZoom(payload);
    } catch (error) {
      console.log(error);
    }
  };

  const onZoomOutEnd = async () => {
    const payload = {
      cameraUuid: idCamera,
      direction: "out",
      isStop: 1,
      speed: 1,
    };
    try {
      const isPost = await ptzControllerApi.postZoom(payload);
    } catch (error) {
      console.log(error);
    }
  };

  var lastPress = 0;

  const onKeyDown = (e) => {
    var now = Date.now();
    if (now - lastPress < 700) {
      lastPress = now
      return;
    }
    lastPress = now
    switch (e.keyCode) {
      case 37:
        onPanLeftStart()
        break
      case 38:
        onTiltUpStart()
        break
      case 39:
        onPanRightStart()
        break
      case 40:
        onTiltDownStart()
        break
    }

  }

  const onKeyUp = (e) => {
    switch (e.keyCode) {
      case 37:
        onPanLeftEnd()
        break
      case 38:
        onTiltUpEnd()
        break
      case 39:
        onPanRightEnd()
        break
      case 40:
        onTiltDownEnd()
        break
    }

  }

  // onKeyDown={(e) => onKeyDown(e)} onKeyUp={(e) => onKeyUp(e)}
  // document.getElementsByClassName("modal-control-panel")[0].addEventListener('keydown', onKeyDown(e));
  // document.getElementsByClassName("modal-control-panel")[0].addEventListener('keyup', onKeyUp(e));
  // console.log('document.getElementsByClassName("modal-control-panel")[0]', document.getElementsByClassName("modal-control-panel")[0])
  // document.getElementsByClassName("modal-control-panel")[0].onkeydown = (e) => {
  //   var now = Date.now();
  //   if (now - lastPress < 700) {
  //     lastPress = now
  //     return;
  //   }
  //   lastPress = now
  //   switch (e.keyCode) {
  //     case 37:
  //       onPanLeftStart()
  //       break
  //     case 38:
  //       onTiltUpStart()
  //       break
  //     case 39:
  //       onPanRightStart()
  //       break
  //     case 40:
  //       onTiltDownStart()
  //       break
  //   }

  // };

  // document.getElementsByClassName("modal-control-panel")[0].onkeyup = (e) => {
  //   switch (e.keyCode) {
  //     case 37:
  //       onPanLeftEnd()
  //       break
  //     case 38:
  //       onTiltUpEnd()
  //       break
  //     case 39:
  //       onPanRightEnd()
  //       break
  //     case 40:
  //       onTiltDownEnd()
  //       break
  //   }
  // };





  const handleCancel = (e) => {
    onCloseModal();
  };

  const onChangeSlider = (value) => {
    setZoomPercent(value);
  };

  return (
    <Modal
      footer={null}
      maskClosable={false}
      visible={isOpen}
      wrapClassName='modal-control-panel'
      onCancel={handleCancel}
      title={<BuildTitle title='' />}
    >
      <ControlPanel
        zoomPercent={zoomPercent}
        onChangeSlider={onChangeSlider}
        onPanLeftStart={onPanLeftStart}
        onPanLeftEnd={onPanLeftEnd}
        onPanRightStart={onPanRightStart}
        onPanRightEnd={onPanRightEnd}
        onTiltUpStart={onTiltUpStart}
        onTiltUpEnd={onTiltUpEnd}
        onTiltDownStart={onTiltDownStart}
        onTiltDownEnd={onTiltDownEnd}
        onZoomInStart={onZoomInStart}
        onZoomInEnd={onZoomInEnd}
        onZoomOutStart={onZoomOutStart}
        onZoomOutEnd={onZoomOutEnd}
      />
    </Modal>
  );
};

const BuildTitle = ({ title }) => {
  const modalDom = useRef();
  const updateTransform = (transformStr) => {
    modalDom.current.style.transform = transformStr;
  };
  useEffect(() => {
    modalDom.current = document.getElementsByClassName("ant-modal-wrap")[0];
  }, []);
  return (
    <DragM updateTransform={updateTransform}>
      <div>{title}</div>
    </DragM>
  );
};
export default ModalPanel;
