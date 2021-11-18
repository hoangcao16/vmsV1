import React, { useEffect, useState, useRef } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import "antd/dist/antd.css";
import "../../assets/scss/pages/live.scss";
import "../../assets/scss/pages/map.scss";
import "../../assets/scss/app-icons.scss";
import { useDispatch } from "react-redux"
import DraggableCameraList from "./DraggableCameraList";
import cameraApi from "../../api/controller-api/cameraApi";
import bookmarkApi from "../../api/controller-api/bookmarkApi";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import playCamApi from "../../api/camproxy/cameraApi";
import BookmarkSetting from "../../components/vms/bookmark/BookmarkSetting";
import getServerCamproxyForPlay from "../../utility/vms/camera";
import LiveCameraSlot from "./LiveCameraSlot";
import MenuTools from "./MenuTools";
import Notification from "../../components/vms/notification/Notification";
import { doSwap } from "../../utility/vms/swapElement";
import {
  removePlayBackHlsLive,
  setPlayBackHlsLive,
} from "../../redux/actions/live";
import {
  GRID1X1,
  GRID2X2,
  GRID3X3,
  GRID4X4,
  GRIDALL,
} from "../common/vms/constans/grid";
import lionSvcApi from "../../api/lion/cameraApi";
import {
  SEEK_BACK,
  SEEK_FORWARD,
  SEEK_CURRENT_TIME,
  STEP_SIZE_MINUTE,
} from "../common/vms/constans/playback";
import playbackApi from "../../api/playback/cameraApi";
import Hls from "hls.js";

import { changeZoom } from "./../../redux/actions/customizer/index";
import { NOTYFY_TYPE, PAGE_SIZE } from "../common/vms/Constant";
import { captureVideoFrame } from "../../utility/vms/captureVideoFrame";
import moment from "moment";
import { v4 as uuidV4 } from "uuid";
import ExportEventFileApi from "../../actions/api/exporteventfile/ExportEventFileApi";
import { getBase64Text } from "../../utility/vms/getBase64Text";
import cheetahSvcApi from "../../api/cheetah/fileApi";
import tokenApi from "../../api/authz/token";

const initialDataGrid = [...Array(16).keys()];
let currentGridSize = 16;
const Live = (props) => {
  const dispatch = useDispatch();
  const [colClass, setColClass] = useState("col-3");
  const [rowClass, setRowClass] = useState("h-25");
  const [dataGrid, setDataGrid] = useState(initialDataGrid);
  const [cameras, setCameras] = useState([]);
  const [totalCameras, setTotalCameras] = useState(0);
  const [addedCameras, setAddedCameras] = useState([]);
  const [filter, setFilter] = useState({});
  const [search, setSearch] = useState("");
  const [liveMode, setLiveMode] = useState(true);
  const [isMaximize, setIsMaximize] = useState(false);
  const [isModalBookmarkVisible, setIsModalBookmarkVisible] = useState(false);
  const [reloadBookmark, setReloadBoookmark] = useState(false);
  let prevSelectedSlotRef = useRef(-1); // prev origin slot
  let currentSelectSlotRef = useRef(-1); // origin slot
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(
    moment().subtract(1, "h").unix()
  );
  const [currentMenuControl, setCurrentMenuControl] = useState(null);
  const [idCurrCameraSelected, setIdCurrCameraSelected] = useState(null);
  const [resetSpeed, setResetSpeed] = useState(false);
  const [reloadLiveMenuTool, setReloadLiveMenuTool] = useState(false);
  const [curSpeed, setCurSpeed] = useState(1);
  let currentItemIdx = 0;
  useEffect(() => {
    initialDataGrid.forEach((it) =>
      addedCameras.push({
        id: it,
      })
    );
    // get default screen and apply it to grid
    fetchDefaultScreen();
    const refreshTokenTimer = setInterval(() => {
      tokenApi.refreshToken();
    }, 1 * 60 * 60 * 1000); // 1 hour

    return () => {
      clearInterval(refreshTokenTimer);
    };
  }, []);

  useEffect(() => {
    fetchCameras(filter, search)
  }, [filter, search]);

  /**
   * Hàm này tạo screen với dầy đủ thông tin của từng  camera trên lưới: Ví dụ: tên cam, uuid, id
   * @param defaultScreen
   * @returns {Promise<screenInfo>}
   */
  const buildFullInfoScreenFromScreen = async (defaultScreen) => {
    if (!defaultScreen && defaultScreen.cameraUuids) {
      return null;
    }
    let cameraUuids = [];
    defaultScreen.cameraUuids.forEach((it) => {
      if (it != "") {
        cameraUuids.push(it);
      }
    });
    if (cameraUuids.length <= 0) {
      Notification({
        type: "warning",
        title: "Chọn màn hình ưa thích",
        description: "Không tồn tại bất kỳ camera trong màn hình này",
      });
      return null;
    }

    try {
      const resData = await cameraApi.searchCamerasWithUuids({
        uuids: defaultScreen.cameraUuids,
      });
      if (resData && resData.payload) {
        const camList = resData.payload;
        const tmp = initialDataGrid.map((it, idx) => {
          if (defaultScreen.cameraUuids[idx] != "") {
            const camUuid = defaultScreen.cameraUuids[idx];
            const camFoundIdx = camList.findIndex((ite) => ite.uuid == camUuid);
            if (camFoundIdx < 0) {
              Notification({
                type: "warning",
                title: "Màn hình mặc định",
                description: "Không tồn tại camera này",
              });
              return it;
            }
            const cam = camList[camFoundIdx];
            return {
              id: idx,
              camId: cam.id,
              cameraUuid: camUuid,
              cameraName: cam.name,
            };
          }
          return it;
        });
        let screen = { ...defaultScreen };
        screen.camList = tmp;
        return screen;
      } else {
        return null;
      }
    } catch (err) {
      Notification({
        type: "warning",
        title: "Xem danh sách màn hình",
        description: "Lỗi:" + err.toString(),
      });
      return null;
    }
  };

  const fetchDefaultScreen = async () => {
    try {
      const data = await bookmarkApi.getDefault();
      if (data && data.payload && data.payload.length >= 1) {
        const defaultScreen = data.payload[0];
        // Get all cam info of each slot from a screen
        const screen = await buildFullInfoScreenFromScreen(defaultScreen);
        if (screen == null) {
          Notification({
            type: "warning",
            title: "Màn hình mặc định",
            description: "Không thể lấy thông tin màn hình mặc định",
          });
        }
        handleBookmarkOk(screen);
      }
    } catch (e) {
      Notification({
        type: "warning",
        title: "Màn hình mặc định",
        description: "Bạn chưa thiết lập màn hình mặc định",
      });
    }
  };
  /**
   * @slotId: thứ tự trên slot lưới
   * @return: {id}: Giá trị thật sự của của thẻ  video-slot-{id}
   * Cần hàm này vì việc đổi chỗ 2 lưới cho nhau ảnh hưởng đến video thực sự ở dưới mỗi slot này
   */
  const findCameraIndexInGrid = (slotId) => {
    return addedCameras.findIndex((item) => item.id == slotId);
  };

  /**  Change mode
   *  live -> playback mode: do nothing
   *  playback -> live: all cameras need to live immediately
   */
  const onChaneModePlayCam = (mode) => {
    const prevMode = liveMode;
    if (!prevMode && mode) {
      // previous state is playback and now is live mode
      //Play all cameras with live
      addedCameras.forEach((cam, id) => {
        if (cam && cam.camUuid) {
          liveCamera(cam.camUuid, cam.camId, cam.id);
        }
      });
    }
    setLiveMode(mode);
  };

  // LIVE
  const liveCamera = async (camUuid, camId, slotIdx) => {
    if (camUuid == "" || camUuid == null) {
      Notification({
        type: "warning",
        title: "Xem trực tiếp",
        description: "Camera không xác định",
      });
      return;
    }
    const data = await getServerCamproxyForPlay(camUuid);
    if (data == null) {
      Notification({
        type: "warning",
        title: "Xem trực tiếp",
        description: "Không nhận được địa chỉ camproxy ",
      });
      return;
    }

    const pc = new RTCPeerConnection();
    pc.addTransceiver("video");
    pc.oniceconnectionstatechange = () => {
    };
    const spin = document.getElementById("spin-slot-" + slotIdx);
    pc.ontrack = (event) => {
      //binding and play
      const cell = document.getElementById("video-slot-" + slotIdx);
      if (cell) {
        cell.srcObject = event.streams[0];
        cell.autoplay = true;
        cell.controls = false;
        cell.style = "width:100%;height:100%;display:block;object-fit:fill;";
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
        pc.setLocalDescription(offer).then((r) => {
        });
        //call camproxy
        playCamApi
          .playCamera(API, {
            token: token,
            camUuid: camUuid,
            offer: offer,
          })
          .then((res) => {
            if (res) {
              pc.setRemoteDescription(res).then((r) => {
              });
            } else {
              spin.style.display = "none";
              Notification({
                type: "warning",
                title: "Xem trực tiếp",
                description: "Nhận offer từ server bị lỗi",
              });
            }
          });
      })
      .catch((error) => {
        console.log("error:", error);
        spin.style.display = "none";
      })
      .catch((e) => console.log(e))
      .finally(() => { });
  };

  const playbackCamera = async (name, camUuid, camId, originSlotId) => {
    playbackCameraWithSeekType(
      name,
      camUuid,
      camId,
      originSlotId,
      SEEK_CURRENT_TIME
    );
  };

  /**
   * originSlotId: slotid gốc trước khi di chuyển
   * slotId: Số thứ tự hiện tại trên lưới
   */
  const playbackCameraWithSeekType = async (
    name,
    camUuid,
    camId,
    originSlotId,
    seekType
  ) => {
    if (camId == "" || camId == null) {
      Notification({
        type: "warning",
        title: "Playback",
        description: "Camera không xác định",
      });
      return;
    }

    let seekTime = currentPlaybackTime;
    switch (seekType) {
      case SEEK_BACK:
        seekTime = Math.ceil(currentPlaybackTime - STEP_SIZE_MINUTE * 60);
        break;
      case SEEK_FORWARD:
        seekTime = Math.ceil(currentPlaybackTime + STEP_SIZE_MINUTE * 60);
        break;
      case SEEK_CURRENT_TIME:
        break;
      default:
        return;
    }

    await playbackCameraWithSeekTime(
      name,
      camUuid,
      camId,
      originSlotId,
      seekTime
    );
  };

  const playbackCameraWithSeekTime = async (
    name,
    camUuid,
    camId,
    originSlotId,
    seekTime
  ) => {
    if (camId == "" || camId == null) {
      Notification({
        type: "warning",
        title: "Playback",
        description: "Camera không xác định",
      });
      return;
    }
    const playbackPermissionReq = {
      cameraUuid: camUuid,
      startTime: seekTime,
    };
    try {
      const data = await lionSvcApi.checkPermissionForViewOnline(
        playbackPermissionReq
      );
      if (data) {
        const startReq = {
          cameraId: camId,
          date: seekTime,
          token: data.token,
        };
        const payload = await playbackApi.startPlayback(
          data.playbackUrl,
          startReq
        );
        if (payload === null) return;
        const videoCellName = "video-slot-" + originSlotId;
        const slotIdx = findCameraIndexInGrid(originSlotId);
        const video = document.getElementById(videoCellName);
        const videoSrc =
          data.playbackUrl + "/play/hls/" + payload.reqUuid + "/index.m3u8";
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = videoSrc;
        } else if (Hls.isSupported()) {
          let tmp = [...addedCameras];
          if (tmp[slotIdx] && tmp[slotIdx].hls) {
            tmp[slotIdx].hls.destroy();
          } else {
            tmp[slotIdx] = {
              camUuid: camUuid,
              camId: camId,
              id: originSlotId,
              name: name,
              liveMode: false,
            };
          }
          video.srcObject = null;
          tmp[slotIdx].hls = new Hls({
            autoStartLoad: true,
            startPosition: -1,
            debug: false,
          });
          dispatch(setPlayBackHlsLive(tmp[slotIdx]));
          tmp[slotIdx].hls.loadSource(videoSrc);
          tmp[slotIdx].hls.attachMedia(video);
          tmp[slotIdx].hls.on(
            Hls.Events.MANIFEST_PARSED

          );
          tmp[slotIdx].hls.on(
            Hls.Events.MEDIA_ATTACHED
          );
          tmp[slotIdx].hls.on(Hls.Events.ERROR, function (event, data) {
            if (data.fatal) {
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  // try to recover network error

                  tmp[slotIdx].hls.startLoad();
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR:

                  tmp[slotIdx].hls.recoverMediaError();
                  break;
                default:
                  tmp[slotIdx].hls.destroy();
                  break;
              }
            }
          });

          video.autoplay = true;
          video.controls = false;
          video.style = "width:100%;height:100%;display:block;object-fit:fill;";
          video.style.display = "block";
          video.play();
          setResetSpeed(!resetSpeed);
          setCurrentPlaybackTime(seekTime);
          setAddedCameras(tmp);
          onSelectVideoSlot(slotIdx);
        }
      }
    } catch (e) {
      console.log("e:", e.toString());
      // Notification({
      //   type: "warning",
      //   title: "Playback",
      //   description: e.toString(),
      // });
    }
  };
  const handleSelectCameraCallback = (cam, idx) => { };

  const fetchCameras = async (
    filter,
    search,
    pageSize = PAGE_SIZE,
    currentPage = 1
  ) => {
    try {
      if (filter != null) {
        filter.name = search;
        filter.size = pageSize;
        filter.page = currentPage;
      } else {
        filter = {
          page: currentPage,
          size: pageSize,
        };
      }
      const data = await cameraApi.getAll(filter);
      if (data && data.payload) {
        setCameras(data.payload);
        setTotalCameras(data.metadata.total);
      }
    } catch (error) {
      Notification({
        type: "warning",
        title: "Lọc cameras",
        description: "Lỗi trong quá trình lọc camera",
      });
      console.log(error);
    }
  };

  // FILTER
  const handleApplyFilterCallback = async (filter) => {
    setFilter(filter);
  };

  const handleSearch = (search) => {
    setSearch(search);
  };

  const getListStyle = (isDraggingOver) => ({
    background: isDraggingOver ? "lightyellow" : "",
    border: isDraggingOver ? "0.5px solid #626262" : "0.5px solid #626261",
  });

  const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    height: isDragging ? "auto" : "100%",
    // styles we need to apply on draggables
    ...draggableStyle,
  });

  /**
   * Moves an item from one list to another grid.
   *
   * Hàm này dùng để di chuyển video giữa các grid. Có thể xử lý gọi API ở đây để update vị trí cho BE, vị trí chính là
   * 2 thuộc tính sourceIndex và destinationIndex
   */
  const move = (source, destination, draggableId) => {
    const result = [...addedCameras];
    const sourceIndex = draggableId.replace("draggable-video-", "");
    const destinationIndex = destination.droppableId.replace("droppable-", "");

    const cellSrc = addedCameras[sourceIndex];
    const cellDes = addedCameras[destinationIndex];
    const divDes = document.getElementById("wrapper-slot-" + cellDes.id);
    const divSrc = document.getElementById("wrapper-slot-" + cellSrc.id);
    if (divDes == null || divDes == "undefined") {
      const divDes = document.getElementById(
        "wrapper-slot-" + destinationIndex
      );
      doSwap(divSrc, divDes);
    } else {
      doSwap(divSrc, divDes);
    }

    const sourceVideo = result[sourceIndex];
    const destinationVideo = result[destinationIndex];
    result[destinationIndex] = sourceVideo;
    result[sourceIndex] = destinationVideo;

    return result;
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    // dropped outside the list
    if (!destination) {
      return;
    }
    // draggableId là camera id được kéo thả vào grid => Xử lý phần khởi tạo video stream tại đây và add stream url
    // Slot được chọn chính là index chứa trong droppableId (xem hàm move)
    if (source.droppableId === "droppable-camera-list") {
      const streamUrl = "http://techslides.com/demos/sample-videos/small.mp4";
      const des =
        addedCameras[destination.droppableId.replace("droppable-", "")];
      result = [...addedCameras];
      const camInfoArr = draggableId.split("_");

      if (camInfoArr.length < 3) {
        Notification({
          type: "error",
          title: "Xem trực tiếp",
          description: "Định dạng camera không đúng",
        });
        return;
      }

      result[destination.droppableId.replace("droppable-", "")] = {
        id: des.id,
        name: camInfoArr[1],
        camUuid: camInfoArr[0],
        camId: camInfoArr[2],
        streamUrl: streamUrl,
        liveMode: liveMode,
        hls: null,
      };
      setIdCurrCameraSelected(result[des?.id]?.camUuid);

      switch (liveMode) {
        case true:
          liveCamera(camInfoArr[0], camInfoArr[2], des.id).then();
          setAddedCameras(result);
          break;
        case false:
          playbackCamera(
            camInfoArr[1],
            camInfoArr[0],
            camInfoArr[2],
            des.id
          ).then();
          break;
      }
    } else if (source.droppableId !== destination.droppableId) {
      const result = move(source, destination, draggableId);
      setAddedCameras(result);
    }
  };

  // CONTROL CAMERA
  const updateGridSize2 = (size) => {
    currentGridSize = size;
    updateGridSize();
  };
  const updateGridSize = () => {
    const tmp = initialDataGrid;
    let rowHeightClass;
    let videoColumnClass;
    switch (currentGridSize) {
      case 1:
        rowHeightClass = "h-100";
        videoColumnClass = "col-12";
        break;

      case 4:
        rowHeightClass = "h-50";
        videoColumnClass = "col-6";
        break;

      case 9:
        rowHeightClass = "h-33";
        videoColumnClass = "col-4";
        break;

      default:
        rowHeightClass = "h-25";
        videoColumnClass = "col-3";
        break;
    }

    setColClass(videoColumnClass);
    setRowClass(rowHeightClass);
    setIsMaximize(false);
    removeFullGrid(currentItemIdx);
  };
  const setFileName = (type) => {
    if (type === 0) {
      return "Cut." + moment().format("DDMMYYYY.hhmmss") + ".mp4";
    }
    return "Cap." + moment().format("DDMMYYYY.hhmmss") + ".jpg";
  };
  const startCaptureCamera = async (
    slotId,
    startTime,
    requestId,
    currLiveMode
  ) => {
    const slotIdx = findCameraIndexInGrid(slotId);
    const cameras = [...addedCameras];
    let camera = cameras[slotIdx];

    try {
      if (currLiveMode) {
        const fileName = setFileName(0);
        const startCaptureStreamReq = {
          cameraId: camera.camId,
          cameraName: camera.name,
          startCaptureTime: +startTime,
          requestId: requestId,
          fileName: fileName,
        };
        console.log(
          `>>>>> [${camera.name}] start -> request: `,
          startCaptureStreamReq
        );
        const startCaptureStreamRes = await cheetahSvcApi.startCaptureStream(
          startCaptureStreamReq
        );
        if (startCaptureStreamRes && startCaptureStreamRes.code === 900) {
          console.log(
            `>>>>> [${camera.name}] start -> response: `,
            startCaptureStreamRes
          );
          Notification({
            type: NOTYFY_TYPE.success,
            title: "Playback",
            description:
              "Bắt đầu quá trình ghi hình cho camera [" + camera.name + "]",
          });
          camera = { ...camera, isRec: true };
          cameras[slotIdx] = camera;
          setAddedCameras([...cameras]);
        } else {
          camera = { ...camera, hasError: true, isRec: false };
          cameras[slotIdx] = camera;
          setAddedCameras([...cameras]);
        }
      } else {
        Notification({
          type: NOTYFY_TYPE.success,
          title: "Playback",
          description:
            "Bắt đầu quá trình ghi hình cho camera [" + camera.name + "]",
        });
        camera = { ...camera, isRec: true };
        cameras[slotIdx] = camera;
        setAddedCameras([...cameras]);
      }
    } catch (e) {
      console.log(e)
    }
  };
  const stopCaptureCamera = async (
    slotId,
    startTime,
    stopTime,
    requestId,
    currLiveMode,
    newAddedCameras
  ) => {
    const slotIdx = findCameraIndexInGrid(slotId);
    // In case call stopCaptureCamera from interval timer [addedCameras] always keep old state
    // thus i used useRef to pass newest value to [newAddedCameras]
    const cameras = [...newAddedCameras];
    let camera = cameras[slotIdx];

    if (currLiveMode) {
      const stopCaptureStreamReq = {
        cameraId: camera.camId,
        cameraName: camera.name,
        stopCaptureTime: +stopTime,
        requestId: requestId,
      };
      console.log(
        `>>>>> [${camera.name}] stop -> request: `,
        stopCaptureStreamReq
      );
      const stopCaptureStreamRes = await cheetahSvcApi.stopCaptureStream(
        stopCaptureStreamReq
      );
      if (stopCaptureStreamRes && stopCaptureStreamRes.code === 900) {
        console.log(
          `>>>>> [${camera.name}] stop -> response: `,
          stopCaptureStreamRes
        );
        Notification({
          type: NOTYFY_TYPE.success,
          title: "Playback",
          description:
            "Dừng quá trình ghi hình cho camera [" + camera.name + "]",
        });
        camera = { ...camera, isRec: false };
        cameras[slotIdx] = camera;
        setAddedCameras([...cameras]);
      } else {
        camera = { ...camera, hasError: true, isRec: false };
        cameras[slotIdx] = camera;
        setAddedCameras([...cameras]);
      }
    } else {
      const videoCellName = "video-slot-" + slotId;
      const video = document.getElementById(videoCellName);
      const playbackTimeInSecond = Math.floor(video.currentTime);
      const recordTimeInSecond = Math.ceil((stopTime - startTime) / 1000);

      const startT = currentPlaybackTime + playbackTimeInSecond;
      const stopT = startT + recordTimeInSecond;
      const fileName = setFileName(0);
      const capturePlaybackReq = {
        cameraId: camera.camId,
        cameraName: camera.name,
        startCaptureTime: +startT,
        stopCaptureTime: +stopT,
        fileName: fileName,
      };
      console.log(
        `>>>>> [${camera.name}] capturePlayback -> request: `,
        capturePlaybackReq
      );
      const capturePlaybackRes = await cheetahSvcApi.capturePlayback(
        capturePlaybackReq
      );
      if (
        capturePlaybackRes &&
        capturePlaybackRes.code === 900 &&
        capturePlaybackRes.payload
      ) {
        console.log(
          `>>>>> [${camera.name}] capturePlayback -> response: `,
          capturePlaybackRes
        );

        // Save event file
        const uuid = uuidV4();
        let requestObject = {
          id: "",
          uuid: uuid,
          eventUuid: "",
          eventName: "",
          name: fileName,
          violationTime: startT,
          createdTime: new Date().getTime(),
          note: "",
          cameraUuid: camera.camUuid,
          cameraName: camera.name,
          type: 0,
          length: capturePlaybackRes.payload.length,
          address: "",
          rootFileUuid: "",
          pathFile: capturePlaybackRes.payload.path + "/" + fileName,
          isImportant: false,
          thumbnailData: capturePlaybackRes.payload.thumbnailData,
          nginx_host: capturePlaybackRes.payload.nginx_host,
          diskId: capturePlaybackRes.payload.diskId,
        };
        const response = await ExportEventFileApi.createNewEventFile(
          requestObject
        );
        if (response) {
          Notification({
            type: NOTYFY_TYPE.success,
            title: "Playback",
            description:
              "Dừng quá trình ghi hình cho camera [" + camera.name + "]",
          });
        }
        camera = { ...camera, isRec: false };
        cameras[slotIdx] = camera;
        setAddedCameras([...cameras]);
      } else {
        camera = { ...camera, hasError: true, isRec: false };
        cameras[slotIdx] = camera;
        setAddedCameras([...cameras]);
      }
    }
  };
  const startSnapshotCamera = (slotId) => {
    const slotIdx = findCameraIndexInGrid(slotId);
    const camera = addedCameras[slotIdx];
    const cell = document.getElementById("video-slot-" + slotId);
    const blob = captureVideoFrame(cell, null, "jpeg").blob;
    if (blob) {
      const fileName = setFileName(1);
      const uuid = uuidV4();
      const createdDate = new Date();
      const createdTime = createdDate.getTime();
      const violationTime = Math.floor(createdDate.setMilliseconds(0) / 1000);
      let eventFile = {
        id: "",
        uuid: uuid,
        eventUuid: "",
        eventName: "",
        name: fileName,
        violationTime: violationTime,
        createdTime: createdTime,
        note: "",
        cameraUuid: camera.camUuid,
        cameraName: camera.name,
        type: 1,
        length: 0,
        address: "",
        rootFileUuid: "",
        pathFile: "",
        isImportant: false,
        thumbnailData: [""],
        nginx_host: "",
        blob: blob,
      };
      ExportEventFileApi.uploadFile(
        eventFile.uuid + ".jpeg",
        eventFile.blob
      ).then(async (result) => {
        if (
          result.data &&
          result.data.payload &&
          result.data.payload.fileUploadInfoList.length > 0
        ) {
          let path = result.data.payload.fileUploadInfoList[0].path;
          let { blob, ...requestObject } = eventFile;
          getBase64Text(eventFile.blob, async (thumbnailData) => {
            requestObject = Object.assign({
              ...requestObject,
              pathFile: path,
              thumbnailData: [
                thumbnailData.replace("data:image/jpeg;base64,", ""),
              ],
            });
            const response = await ExportEventFileApi.createNewEventFile(
              requestObject
            );
            if (response) {
              Notification({
                type: NOTYFY_TYPE.success,
                title: "Playback",
                description:
                  "Bạn đã chụp ảnh camera thành công, file được lưu trong danh sách file lưu trữ.",
              });
            }
          });
        } else {
          Notification({
            type: NOTYFY_TYPE.warning,
            title: "Playback",
            description: "Đã xảy ra lỗi trong quá trình lưu file",
          });
        }
      });
    }
  };
  const maximumCamera = (originSlotId) => {
    setIsMaximize(true);
    const slotIdx = findCameraIndexInGrid(originSlotId);
    const targetSlot = document.getElementById("droppable-" + slotIdx);
    targetSlot.classList.add("full-grid");
    switch (currentGridSize) {
      case 1:
        targetSlot.classList.remove("col-12");
        break;
      case 4:
        targetSlot.classList.remove("col-6");
        break;
      case 9:
        targetSlot.classList.remove("col-4");
        break;
      default:
        targetSlot.classList.remove("col-3");
        break;
    }
    currentItemIdx = originSlotId;
  };
  const minimumGrid = () => {
    updateGridSize2(currentGridSize);
  };
  const removeFullGrid = (originSlotId) => {
    const slotIdx = findCameraIndexInGrid(originSlotId);
    const targetSlot = document.getElementById("droppable-" + slotIdx);
    if (targetSlot) {
      targetSlot.classList.remove("full-grid");
    }
  };
  const maxMinCamera = (originSlotId) => {
    if (!isMaximize) {
      maximumCamera(originSlotId);
    } else {
      setIsMaximize(false);
      minimumGrid();
      const slotIdx = findCameraIndexInGrid(originSlotId);
      const targetSlot = document.getElementById("droppable-" + slotIdx);
      targetSlot.classList.remove("full-grid");
      switch (currentGridSize) {
        case 1:
          targetSlot.classList.add("col-12");
          break;
        case 4:
          targetSlot.classList.add("col-6");
          break;
        case 9:
          targetSlot.classList.add("col-4");
          break;
        default:
          targetSlot.classList.add("col-3");
          break;
      }
    }
  };

  const zoomOutByDoubleClick = (originSlotId) => {
    maxMinCamera(originSlotId);
  };

  /**
   * originSlotId: Thể hiện giá trị index gốc của lưới ban đầu trước khi di chuyển
   * slotIdx: Là chỉ số thứ tự của slot trên lưới
   */
  const closeCamera = (originSlotId) => {
    const slotIdx = findCameraIndexInGrid(originSlotId);
    let result = [...addedCameras];
    if (result[slotIdx]) {
      if (result[slotIdx].hls) {
        result[slotIdx].hls.destroy();
        dispatch(removePlayBackHlsLive(result[slotIdx]));
      }
      delete result[slotIdx];
      result[slotIdx] = {
        id: originSlotId,
      };
      setAddedCameras(result);
      const cell = document.getElementById("video-slot-" + originSlotId);
      if (cell) {
        cell.srcObject = null;
        cell.style.display = "none";
      }

      removeFullGrid(originSlotId);
      const targetSlot = document.getElementById("droppable-" + slotIdx);
      if (targetSlot) {
        targetSlot.classList.remove("full-grid");
      }
      switch (currentGridSize) {
        case 1:
          targetSlot.classList.add("col-12");
          break;
        case 4:
          targetSlot.classList.add("col-6");
          break;
        case 9:
          targetSlot.classList.add("col-4");
          break;
        default:
          targetSlot.classList.add("col-3");
          break;
      }
    }
  };

  const handleBookmarkSaveCallback = async (bookMarkName) => {
    //send
    let gridType = "";
    switch (currentGridSize) {
      case 1:
        gridType = GRID1X1;
        break;
      case 4:
        gridType = GRID2X2;
        break;
      case 9:
        gridType = GRID3X3;
        break;
      case 16:
        gridType = GRID4X4;
        break;
      default:
        gridType = GRID4X4;
        break;
    }

    let cameraUuids = [];
    let isEmptyGrid = true;
    addedCameras.forEach((item, id) => {
      // Không lưu những camera mà không nằm trong scope màn hình
      if (currentGridSize <= id) {
        cameraUuids.push("");
        return;
      }
      if (item.camUuid && item.name) {
        cameraUuids.push(item.camUuid);
        isEmptyGrid = false;
      } else {
        cameraUuids.push("");
      }
    });
    if (isEmptyGrid) {
      Notification({
        type: "warning",
        title: "Màn hình ưa thích",
        description: "Lỗi: Không có camera nào trong lưới",
      });
      return;
    }
    if (bookMarkName === "") {
      Notification({
        type: "warning",
        title: "Màn hình ưa thích",
        description: "Lỗi: Tên màn hình không được để trống",
      });
      return;
    }
    const record = {
      cameraUuids: cameraUuids,
      gridType: gridType,
      name: bookMarkName,
    };
    try {
      const response = await bookmarkApi.createNew(record);
      if (response && response.payload) {
        Notification({
          type: "success",
          title: "Màn hình ưa thích",
          description: "Lưu màn hình ưa thích thành công",
        });
      }
    } catch (err) {
      Notification({
        type: "warning",
        title: "Màn hình ưa thích",
        description: "Lưu màn hình ưa thích thất bại. Lỗi:" + err.toString(),
      });
    }
  };

  const handleOpenBookmarkSetting = () => {
    setIsModalBookmarkVisible(true);
    setReloadBoookmark(!reloadBookmark);
  };

  const handleBookmarkOk = (selectedItem) => {
    try {
      setIsModalBookmarkVisible(false);
      let cams = [];
      if (selectedItem && selectedItem.cameraUuids) {
        selectedItem.cameraUuids.forEach((camUuid, idx) => {
          closeCamera(idx);
          cams[idx] = {
            id: idx,
          };
          if (camUuid !== "") {
            const camFound = selectedItem.camList.find(
              (it, id) => it.cameraUuid === camUuid
            );
            cams[idx] = {
              id: idx,
              name: camFound.cameraName,
              camUuid: camUuid,
              camId: camFound.camId,
              streamUrl: "",
              isPlay: true,
              selected: false,
            };
            liveCamera(camUuid, camFound.camId, idx);
          }
        });
        setAddedCameras(cams);
        let size = 16;
        switch (selectedItem.gridType) {
          case GRID1X1:
            size = 1;
            break;
          case GRID2X2:
            size = 4;
            break;
          case GRID3X3:
            size = 9;
            break;
          case GRID4X4:
            size = 16;
            break;
        }
        updateGridSize2(size);
      }
    } catch (err) {
      Notification({
        type: "warning",
        title: "Màn hình ưa thích",
        description:
          "Áp dụng màn hình ưa thích thất bai. Lỗi:" + err.toString(),
      });
    }
  };

  const handleBookmarkCancel = () => {
    setIsModalBookmarkVisible(false);
  };

  const onSelectVideoSlot = (originSlotId) => {
    const slotIdx = findCameraIndexInGrid(originSlotId);
    prevSelectedSlotRef.current = currentSelectSlotRef.current;


    const prevCell = document.getElementById(
      "video-slot-" + prevSelectedSlotRef.current
    );
    if (prevCell != null) {
      prevCell.style.border = "";
      prevCell.playbackRate = 1;
      setCurSpeed(1)
    }
    const cam = addedCameras[slotIdx];
    const cell = document.getElementById("video-slot-" + cam.id);
    cell.style.border = "1px solid yellow";
    currentSelectSlotRef.current = cam.id;
    setIdCurrCameraSelected(addedCameras[slotIdx].camUuid);
  };

  const playbackCameraSeekTypeCallback = (seekType) => {
    if (currentSelectSlotRef.current != -1) {
      const slotIdx = findCameraIndexInGrid(currentSelectSlotRef.current);
      const selectedCam = addedCameras[slotIdx];
      playbackCameraWithSeekType(
        selectedCam.name,
        selectedCam.camUuid,
        selectedCam.camId,
        selectedCam.id,
        seekType
      ).then();
    } else {
      Notification({
        type: "warning",
        title: "Playback",
        description: "Bạn chưa chọn slot trên lưới",
      });
    }
  };
  const playbackCameraSeekTimeCallback = (seekTime) => {
    if (currentSelectSlotRef.current != -1) {
      const slotIdx = findCameraIndexInGrid(currentSelectSlotRef.current);
      const selectedCam = addedCameras[slotIdx];
      playbackCameraWithSeekTime(
        selectedCam.name,
        selectedCam.camUuid,
        selectedCam.camId,
        selectedCam.id,
        seekTime
      ).then();
    } else {
      Notification({
        type: "warning",
        title: "Playback",
        description: "Bạn chưa chọn slot trên lưới",
      });
    }
  };
  const pauseOrPlayCallback = (isPlaying) => {
    if (currentSelectSlotRef.current != -1) {
      const slotIdx = findCameraIndexInGrid(currentSelectSlotRef.current);
      const selectedCam = addedCameras[slotIdx];
      const cell = document.getElementById("video-slot-" + selectedCam.id);
      if (!isPlaying) {
        cell.pause();
      } else {
        cell.play();
      }
    } else {
      Notification({
        type: "warning",
        title: "Playback",
        description: "Bạn chưa chọn slot trên lưới",
      });
    }
  };
  const handleNextPageCallback = async (currentPage) => {
    await fetchCameras(filter, search, PAGE_SIZE, currentPage);
  };

  const playbackByDragSlideTime = (seekTime) => {
    if (currentSelectSlotRef.current != -1) {
      const slotIdx = findCameraIndexInGrid(currentSelectSlotRef.current);
      const selectedCam = addedCameras[slotIdx];
      playbackCameraWithSeekTime(
        selectedCam.name,
        selectedCam.camUuid,
        selectedCam.camId,
        selectedCam.id,
        seekTime
      ).then();
    } else {
      Notification({
        type: "warning",
        title: "Playback",
        description: "Bạn chưa chọn slot trên lưới",
      });
    }
  };
  const playbackChangeSpeedCallback = (speed) => {
    if (currentSelectSlotRef.current != -1) {
      const slotIdx = findCameraIndexInGrid(currentSelectSlotRef.current);
      const selectedCam = addedCameras[slotIdx];
      const cell = document.getElementById("video-slot-" + selectedCam.id);
      cell.playbackRate = speed;
      setCurSpeed(speed)

    } else {
      Notification({
        type: "warning",
        title: "Playback",
        description: "Bạn chưa chọn slot trên lưới",
      });
    }
  };

  const renderVideoSlot = (originSlotId, provided, snapshot) => {
    return (
      <div
        className="video-toolbar"
        id={"draggable-video-" + originSlotId}
      >
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={getItemStyle(
            snapshot.isDragging,
            provided.draggableProps.style
          )}
        >
          <LiveCameraSlot
            idCamera={idCurrCameraSelected}
            slotId={originSlotId}
            setCurrentMenuControl={setCurrentMenuControl}
            currentMenuControl={currentMenuControl}
            addedCameras={addedCameras}
            startCaptureCamera={startCaptureCamera}
            stopCaptureCamera={stopCaptureCamera}
            startSnapshotCamera={startSnapshotCamera}
            maxMinCamera={() => maxMinCamera(originSlotId)}
            isMaximize={isMaximize}
            closeCamera={() => closeCamera(originSlotId)}
            onSelectVideoSlot={onSelectVideoSlot}
            liveMode={liveMode}
            zoomOutByDoubleClick={zoomOutByDoubleClick}
            setReloadLiveMenuTool={setReloadLiveMenuTool}
            reloadLiveMenuTool={reloadLiveMenuTool}
          />
        </div>
      </div>
    );
  };

  return (
    <div>
      {
        <BookmarkSetting
          reloadBookmark={reloadBookmark}
          showModal={isModalBookmarkVisible}
          handleClickOkCB={handleBookmarkOk}
          handleClickCancelCB={handleBookmarkCancel}
        />
      }
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="live-map-wrapper map-wrapper position-relative overflow-hidden">
          <div className="d-flex flex-column h-100">
            <div className="flex-grow-1 overflow-auto grid-live">
              <div className={"row no-gutters " + rowClass}>
                {dataGrid &&
                  dataGrid.map((originSlotId, index) => (
                    <Droppable
                      droppableId={"droppable-" + originSlotId}
                      key={originSlotId}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          id={`droppable-${originSlotId}`}
                          className={"d-flex h-100 video-col " + colClass}
                        >
                          <div
                            className="video-col-inner w-100 "
                            style={getListStyle(snapshot.isDraggingOver)}
                          >
                            {addedCameras[originSlotId] && (
                              <Draggable
                                draggableId={"draggable-video-" + originSlotId}
                                index={originSlotId}
                                disableInteractiveElementBlocking
                              >
                                {(provided, snapshot) =>
                                  renderVideoSlot(
                                    originSlotId,
                                    provided,
                                    snapshot
                                  )
                                }
                              </Draggable>
                            )}
                            {provided.placeholder}
                          </div>
                        </div>
                      )}
                    </Droppable>
                  ))}
              </div>
            </div>
            <div
              className="container-fluid"
              style={{ display: props?.isZoom ? "none" : null }}
            >
              <MenuTools
                updateGridSize2={updateGridSize2}
                handleBookmarkSaveCallback={handleBookmarkSaveCallback}
                handleOpenBookmarkSetting={handleOpenBookmarkSetting}
                liveMode={liveMode}
                onChaneModePlayCam={onChaneModePlayCam}
                playbackCameraSeekTypeCallback={playbackCameraSeekTypeCallback}
                playbackCameraSeekTimeCallback={playbackCameraSeekTimeCallback}
                pauseOrPlayCallback={pauseOrPlayCallback}
                currSelectedCamUuid={idCurrCameraSelected}
                playbackByDragSlideTime={playbackByDragSlideTime}
                dateTimeSeek={currentPlaybackTime}
                playbackChangeSpeedCallback={playbackChangeSpeedCallback}
                resetSpeed={resetSpeed}
                reloadLiveMenuTool={reloadLiveMenuTool}
                curSpeed={curSpeed}

              />
            </div>
          </div>

          <DraggableCameraList
            cameras={cameras}
            totalCameras={totalCameras}
            filter={filter}
            search={search}
            handleSearch={handleSearch}
            handleApplyFilterCallback={handleApplyFilterCallback}
            handleSelectCameraCallback={handleSelectCameraCallback}
            handleNextPage={handleNextPageCallback}
          />
        </div>
      </DragDropContext>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    isZoom: state.customizer.customizer.zoom,
  };
};

export default withRouter(
  connect(mapStateToProps, {
    changeZoom,
  })(Live)
);
