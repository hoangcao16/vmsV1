import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  DownOutlined,
  EyeOutlined,
  LeftOutlined,
  MenuOutlined,
  MinusOutlined,
  PlusOutlined,
  RightOutlined,
  UpOutlined,
} from "@ant-design/icons";
import {
  AutoComplete,
  Button,
  Image,
  Space,
  Spin,
  Table,
  Tooltip,
  Select,
} from "antd";
import { arrayMoveImmutable } from "array-move";
import { isEmpty } from "lodash";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from "react-sortable-hoc";
import playCamApi from "../../api/camproxy/cameraApi";
import ptzControllerApi from "../../api/ptz/ptzController";
import arrow from "../../assets/img/icons/preset/arrow.png";
import Notification from "../../components/vms/notification/Notification";
import getServerCamproxyForPlay from "../../utility/vms/camera";
import { NOTYFY_TYPE } from "../common/vms/Constant";
import "./Preset.scss";

const Preset = (props) => {
  const { idCamera } = props;
  useLayoutEffect(() => {}, []);
  const [rowsPreset, setRowsPreset] = useState([]);
  const [presetTourDatas, setPresetTourDatas] = useState([]);
  const [indexPresetTourChoosed, setIndexPresetTourChoosed] = useState(0);
  const [callPresetAgain, setCallPresetAgain] = useState(false);
  const [callPresetTourAgain, setCallPresetTourAgain] = useState(false);
  const [visiblePresetInPresetTour, setVisiblePresetInPresetTour] =
    useState(false);
  const [selectedPreset, setSelectedPreset] = useState([]);
  const [isAddNewPresetTour, setIsAddNewPresetTour] = useState(false);
  const [isDeletePreset, setIsDeletePreset] = useState(false);
  const [isPresetLastDeleted, setIsPresetLastDeleted] = useState(false);
  const [
    isDisableButtonAddPresetToPresetTour,
    setIsDisableButtonAddPresetToPresetTour,
  ] = useState(true);
  const [isPlayCamera, setIsPlayCamera] = useState(false);
  const [isActionIsStart, setIsActionStart] = useState(false);
  const [searchPreset, setSearchPreset] = useState();
  const [selectPresetTour, setSelectPresetTour] = useState("");
  const [speed, setSpeed] = useState(1);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  // const [newPresetTour, setNewPresetTour] = useState([]);

  const convertRowsPreset = (data) => {
    return data.map((row, index) => {
      return {
        key: index,
        index: index,
        STT: index + 1,
        name: row?.name,
        idPreset: row?.idPreset,
        speed: 1,
      };
    });
  };

  const convertPresetTourDatas = (datas) => {
    const newPresetTourData = datas.map((item, index) => {
      return {
        index: index,
        idPresetTour: item?.idPresetTour,
        name: item?.name,
        listPoint: item?.listPoint.map((point, index) => {
          return {
            index: index,
            STT: index + 1,
            idPreset: point?.idPreset,
            name: point?.name,
            timeDelay: point?.timeDelay,
            speed: point?.speed,
          };
        }),
      };
    });

    const newConvert = [...newPresetTourData]

    return newConvert;
  };

  const DEFAULT_VALUE_PRESET = [
    { key: 0, index: 0, STT: 0, name: "", idPreset: "", speed: 1 },
  ];

  const DEFAULT_VALUE_PRESET_TOUR = [
    {
      index: 0,
      idPresetTour: 0,
      name: "",
      listPoint: [
        { index: 0, STT: 0, idPreset: 0, name: "", timeDelay: 0, speed: 1 },
      ],
    },
  ];

  const getAllPreset = async (params) => {
    if (idCamera) {
      await ptzControllerApi.getAllPreset(params).then((result) => {
        if (isEmpty(result)) {
          setRowsPreset(DEFAULT_VALUE_PRESET);
          return;
        }

        const newRowsPreset = convertRowsPreset(result.data);
        setRowsPreset(newRowsPreset);
      });
    }
  };

  const getAllPresetTour = async (params) => {
    if (idCamera) {
      const payload = await ptzControllerApi.getAllPresetTour(params);
      if (isEmpty(payload)) {
        setPresetTourDatas(DEFAULT_VALUE_PRESET_TOUR);
        return;
      }
      setPresetTourDatas(convertPresetTourDatas(payload.data));
    }
  };
  useEffect(() => {
    setIsPlayCamera(true);
  }, []);

  //call api get all preset
  useEffect(() => {
    let params = {
      cameraUuid: idCamera,
      name: searchPreset,
    };
    getAllPreset(params);
  }, [callPresetAgain]);

  //call api get call preset tour
  useEffect(() => {
    let params = {
      cameraUuid: idCamera,
    };
    getAllPresetTour(params);
  }, [callPresetTourAgain]);

  //cho viec them preset tour
  useEffect(() => {
    if (isAddNewPresetTour) {
      setIndexPresetTourChoosed(presetTourDatas.length - 1);
      setIsAddNewPresetTour(false);
      document.getElementById("choose__preset-tour").value =
        presetTourDatas.length - 1;
      setVisiblePresetInPresetTour(true);
    }
  }, [presetTourDatas.length]);

  //cho viec xoa preset set lam anh huong den preset tour
  useEffect(() => {
    if (isDeletePreset) {
      const valueSelect = document.getElementById("choose__preset-tour").value;

      if (valueSelect === "" || valueSelect === "none") {
        setIsDeletePreset(false);
        return;
      }

      if (isPresetLastDeleted) {
        document.getElementById("choose__preset-tour").value = "";
        document.getElementById("name__preset-tour").value = "";
        setVisiblePresetInPresetTour(false);
        setIndexPresetTourChoosed(0);
        setIsDisableButtonAddPresetToPresetTour(true);
        setIsPresetLastDeleted(false);
        setIsDeletePreset(false);

        return;
      }
      setIsDeletePreset(false);
      return;
    }
  }, [rowsPreset.length]);

  
  useEffect(() => {
    if (isPlayCamera) {
      playCameraOnline(idCamera);
    } else {
      closeCamera();
    }
  }, [isPlayCamera]);
  //begin: selection
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedPreset(selectedRows);
    },
    getCheckboxProps: (record) => ({
      name: record.name,
    }),
  };
  //end: selection

  //begin: for sort
  const DragHandle = sortableHandle(() => (
    <MenuOutlined style={{ cursor: "grab", color: "#999" }} />
  ));

  const SortableItem = sortableElement((props) => <tr {...props} />);
  const SortableContainer = sortableContainer((props) => <tbody {...props} />);
  const onChangOrderPreset = async ({ oldIndex, newIndex }) => {
    const datas = JSON.parse(JSON.stringify(presetTourDatas));
    if (oldIndex !== newIndex) {
      const newData = arrayMoveImmutable(
        [].concat(datas[indexPresetTourChoosed].listPoint),
        oldIndex,
        newIndex
      ).filter((el) => !!el);
      const changeIndexDatas = newData.map((item, index) => {
        return { ...item, STT: index + 1, index: index };
      });
      datas[indexPresetTourChoosed].listPoint = changeIndexDatas;
      const body = {
        cameraUuid: idCamera,
        name: presetTourDatas[indexPresetTourChoosed].name,
        listPoint: datas[indexPresetTourChoosed].listPoint,
        idPresetTour: datas[indexPresetTourChoosed].idPresetTour,
      };
      try {
        const pload = await ptzControllerApi.postSetPresetTour(body);
        if (pload == null) {
          return;
        }
        setPresetTourDatas(datas);
        const warnNotyfi = {
          type: NOTYFY_TYPE.success,
          title: `${t("noti.success")}`,
          description: "Bạn đã thay đổi thứ tự preset thành công",
          duration: 2,
        };
        Notification(warnNotyfi);
      } catch (error) {
        const warnNotyfi = {
          type: NOTYFY_TYPE.warning,
          description: "Đã xảy ra lỗi",
          duration: 2,
        };
        Notification(warnNotyfi);
        console.log(error);
      }
    }
  };
  const DraggableContainer = (props) => (
    <SortableContainer
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={onChangOrderPreset}
      {...props}
    />
  );
  const DraggableBodyRow = ({ className, style, ...restProps }) => {
    const index = presetTourDatas[indexPresetTourChoosed]?.listPoint.findIndex(
      (x) => x.index === restProps["data-row-key"]
    );
    return <SortableItem index={index} {...restProps} />;
  };
  //end: for sort

  const playCameraOnline = async (camUuid) => {
    if (camUuid === "" || camUuid == null) {
      Notification({
        type: NOTYFY_TYPE.warning,
        title: "Xem trực tiếp",
        description: "Camera không xác định",
      });
      return;
    }
    const data = await getServerCamproxyForPlay(camUuid);
    if (data == null) {
      Notification({
        type: NOTYFY_TYPE.warning,
        title: "Xem trực tiếp",
        description: "Không nhận địa chỉ camproxy lỗi",
      });
      return;
    }

    const pc = new RTCPeerConnection();
    pc.addTransceiver("video");
    pc.oniceconnectionstatechange = () => {};
    const spin = document.getElementById("spin-slot-1");
    pc.ontrack = (event) => {
      //binding and play
      const cell = document.getElementById("ptz-slot");
      if (cell) {
        cell.srcObject = event.streams[0];
        cell.autoplay = true;
        cell.controls = false;
        cell.style = "width:100%;height:100%;display:block;object-fit:cover;";
        spin.style.display = "none";
      }
    };
    const token = "123";
    const API = data.camproxyApi;

    pc.createOffer({
      iceRestart: false,
    })
      .then((offer) => {
        spin.style.display = "block";
        pc.setLocalDescription(offer);
        //call api
        playCamApi
          .playCamera(API, {
            token: token,
            camUuid: camUuid,
            offer: offer,
          })
          .then((res) => {
            if (res) {
              pc.setRemoteDescription(res).then((r) => {});
            } else {
              spin.style.display = "none";
              Notification({
                type: NOTYFY_TYPE.warning,
                title: "Xem trực tiếp",
                description: "Nhận offer từ server bị lỗi",
              });
            }
          });
      })
      .catch((error) => {
        spin.style.display = "none";
      })
      .catch(alert)
      .finally(() => {});
  };

  const setUpSpeed = () => {
    if (speed <= 5) {
      setSpeed(speed + 1);
    }
  };

  const setDownSpeed = () => {
    if (speed > 1) {
      setSpeed(speed - 1);
    }
  };

  const closeCamera = () => {
    const cell = document.getElementById("video-slot-1");
    cell.srcObject = null;
    cell.style.display = "none";
  };

  const onPanLeftStart = async () => {
    const payload = {
      cameraUuid: idCamera,
      direction: "left",
      isStop: 0,
      speed: speed,
    };
    try {
      setIsActionStart(true);
      await ptzControllerApi.postPan(payload);
    } catch (error) {
      console.log(error);
    }
  };

  const onPanLeftEnd = async () => {
    const payload = {
      cameraUuid: idCamera,
      direction: "left",
      isStop: 1,
      speed: speed,
    };
    try {
      if (isActionIsStart) {
        await ptzControllerApi.postPan(payload);
        setIsActionStart(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onPanRightStart = async () => {
    const payload = {
      cameraUuid: idCamera,
      direction: "right",
      isStop: 0,
      speed: speed,
    };
    try {
      setIsActionStart(true);
      await ptzControllerApi.postPan(payload);
    } catch (error) {
      console.log(error);
    }
  };

  const onPanRightEnd = async () => {
    const payload = {
      cameraUuid: idCamera,
      direction: "right",
      isStop: 1,
      speed: speed,
    };
    try {
      if (isActionIsStart) {
        await ptzControllerApi.postPan(payload);
        setIsActionStart(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onTiltUpStart = async () => {
    const payload = {
      cameraUuid: idCamera,
      direction: "up",
      isStop: 0,
      speed: speed,
    };
    try {
      setIsActionStart(true);
      await ptzControllerApi.postTilt(payload);
    } catch (error) {
      console.log(error);
    }
  };

  const onTiltUpEnd = async () => {
    const payload = {
      cameraUuid: idCamera,
      direction: "up",
      isStop: 1,
      speed: speed,
    };
    try {
      if (isActionIsStart) {
        await ptzControllerApi.postTilt(payload);
        setIsActionStart(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onTiltDownStart = async () => {
    const payload = {
      cameraUuid: idCamera,
      direction: "down",
      isStop: 0,
      speed: speed,
    };
    try {
      setIsActionStart(true);
      await ptzControllerApi.postTilt(payload);
    } catch (error) {
      console.log(error);
    }
  };

  const onTiltDownEnd = async () => {
    const payload = {
      cameraUuid: idCamera,
      direction: "down",
      isStop: 1,
      speed: speed,
    };
    try {
      if (isActionIsStart) {
        await ptzControllerApi.postTilt(payload);
        setIsActionStart(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onZoomInStart = async () => {
    const payload = {
      cameraUuid: idCamera,
      direction: "in",
      isStop: 0,
      speed: speed,
    };
    try {
      setIsActionStart(true);
      await ptzControllerApi.postZoom(payload);
    } catch (error) {
      console.log(error);
    }
  };

  const onZoomInEnd = async () => {
    const payload = {
      cameraUuid: idCamera,
      direction: "in",
      isStop: 1,
      speed: speed,
    };
    try {
      if (isActionIsStart) {
        await ptzControllerApi.postZoom(payload);
        setIsActionStart(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onZoomOutStart = async () => {
    const payload = {
      cameraUuid: idCamera,
      direction: "out",
      isStop: 0,
      speed: speed,
    };
    try {
      setIsActionStart(true);
      await ptzControllerApi.postZoom(payload);
    } catch (error) {
      console.log(error);
    }
  };
  const onZoomOutEnd = async () => {
    const payload = {
      cameraUuid: idCamera,
      direction: "out",
      isStop: 1,
      speed: speed,
    };
    try {
      if (isActionIsStart) {
        await ptzControllerApi.postZoom(payload);
        setIsActionStart(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletePreset = async (record) => {
    const currRowsPreset = JSON.parse(JSON.stringify(rowsPreset));
    const newRowsPreset = currRowsPreset.filter(
      (item) => item.key !== record.key
    );

    //begin: check preset tour hien tai co phan tu bi xoa hay ko, va phan tu do co la phan tu duy nhat cua preset tour khong
    const curPresetTourDatas = JSON.parse(JSON.stringify(presetTourDatas));
    const listPoint = curPresetTourDatas[indexPresetTourChoosed].listPoint;
    // bien check kiem tra xem listpoint cua preset tour:
    // co phan tu bi xoa hay ko, va phan tu do co la phan tu duy nhat cua preset tour khong duy nhat
    // false: nguoc lai
    let check = true;
    let idPresetFirstElement = listPoint[0].idPreset;
    for (let item of listPoint) {
      if (
        item.idPreset !== idPresetFirstElement ||
        item.idPreset !== record.idPreset
      ) {
        check = false;
        break;
      }
    }
    setIsPresetLastDeleted(check);
    //end: check preset tour hien tai co phan tu bi xoa hay ko, va phan tu do co la phan tu duy nhat cua preset tour khong
    const body = {
      cameraUuid: idCamera,
      idPreset: record.idPreset,
    };
    try {
      const data = await ptzControllerApi.postDeletePreset(body);
      if (data) {
        setIsDeletePreset(true);
        setRowsPreset(convertRowsPreset(newRowsPreset));
        setCallPresetTourAgain(!callPresetTourAgain);

        for (let item of newRowsPreset) {
          document.getElementById(`input-name-preset-${item.idPreset}`).value =
            item.name;
        }
        const warnNotyfi = {
          type: NOTYFY_TYPE.success,
          title: `${t("noti.success")}`,
          description: "Bạn đã xoá preset thành công ",
          duration: 2,
        };
        Notification(warnNotyfi);
      } else {
        const warnNotyfi = {
          type: NOTYFY_TYPE.warning,
          title: "Thất bại",
          description: data.message,
          duration: 2,
        };
        Notification(warnNotyfi);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSetPreset = async () => {
    const payload = {
      cameraUuid: idCamera,
      name: "new name",
    };
    setLoading(true);
    try {
      await ptzControllerApi.postSetPreset(payload).then(async () => {
        let params = {
          cameraUuid: idCamera,
          name: searchPreset,
        };
        await getAllPreset(params);
        setLoading(false);
      });

      const warnNotyfi = {
        type: NOTYFY_TYPE.success,
        title: `${t("noti.success")}`,
        description: "Bạn đã thiết lập preset thành công",
        duration: 2,
      };
      Notification(warnNotyfi);
    } catch (error) {
      const warnNotyfi = {
        type: NOTYFY_TYPE.warning,
        description: "Đã xảy ra lỗi",
        duration: 2,
      };
      Notification(warnNotyfi);
      console.log(error);
    }
  };

  const handleAddPreset = async () => {
    const datas = JSON.parse(JSON.stringify(selectedPreset));
    const newPresetTourDatas = JSON.parse(JSON.stringify(presetTourDatas));
    // const valueSelect = document.getElementById("choose__preset-tour").value;

    // console.log("valueSelect:", valueSelect);

    //neu chua chon preset tour thi tao preset tour moi

    if (selectPresetTour == "none") {
      const convertListPoint = datas.map((point, index) => {
        return {
          index: index,
          STT: index + 1,
          idPreset: point.idPreset,
          name: point.name,
          timeDelay: point.timeDelay || 5,
          speed: point.speed,
        };
      });

      const body = {
        cameraUuid: idCamera,
        name: "new preset tour",
        listPoint: convertListPoint,
        idPresetTour: "",
      };

      try {
        const pload = await ptzControllerApi.postSetPresetTour(body);
        if (pload == null) {
          return;
        }
        setIsAddNewPresetTour(true);




        let params = {
          cameraUuid: idCamera,
        };

       await getAllPresetTour(params);


        document.getElementById("name__preset-tour").value = "new preset tour";

        const warnNotyfi = {
          type: NOTYFY_TYPE.success,
          title: `${t("noti.success")}`,
          description: "Bạn đã thêm mới một preset thành công",
          duration: 2,
        };
        Notification(warnNotyfi);
      } catch (error) {
        const warnNotyfi = {
          type: NOTYFY_TYPE.warning,
          title: "Thất bại",
          description: "Đã xảy ra lỗi",
          duration: 2,
        };
        Notification(warnNotyfi);
        console.log(error);
      }
    }
    //neu da chon preset tour thi them preset vao preset tour
    else {
      const newListPoint = newPresetTourDatas[indexPresetTourChoosed].listPoint;
      for (let item of datas) {
        newListPoint.push(item);
      }
      const convertListPoint = newListPoint.map((point, index) => {
        return {
          index: index,
          STT: index + 1,
          idPreset: point.idPreset,
          name: point.name,
          timeDelay: point.timeDelay || 5,
          speed: point.speed,
        };
      });
      newPresetTourDatas[indexPresetTourChoosed].listPoint = convertListPoint;

      const body = {
        cameraUuid: idCamera,
        name: presetTourDatas[indexPresetTourChoosed].name,
        listPoint: newPresetTourDatas[indexPresetTourChoosed].listPoint,
        idPresetTour: newPresetTourDatas[indexPresetTourChoosed].idPresetTour,
      };
      try {
        const pload = await ptzControllerApi.postSetPresetTour(body);
        if (pload == null) {
          return;
        }
        setPresetTourDatas(newPresetTourDatas);
        const warnNotyfi = {
          type: NOTYFY_TYPE.success,
          title: `${t("noti.success")}`,
          description: "Bạn đã thêm preset thành công",
          duration: 2,
        };
        Notification(warnNotyfi);
      } catch (error) {
        const warnNotyfi = {
          type: NOTYFY_TYPE.warning,
          title: "Thất bại",
          description: "Đã xảy ra lỗi",
          duration: 2,
        };
        Notification(warnNotyfi);
        console.log(error);
      }
    }
  };

  const handleDoneRenamePreset = async (e, record) => {
    const value = document
      .getElementById(`input-name-preset-${record.idPreset}`)
      .value.trim();
    if (value.length >= 100 || value.length === 0) {
      //validate
      const warnNotyfi = {
        type: NOTYFY_TYPE.warning,
        title: "Thất bại",
        description: "Độ dài tên cần lớn hơn 0 nhỏ hơn 100 kí tự",
        duration: 2,
      };
      Notification(warnNotyfi);
      return;
    } else {
      const body = {
        cameraUuid: idCamera,
        idPreset: record.idPreset,
        name: value,
      };

      try {
        await ptzControllerApi.postRenamePreset(body).then(async () => {
          setLoading(true);

          let params = {
            cameraUuid: idCamera,
            name: searchPreset,
          };
          await getAllPreset(params);
          setLoading(false);
        });

        document.getElementById(
          `rename__preset-${record.idPreset}`
        ).style.display = "none";

        // let params = {
        //   cameraUuid: idCamera,
        //   name: "",
        // };

        // const payload = await ptzControllerApi.getAllPreset(params);

        // const convertData = convertRowsPreset(payload.data);

        // setRowsPreset(convertData);

        // setCallPresetTourAgain(!callPresetTourAgain);
        const successNotyfi = {
          type: NOTYFY_TYPE.success,
          title: `${t("noti.success")}`,
          description: "Bạn đã đổi tên preset thành công",
          duration: 2,
        };
        Notification(successNotyfi);
      } catch (error) {
        const warnNotyfi = {
          type: NOTYFY_TYPE.warning,
          description: "Đã xảy ra lỗi",
          duration: 2,
        };
        Notification(warnNotyfi);
        console.log(error);
      }
    }
  };

  const handleCloseRenamePreset = (e, record) => {
    e.stopPropagation();
    document.getElementById(`input-name-preset-${record.idPreset}`).value =
      rowsPreset[record.index].name;
    document.getElementById(`rename__preset-${record.idPreset}`).style.display =
      "none";
  };

  const handleCallPreset = async (record) => {
    const body = {
      cameraUuid: idCamera,
      idPreset: record.idPreset,
    };
    try {
      await ptzControllerApi.postCallPreset(body);
    } catch (error) {
      console.log(error);
    }
  };

  const onChangeOptionSetPresetInPresetTour = async (data, option) => {

    setSelectPresetTour(data);
    if (data === "none") {
      setVisiblePresetInPresetTour(false);
      document.getElementById("name__preset-tour").value = "";
      setIsDisableButtonAddPresetToPresetTour(false);
      document.getElementById("rename__preset-tour").style.display = "none";
      document.getElementById("delete__preset-tour").style.display = "flex";
    } else {
      setIsDisableButtonAddPresetToPresetTour(false);
      document.getElementById("name__preset-tour").value =
        presetTourDatas[data].name;
      setIndexPresetTourChoosed(data);
      setVisiblePresetInPresetTour(true);

      const body = {
        cameraUuid: idCamera,
        idPresetTour: presetTourDatas[data].idPresetTour,
      };
      try {
        await ptzControllerApi.postCallPresetTour(body);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleChangeTimeDelay = async (e, record) => {
    const value = e.target.value;
    const datas = JSON.parse(JSON.stringify(presetTourDatas));
    const index = datas[indexPresetTourChoosed].listPoint.findIndex(
      (item, index) => item.index == record.index
    );
    const data = datas[indexPresetTourChoosed].listPoint[index];
    data.timeDelay = value;
    datas[indexPresetTourChoosed].listPoint.splice(index, 1, data);

    const body = {
      cameraUuid: idCamera,
      name: presetTourDatas[indexPresetTourChoosed].name,
      listPoint: datas[indexPresetTourChoosed].listPoint,
      idPresetTour: datas[indexPresetTourChoosed].idPresetTour,
    };
    try {
      const pload = await ptzControllerApi.postSetPresetTour(body);
      if (pload == null) {
        return;
      }
      setPresetTourDatas(datas);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDoneRenamePresetTour = async (e) => {
    const value = document.getElementById("name__preset-tour").value.trim();

    if (isEmpty(value)) {
      const warnNotyfi = {
        type: NOTYFY_TYPE.warning,
        description:
          "Cập nhập tên không thành công, vui lòng kiểm tra lại tên Preset Tour",
        duration: 2,
      };
      Notification(warnNotyfi);
      return;
    }
    const body = {
      cameraUuid: idCamera,
      idPresetTour: presetTourDatas[indexPresetTourChoosed].idPresetTour,
      name: value,
    };
    try {
      const pload = await ptzControllerApi.postRenamePresetTour(body);
      if (pload == null) {
        return;
      }
      document.getElementById("rename__preset-tour").style.display = "none";
      document.getElementById("delete__preset-tour").style.display = "flex";
      const newPresetTourDatas = JSON.parse(JSON.stringify(presetTourDatas));
      newPresetTourDatas[indexPresetTourChoosed].name = value;
      setPresetTourDatas(newPresetTourDatas);
      const successNotyfi = {
        type: NOTYFY_TYPE.success,
        title: `${t("noti.success")}`,
        description: "Bạn đã đổi tên preset tour thành công",
        duration: 2,
      };
      Notification(successNotyfi);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseRenamePresetTour = (e) => {
    document.getElementById("rename__preset-tour").style.display = "none";
    document.getElementById("delete__preset-tour").style.display = "flex";
    document.getElementById("name__preset-tour").value =
      presetTourDatas[indexPresetTourChoosed].name;
  };

  const handleDeletePresetInPresetTour = async (record) => {
    const newPresetTourDatas = JSON.parse(JSON.stringify(presetTourDatas));
    newPresetTourDatas[indexPresetTourChoosed].listPoint = newPresetTourDatas[
      indexPresetTourChoosed
    ].listPoint.filter((item) => item.index != record.index);

    const newDatas = convertPresetTourDatas(newPresetTourDatas);

    const body = {
      cameraUuid: idCamera,
      name: newDatas[indexPresetTourChoosed].name,
      listPoint: newDatas[indexPresetTourChoosed].listPoint,
      idPresetTour: newDatas[indexPresetTourChoosed].idPresetTour,
    };
    try {
      const pload = await ptzControllerApi.postSetPresetTour(body);
      if (pload == null) {
        return;
      }
      setPresetTourDatas(newDatas);
      const warnNotyfi = {
        type: NOTYFY_TYPE.success,
        title: `${t("noti.success")}`,
        description: "Bạn đã đổi xoá preset thành công",
        duration: 2,
      };
      Notification(warnNotyfi);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletePresetTour = async () => {
    const curPresetTourDatas = JSON.parse(JSON.stringify(presetTourDatas));
    const newPresetTourDatas = curPresetTourDatas.filter(
      (item) =>
        item.idPresetTour !==
        presetTourDatas[indexPresetTourChoosed].idPresetTour
    );

    const body = {
      cameraUuid: idCamera,
      idPresetTour: presetTourDatas[indexPresetTourChoosed].idPresetTour,
    };

    try {
      const pload = await ptzControllerApi.postDeletePresetTour(body);
      if (pload == null) {
        return;
      }
      const warnNotyfi = {
        type: NOTYFY_TYPE.success,
        title: `${t("noti.success")}`,
        description: "Bạn đã xoá preset tour thành công",
        duration: 2,
      };
      Notification(warnNotyfi);
      setVisiblePresetInPresetTour(false);
      setPresetTourDatas(convertPresetTourDatas(newPresetTourDatas));
      setIndexPresetTourChoosed(0);
      setIsDisableButtonAddPresetToPresetTour(true);
      document.getElementById("choose__preset-tour").value = "";
      document.getElementById("name__preset-tour").value = "";
    } catch (error) {
      console.log(error);
    }
    // const new
  };

  const handleFocusInputNamePreset = (record) => {
    document.getElementById(`rename__preset-${record.idPreset}`).style.display =
      "flex";
  };

  const handleFocusNamePresetTour = (e) => {
    document.getElementById("rename__preset-tour").style.display = "flex";
    document.getElementById("delete__preset-tour").style.display = "none";
  };

  const columnsTablePreset = [
    {
      title: `${t("view.storage.NO")}`,
      dataIndex: "STT",
      key: "STT",
      width: "8%",
    },
    {
      title: `${t("view.live.preset_name")}`,
      width: "66%",
      render: (text, record) => {
        return (
          <>
            <input
              id={`input-name-preset-${record.idPreset}`}
              defaultValue={record?.name}
              maxLength={100}
              onFocus={(e) => handleFocusInputNamePreset(record)}
              autoComplete="off"
            />
            <span
              id={`rename__preset-${record.idPreset}`}
              style={{ display: "none" }}
            >
              <CheckOutlined
                id={`confirm-done-icon-rename-${record.idPreset}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDoneRenamePreset(e, record);
                }}
              />
              <CloseOutlined
                id={`confirm-close-icon-rename-${record.idPreset}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCloseRenamePreset(e, record);
                }}
              />
            </span>
          </>
        );
      },
    },
    {
      title: `${t("view.storage.action")}`,
      width: "20%",
      render: (text, record) => {
        // const record = record;
        return (
          <Space>
            <Tooltip placement="top" title={t("view.camera.camera_detail")}>
              <Button
                icon={<EyeOutlined />}
                onClick={(e) => handleCallPreset(record)}
              />
            </Tooltip>
            <Tooltip placement="top" title={t("delete")}>
              <Button
                icon={<DeleteOutlined />}
                onClick={(e) => handleDeletePreset(record)}
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  const { Option } = Select;

  const handleSearchPreset = async (value) => {
    setSearchPreset(value);
    // const params = {
    //   cameraUuid: idCamera,
    //   name: value
    // }
    setCallPresetAgain(!callPresetAgain);
    // getAllPreset(params)
  };

  const handleBlurPreset = (e) => {
    const value = e.target.value.trim();
    setSearchPreset(value);
  };

  const columnsTablePresetTour = [
    {
      title: "",
      dataIndex: "sort",
      width: "6%",
      className: "drag-visible",
      render: () => <DragHandle />,
    },
    {
      title: `${t("view.storage.NO")}`,
      dataIndex: "STT",
      key: "STT",
      width: "8%",
    },
    {
      title: `${t("view.live.preset_name")}`,
      dataIndex: "name",
      key: "name",
      width: "42%",
    },
    {
      title: `${t("view.live.time")}`,
      dataIndex: "timeDelay",
      width: "15%",
      render: (text, record) => {
        return (
          <div>
            <select
              defaultValue={record.timeDelay}
              onChange={(e) => handleChangeTimeDelay(e, record)}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
            </select>
            <span>giây</span>
          </div>
        );
      },
    },
    {
      title: `${t("view.storage.action")}`,
      width: "17%",
      render: (text, record) => {
        // const record = record;
        return (
          <Space>
            <Tooltip placement="top" title={t("delete")}>
              <Button
                icon={<DeleteOutlined />}
                onClick={(e) => handleDeletePresetInPresetTour(record)}
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  const presetTourSelect = [];
  for (let item of presetTourDatas) {
    presetTourSelect.push(
      <Option key={item.index} value={item.index}>
        {item.name}
      </Option>
    );
  }

  return (
    <div className="preset__container">
      <div className="setting__preset">
        <div className="camera__control">
          <div className="camera__direction">
            <Tooltip
              placement="top"
              title={t("view.user.detail_list.left")}
              arrowPointAtCenter={true}
            >
              <Button
                className="left"
                icon={<LeftOutlined />}
                onMouseDown={onPanLeftStart}
                onMouseUp={onPanLeftEnd}
                onMouseLeave={onPanLeftEnd}
              />
            </Tooltip>

            <Tooltip
              placement="top"
              title={t("view.user.detail_list.right")}
              arrowPointAtCenter={true}
            >
              <Button
                className="right"
                icon={<RightOutlined />}
                onMouseDown={onPanRightStart}
                onMouseUp={onPanRightEnd}
                onMouseLeave={onPanRightEnd}
              />
            </Tooltip>

            <Tooltip
              placement="top"
              title={t("view.user.detail_list.up")}
              arrowPointAtCenter={true}
            >
              <Button
                className="up"
                icon={<UpOutlined />}
                onMouseDown={onTiltUpStart}
                onMouseUp={onTiltUpEnd}
                onMouseLeave={onTiltUpEnd}
              />
            </Tooltip>

            <Tooltip
              placement="top"
              title={t("view.user.detail_list.down")}
              arrowPointAtCenter={true}
            >
              <Button
                className="down"
                icon={<DownOutlined />}
                onMouseDown={onTiltDownStart}
                onMouseUp={onTiltDownEnd}
                onMouseLeave={onTiltDownEnd}
              />
            </Tooltip>
            {/* <Button
              className="play-camera"
              onClick={() => {
                setIsPlayCamera(!isPlayCamera);
              }}
              icon={<PlayCircleOutlined />}
            ></Button> */}

            <Tooltip
              placement="top"
              title={"Tốc độ quay"}
              arrowPointAtCenter={true}
            >
              <div className="change__speed-camera">
                <div className="speed">{speed}</div>
                <div className="chang__speed-tool">
                  <Button icon={<UpOutlined />} onClick={setUpSpeed}></Button>
                  <Button
                    icon={<DownOutlined />}
                    onClick={setDownSpeed}
                  ></Button>
                </div>
              </div>
            </Tooltip>
          </div>
          <div className="camera__zoom">
            <Tooltip
              placement="top"
              title={t("view.user.detail_list.zoom_out")}
              arrowPointAtCenter={true}
            >
              <Button
                className="plus"
                icon={<PlusOutlined />}
                onMouseDown={onZoomInStart}
                onMouseUp={onZoomInEnd}
              />
            </Tooltip>
            <span className="zoom">Zoom</span>

            <Tooltip
              placement="top"
              title={t("view.user.detail_list.zoom_in")}
              arrowPointAtCenter={true}
            >
              <Button
                className="minus"
                icon={<MinusOutlined />}
                onMouseDown={onZoomOutStart}
                onMouseUp={onZoomOutEnd}
              />
            </Tooltip>
          </div>
        </div>
        <div className="camera__monitor">
          <Space size="middle">
            <Spin
              className="video-js"
              size="large"
              id="spin-slot-1"
              style={{ display: "none" }}
            />
          </Space>
          <video
            className="video-js"
            width="100%"
            autoPlay="1"
            id="ptz-slot"
            style={{ display: "none" }}
          >
            Trình duyệt không hỗ trợ thẻ video.
          </video>
        </div>
      </div>
      <div className="table__preset--setting">
        <div className="table__preset">
          <div className="preset__tool">
            <AutoComplete
              value={searchPreset}
              onSearch={handleSearchPreset}
              onBlur={handleBlurPreset}
              maxLength={100}
              placeholder={t("view.map.search")}
            />
            <Tooltip
              placement="top"
              title={t("view.user.detail_list.save_preset")}
              arrowPointAtCenter={true}
            >
              <Image src={arrow} preview={false} onClick={handleSetPreset} />
            </Tooltip>
          </div>
          {!loading ? (
            <Table
              rowSelection={{
                type: "checkbox",
                ...rowSelection,
              }}
              dataSource={rowsPreset}
              columns={columnsTablePreset}
              pagination={false}
              scroll={{ y: 240 }}
              className="preset__table"
            />
          ) : (
            <Spin />
          )}
        </div>

        <div className="confirm__choosing--preset">
          <Select
            id="choose__preset-tour"
            onSelect={(value, option) => {
              onChangeOptionSetPresetInPresetTour(value, option);
            }}
            value={selectPresetTour}
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 &&
              option.value !== "@@"
            }
            showSearch
            defaultValue=""
            dropdownClassName="dropdown--choose__preset-tour"
          >
            <Option value="" hidden disabled>
              {t("view.live.add_new_or_edit_preset_tour")}
            </Option>

            <Option value="none">{t("view.live.add_new_preset_tour")}</Option>
            <Option value="@@" disabled style={{ color: "#191919", margin: 0 }}>
              Chọn một preset tour
            </Option>
            {presetTourSelect}
          </Select>

          <Tooltip
            placement="top"
            title={t("view.user.detail_list.save_preset_tour")}
            arrowPointAtCenter={true}
          >
            <Button
              id="add__preset-in-preset-tour"
              onClick={handleAddPreset}
              disabled={isDisableButtonAddPresetToPresetTour}
            >
              <Image src={arrow} preview={false} />
            </Button>
          </Tooltip>
        </div>

        <div className="table__preset-tour">
          <>
            <div className="preset-tour__tool">
              <input
                id="name__preset-tour"
                disabled={!visiblePresetInPresetTour}
                onFocus={(e) => handleFocusNamePresetTour()}
                onBlur={() => {
                  let value =
                    document.getElementById("name__preset-tour").value;
                  document.getElementById("name__preset-tour").value =
                    value.trim();
                }}
                maxLength={100}
                autoComplete="off"
              />

              <span id="rename__preset-tour" style={{ display: "none" }}>
                <CheckOutlined
                  id="confirm__done--rename-preset-tour"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDoneRenamePresetTour(e);
                  }}
                />
                <CloseOutlined
                  id="confirm__close--rename-preset-tour"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCloseRenamePresetTour();
                  }}
                />
              </span>

              <div id="delete__preset-tour">
                <Tooltip placement="top" title={t("delete")}>
                  <Button
                    icon={<DeleteOutlined />}
                    onClick={handleDeletePresetTour}
                    disabled={!visiblePresetInPresetTour}
                  ></Button>
                </Tooltip>
              </div>
            </div>
            <Table
              size="small"
              className="preset-tour__table"
              columns={columnsTablePresetTour}
              dataSource={
                visiblePresetInPresetTour && isPresetLastDeleted
                  ? ""
                  : visiblePresetInPresetTour
                  ? presetTourDatas[indexPresetTourChoosed]?.listPoint
                  : ""
              }
              pagination={false}
              rowKey={(record) => record.index}
              scroll={{ y: 240 }}
              components={{
                body: {
                  wrapper: DraggableContainer,
                  row: DraggableBodyRow,
                },
              }}
            />
          </>
        </div>
      </div>
    </div>
  );
};
export default Preset;
