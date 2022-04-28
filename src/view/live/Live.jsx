import "antd/dist/antd.css";
import Hls from "hls.js";
import moment from "moment";
import React, { useEffect, useReducer, useRef, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useTranslation } from "react-i18next";
import { connect, useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";
import { reactLocalStorage } from "reactjs-localstorage";
import { v4 as uuidV4 } from "uuid";
import videojs from "video.js";
import ExportEventFileApi from "../../actions/api/exporteventfile/ExportEventFileApi";
import tokenApi from "../../api/authz/token";
import playCamApi from "../../api/camproxy/cameraApi";
import cheetahSvcApi from "../../api/cheetah/fileApi";
import bookmarkApi from "../../api/controller-api/bookmarkApi";
import cameraApi from "../../api/controller-api/cameraApi";
import lionSvcApi from "../../api/lion/cameraApi";
import playbackApi from "../../api/playback/cameraApi";
import "../../assets/scss/app-icons.scss";
import "../../assets/scss/pages/live.scss";
import "../../assets/scss/pages/map.scss";
import BookmarkSetting from "../../components/vms/bookmark/BookmarkSetting";
import Notification from "../../components/vms/notification/Notification";
import {
  removePlayBackHlsLive,
  setPlayBackHlsLive,
} from "../../redux/actions/live";
import getServerCamproxyForPlay from "../../utility/vms/camera";
import { captureVideoFrame } from "../../utility/vms/captureVideoFrame";
import { getBase64Text } from "../../utility/vms/getBase64Text";
import { doSwap } from "../../utility/vms/swapElement";
import {
  GRID1X1,
  GRID2X2,
  GRID3X3,
  GRID4X4,
} from "../common/vms/constans/grid";
import {
  SEEK_BACK,
  SEEK_CURRENT_TIME,
  SEEK_FORWARD,
  STEP_SIZE_MINUTE,
} from "../common/vms/constans/playback";
import { NOTYFY_TYPE, PAGE_SIZE } from "../common/vms/Constant";
import { changeZoom } from "./../../redux/actions/customizer/index";
import DraggableCameraList from "./DraggableCameraList";
import LiveCameraSlot from "./LiveCameraSlot";
import MenuTools from "./MenuTools";
import { getEmail, getToken } from "../../api/token";
import * as StompJs from "@stomp/stompjs";
import { UPDATE_DATA } from "../../redux/types/live";
import { isEmpty } from "lodash";
import {randomString} from "../../utility/vms/randomString";

const mode = process.env.REACT_APP_MODE_VIEW;

const initialDataGrid = [...Array(16).keys()].map((key) => ({
  id: key,
  cameraId: null,
}));
let currentGridSize = 16;
const Live = (props) => {
  const { t } = useTranslation();
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
  const [defaultSize, setDefaultSize] = useState(16);
  const [pcList, setPCList] = useState([]);
  const pcListRef = useRef(pcList);

  let wsOnConnectCallback = function (message) {
    const dataBody = JSON.parse(message.body);
    dispatch({ type: UPDATE_DATA.LOAD_SUCCESS, dataBody });
    // called when the client receives a STOMP message from the server
    if (message.body) {
      console.log(">>>>> Message: " + message.body);
    } else {
      console.log(">>>>> Empty message");
    }
  };

  function wsConnect() {
    const client = new StompJs.Client({
      brokerURL: "ws://cctv-uat.edsolabs.com:8441/ai-events",
      debug: function (str) {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = function (frame) {
      // Do something, all subscribes must be done is this callback
      // This is needed because this will be executed after a (re)connect
      const subscription = client.subscribe(
        "/topic/messages",
        wsOnConnectCallback
      );
    };

    client.onStompError = function (frame) {
      // Will be invoked in case of error encountered at Broker
      // Bad login/passcode typically will cause an error
      // Complaint brokers will set `message` header with a brief message. Body may contain details.
      // Compliant brokers will terminate the connection after any error
      console.log("Broker reported error: " + frame.headers["message"]);
      console.log("Additional details: " + frame.body);
    };

    client.activate();
  }

  let currentItemIdx = 0;
  useEffect(() => {
    wsConnect();

    initialDataGrid.forEach((it) => addedCameras.push(it));
    // get default screen and apply it to grid
    fetchDefaultScreen();
    const refreshTokenTimer = setInterval(() => {
      tokenApi.refreshToken();
    }, 1 * 60 * 60 * 1000); // 1 hour

    return () => {
      clearInterval(refreshTokenTimer);
      closeAllRTCPeerConnection();
    };
  }, []);

  useEffect(() => {
    pcListRef.current = pcList;
  }, [pcList]);

  useEffect(() => {
    fetchCameras(filter, search);
  }, [filter, search]);

  useEffect(() => {
    if (props.openModalPresetSetting.state) {
      if (isMaximize == true) {
        maxMinCamera(reactLocalStorage.getObject("originSlotId"));
        setIsMaximize(false);
      }
    }
  }, [props.openModalPresetSetting.state]);

  const closeAllRTCPeerConnection = () => {
    // CLOSE ALL STREAM
    let pcLstTmp = [...pcListRef.current];
    for (let i = 0; i < pcLstTmp.length; i++) {
      if (pcLstTmp[i].pc) {
        pcLstTmp[i].dc.close();
        pcLstTmp[i].pc.close();
        //console.log(">>>>> close Data Chanel: ", pcLstTmp[i].dc);
      }
    }
  };

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
        title: `${t("noti.choose_favorite_screen")}`,
        description: `${t("noti.no_camera_in_screen")}`,
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
                title: `${t("noti.default_screen")}`,
                description: `${t("noti.camera_not_exist")}`,
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
        title: `${t("noti.view_screen_list")}`,
        description: err.toString(),
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
            title: `${t("noti.default_screen")}`,
            description: `${t("noti.cannot_get_default_screen_info")}`,
          });
        }
        handleBookmarkOk(screen);

        const { cameraUuids = [] } = screen;

        cameraUuids.forEach((cameraId, index) => {
          dataGrid[index].cameraId = cameraId;

          setDataGrid([...dataGrid]);
        });

        switch (defaultScreen.gridType) {
          case "1x1":
            setDefaultSize(1);
            break;
          case "2x2":
            setDefaultSize(4);
            break;
          case "3x3":
            setDefaultSize(9);
            break;
          case "4x4":
            setDefaultSize(16);
            break;
          default:
            setDefaultSize(16);
        }
      }
    } catch (e) {
      Notification({
        type: "warning",
        title: `${t("noti.default_screen")}`,
        description: `${t("noti.did_not_configured_default_screen")}`,
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
          liveCamera(cam.camUuid, cam.camId, cam.id, "live").then();
        }
      });
    }
    setLiveMode(mode);
  };

  const reconnectCamera = (token, camUuid, camId, slotIdx, type) => {
    setTimeout(() => {
      // It will always get the latest ref value of pcList
      // Reason: We used updater form of setState (which provides us latest state value)
      setPCList((prevValue) => {
        let pcLstTmp = [...prevValue];
        let isExist = false;
        //console.log(">>>>> pcLstTmp: ", pcLstTmp);
        for (let i = 0; i < pcLstTmp.length; i++) {
          if (pcLstTmp[i].slotIdx === slotIdx) {
            isExist = true;
            if (pcLstTmp[i].pc) {
              pcLstTmp[i].dc.close();
              pcLstTmp[i].pc.close();
              pcLstTmp.splice(i, 1);
            }
            break;
          }
        }
        if (isExist) {
          liveCamera(camUuid, camId, slotIdx, type).then();
        }
        return prevValue;
      });
    }, 10000);
  };

  // LIVE
  const liveCamera = async (camUuid, camId, slotIdx, type) => {
    if (camUuid === "" || camUuid == null) {
      Notification({
        type: "warning",
        title: `${t("noti.default_screen")}`,
        description: `${t("noti.unidentified_camera")}`,
      });
      return;
    }
    const data = await getServerCamproxyForPlay(camUuid, mode);
    if (data == null) {
      Notification({
        type: "warning",
        title: `${t("noti.default_screen")}`,
        description: `${t("noti.error_camera_address")}`,
      });
      return;
    }

    //Chỗ này check mode HLS or WebRTC: Xử lí trên giao diện khác nhau.
    if (mode === "webrtc") {
      const restartConfig = {
        iceServers: [
          {
            urls: "stun:turn.edsolabs.com:3478",
          },
        ],
      };
      const pc = new RTCPeerConnection();
      let peerCode = randomString(10);

      pc.setConfiguration(restartConfig);
      pc.addTransceiver("video");
      const spin = document.getElementById("spin-slot-" + slotIdx);
      pc.ontrack = (event) => {
        //binding and play
        const cell = document.getElementById("video-slot-" + slotIdx);
        if (cell) {
          cell.srcObject = event.streams[0];
          cell.autoplay = true;
          cell.muted = true;
          cell.controls = false;
          cell.style = "width:100%;height:100%;display:block;object-fit:fill;";
          spin.style.display = "none";
        }
      };

      const thisTime = new Date().getTime();
      const token =
        slotIdx + "##" + getToken() + "##" + getEmail() + "##" + thisTime;
      let dc = pc.createDataChannel(token);

      pc.ondatachannel = (event) => {
        dc = event.channel;
        dc.onopen = () => {
          console.log(">>>>> ondatachannel -> onopen, data: ", token);
        };
        let dcTimeout = null;
        dc.onmessage = (evt) => {
          console.log(">>>>> ondatachannel -> onmessage:" + evt)
          dcTimeout = setTimeout(function() {
            if (dc == null && dcTimeout != null) {
              dcTimeout = null;
              return
            }
            const message = 'Ping from: ' + peerCode;
            if (dc.readyState === "open") {
              dc.send(message);
              console.log(">>>>> ondatachannel -> onmessage, send message: ", message);
            }
          }, 1000);
        }
        dc.onclose = () => {
          clearTimeout(dcTimeout);
          dcTimeout = null;
          console.log(">>>>> ondatachannel -> onclose, data: ", token);
        };
      };

      pc.onconnectionstatechange = function (event) {
        switch (pc.connectionState) {
          case "connected":
            // The connection has become fully connected
            //console.log(">>>>> connection state: connected, data: ", token);
            break;
          case "disconnected":
            console.log(">>>>> connection state: disconnected, data: ", token);
            reconnectCamera(token, camUuid, camId, slotIdx, type);
            break;
          case "failed":
            // One or more transports has terminated unexpectedly or in an error
            console.log(">>>>> connection state: failed, data: ", token);
            reconnectCamera(token, camUuid, camId, slotIdx, type);
            break;
          case "closed":
            // The connection has been closed
            //console.log(">>>>> connection state: closed, data: ", token);
            break;
        }
      };

      const API = data.camproxyApi;
      pc.createOffer({
        iceRestart: true,
      })
        .then((offer) => {
          spin.style.display = "block";
          pc.setLocalDescription(offer).then((r) => {});
          //call camproxy
          playCamApi
            .playCamera(API, {
              token: token,
              camUuid: camUuid,
              offer: offer,
              viewType: type,
            })
            .then((res) => {
              if (res) {
                pc.setRemoteDescription(res).then((r) => {});
              } else {
                spin.style.display = "none";
                Notification({
                  type: "warning",
                  title: `${t("noti.default_screen")}`,
                  description: `${t("noti.fail_accept_offer_from_server")}`,
                });
              }
            });
        })
        .catch((error) => {
          console.log("error:", error);
          spin.style.display = "none";
        })
        .catch((e) => console.log(e))
        .finally(() => {});

      setPCList((prevValue) => {
        let pcLstTmp = [...prevValue];
        let isExist = false;
        for (let i = 0; i < pcLstTmp.length; i++) {
          if (pcLstTmp[i].slotIdx === slotIdx) {
            pcLstTmp[i].pc = pc;
            pcLstTmp[i].dc = dc;
            pcLstTmp[i].viewType = type;
            isExist = true;
            break;
          }
        }
        if (!isExist) {
          pcLstTmp.push({ slotIdx: slotIdx, pc: pc, viewType: type, dc: dc });
        }
        return pcLstTmp;
      });
    } else {
      const API = data.camproxyApi;
      const { token } = data;
      const spin = document.getElementById("spin-slot-" + slotIdx);
      spin.style.display = "block";
      playCamApi
        .playCameraHls(API, {
          token: token,
          cameraUuid: camUuid,
          viewType: type,
        })
        .then(async (res) => {
          if (res) {
            const cell = document.getElementById("video-slot-" + slotIdx);
            if (cell) {
              cell.autoplay = true;
              cell.controls = false;
              cell.preload = "none";
              cell.crossOrigin = "anonymous";
              cell.style =
                "width:100%;height:100%;display:block;object-fit:fill;position:absolute;top:0";
              cell.type = "application/x-mpegURL";
              cell.muted = "muted";
              cell.innerHTML = `<source src='${API}/camproxy/v1/play/hls/${camUuid}/index.m3u8' type='application/x-mpegURL'>`;
              //cell.innerHTML = `<source src='http://cctv-uat.edsolabs.com:8094/camproxy/v1/play/hls/b2bb2802-51e9-4395-bb16-fced5f036302/index.m3u8' type='application/x-mpegURL'>`;
              spin.style.display = "none";
              const ply = await videojs("video-slot-" + slotIdx);
              ply.play();
            }
          }
        });
    }
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
        description: `${t("noti.unidentified_camera")}`,
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
        description: `${t("noti.unidentified_camera")}`,
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
          //tmp[slotIdx].hls.on(Hls.Events.MANIFEST_PARSED);
          //tmp[slotIdx].hls.on(Hls.Events.MEDIA_ATTACHED);
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
  const handleSelectCameraCallback = (cam, idx) => {};

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
        title: `${t("noti.camera_filter")}`,
        description: `${t("noti.errors_in_the_process_of_camera_filter")}`,
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

  const onDragEnd = async (result, type) => {
    const { destination, source, draggableId } = result;
    // dropped outside the list
    if (!destination) {
      return;
    }
    // draggableId là camera id được kéo thả vào grid => Xử lý phần khởi tạo video stream tại đây và add stream url
    // Slot được chọn chính là index chứa trong droppableId (xem hàm move)
    if (source.droppableId === "droppable-camera-list") {
      const streamUrl = "http://techslides.com/demos/sample-videos/small.mp4";
      const gridID = destination.droppableId.replace("droppable-", "");
      const des = addedCameras[gridID];
      result = [...addedCameras];
      const camInfoArr = draggableId.split("##_");

      if (camInfoArr.length < 3) {
        Notification({
          type: "error",
          title: `${t("noti.default_screen")}`,
          description: `${t("noti.incorrect_camera_type")}`,
        });
        return;
      }

      dataGrid[gridID].cameraId = camInfoArr[0];

      setDataGrid([...dataGrid]);

      result[gridID] = {
        id: des.id,
        name: camInfoArr[1],
        camUuid: camInfoArr[0],
        camId: camInfoArr[2],
        streamUrl: streamUrl,
        liveMode: liveMode,
        hls: null,
        type: type,
      };
      setIdCurrCameraSelected(result[des?.id]?.camUuid);

      switch (liveMode) {
        case true:
          liveCamera(camInfoArr[0], camInfoArr[2], des.id, "live").then();
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
        default:
          break;
      }
    } else if (source.droppableId !== destination.droppableId) {
      const result = move(source, destination, draggableId);
      setAddedCameras(result);
    }
  };

  // CONTROL CAMERA
  const changeLiveMode = (slotId, type) => {
    const slotIdx = findCameraIndexInGrid(slotId);
    const cameras = [...addedCameras];
    let camera = cameras[slotIdx];
    console.log(">>>>> camera: ", camera);
    closeCamera(slotId);
    liveCamera(camera.camUuid, camera.camId, camera.id, type).then();
    camera = { ...camera, liveMode: true };
    camera = { ...camera, type: type };
    cameras[slotIdx] = camera;
    setAddedCameras([...cameras]);
  };
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
              `${t("noti.start_record_for_camera")}` + "[" + camera.name + "]",
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
            `${t("noti.start_record_for_camera")}` + "[" + camera.name + "]",
        });
        camera = { ...camera, isRec: true };
        cameras[slotIdx] = camera;
        setAddedCameras([...cameras]);
      }
    } catch (e) {
      console.log(e);
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
            `${t("noti.stop_record_for_camera")}` + "[" + camera.name + "]",
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
              `${t("noti.stop_record_for_camera")}` + "[" + camera.name + "]",
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
    const { blob, tBlob } = captureVideoFrame(cell, null, "jpeg");
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
        tBlob: tBlob,
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
          let { blob, tBlob, ...requestObject } = eventFile;
          getBase64Text(eventFile.tBlob, async (thumbnailData) => {
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
                description: `${t("noti.successfully_take_photo_and_save")}`,
              });
            }
          });
        } else {
          Notification({
            type: NOTYFY_TYPE.warning,
            title: "Playback",
            description: `${t("noti.error_save_file")}`,
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
    reactLocalStorage.setObject("originSlotId", originSlotId);
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
    setIsMaximize(false);
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

      // CLOSE STREAM
      let pcLstTmp = [...pcList];
      for (let i = 0; i < pcLstTmp.length; i++) {
        if (pcLstTmp[i].slotIdx === slotIdx) {
          if (pcLstTmp[i].pc) {
            console.log(">>>> Close RTCPeerConnection: ", pcLstTmp[i].slotIdx);
            pcLstTmp[i].dc.close();
            pcLstTmp[i].pc.close();
            pcLstTmp.splice(i, 1);
          }
          break;
        }
      }
      setPCList([...pcLstTmp]);

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
    let viewTypes = [];
    let pcLstTmp = [...pcList];
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

      let type = "";
      for (let i = 0; i < pcLstTmp.length; i++) {
        if (pcLstTmp[i].slotIdx === id) {
          type = pcLstTmp[i].viewType;
          break;
        }
      }
      viewTypes.push(type);
    });
    if (isEmptyGrid) {
      Notification({
        type: "warning",
        title: `${t("components.bookmark.favorite_screen")}`,
        description: `${t("noti.error_no_camera_in_grid")}`,
      });
      return;
    }
    if (bookMarkName === "") {
      Notification({
        type: "warning",
        title: `${t("components.bookmark.favorite_screen")}`,
        description: `${t("noti.error_empty_screen_name")}`,
      });
      return;
    }
    const record = {
      cameraUuids: cameraUuids,
      gridType: gridType,
      name: bookMarkName,
      viewTypes: viewTypes,
    };
    try {
      const response = await bookmarkApi.createNew(record);
      if (response && response.payload) {
        Notification({
          type: "success",
          title: `${t("components.bookmark.favorite_screen")}`,
          description: `${t("noti.successfully_save_favorite_screen")}`,
        });
      }
    } catch (err) {
      Notification({
        type: "warning",
        title: `${t("components.bookmark.favorite_screen")}`,
        description:
          `${t("noti.failed_save_favorite_screen_error")}` + err.toString(),
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
            let type = selectedItem.viewTypes[idx];
            cams[idx] = {
              id: idx,
              name: camFound.cameraName,
              camUuid: camUuid,
              camId: camFound.camId,
              streamUrl: "",
              isPlay: true,
              selected: false,
              type: type,
            };
            liveCamera(camUuid, camFound.camId, idx, type).then();
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

          default:
            size = 16;
        }

        updateGridSize2(size);
      }
    } catch (err) {
      Notification({
        type: "warning",
        title: `${t("components.bookmark.favorite_screen")}`,
        description:
          `${t("noti.failed_apply_favorite_screen_error")}` + err.toString(),
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
      setCurSpeed(1);
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
        description: `${t("noti.have_not_choosen_slot_on_grid")}`,
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
        description: `${t("noti.have_not_choosen_slot_on_grid")}`,
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
        description: `${t("noti.have_not_choosen_slot_on_grid")}`,
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
        description: `${t("noti.have_not_choosen_slot_on_grid")}`,
      });
    }
  };
  const playbackChangeSpeedCallback = (speed) => {
    if (currentSelectSlotRef.current != -1) {
      const slotIdx = findCameraIndexInGrid(currentSelectSlotRef.current);
      const selectedCam = addedCameras[slotIdx];
      const cell = document.getElementById("video-slot-" + selectedCam.id);
      cell.playbackRate = speed;
      setCurSpeed(speed);
    } else {
      Notification({
        type: "warning",
        title: "Playback",
        description: `${t("noti.have_not_choosen_slot_on_grid")}`,
      });
    }
  };

  const renderVideoSlot = (originSlotId, provided, snapshot, cameraId) => {
    return (
      <div className="video-toolbar" id={"draggable-video-" + originSlotId}>
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
            idCamera={cameraId}
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
            changeLiveMode={changeLiveMode}
            zoomOutByDoubleClick={zoomOutByDoubleClick}
            setReloadLiveMenuTool={setReloadLiveMenuTool}
            reloadLiveMenuTool={reloadLiveMenuTool}
          />
        </div>
      </div>
    );
  };

  const handleMessage = (stompMessage) => {
    console.log(">>>>> stompMessage: ", stompMessage);
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
                  dataGrid.map((obj, index) => (
                    <Droppable droppableId={"droppable-" + obj.id} key={obj.id}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          id={`droppable-${obj.id}`}
                          className={"d-flex h-100 video-col " + colClass}
                        >
                          <div
                            className="video-col-inner w-100 "
                            style={getListStyle(snapshot.isDraggingOver)}
                          >
                            {addedCameras[obj.id] && (
                              <Draggable
                                draggableId={"draggable-video-" + obj.id}
                                index={obj.id}
                                disableInteractiveElementBlocking
                              >
                                {(provided, snapshot) =>
                                  renderVideoSlot(
                                    obj.id,
                                    provided,
                                    snapshot,
                                    obj.cameraId
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
                defaultSize={defaultSize}
              />
            </div>
          </div>
          {isMaximize ? (
            ""
          ) : (
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
          )}
        </div>
      </DragDropContext>
      <div>
        {/*<StompClient*/}
        {/*    endpoint="ws://cctv-uat.edsolabs.com:8441/ai-events"*/}
        {/*    topic="/topic/messages"*/}
        {/*    onMessage={handleMessage}*/}
        {/*>*/}
        {/*  <div>*/}
        {/*    {"No message received yet"}*/}
        {/*  </div>*/}
        {/*</StompClient>*/}
      </div>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    isZoom: state.customizer.customizer.zoom,
    openModalPresetSetting: state.openModalPresetSetting,
  };
};

export default withRouter(
  connect(mapStateToProps, {
    changeZoom,
  })(Live)
);
