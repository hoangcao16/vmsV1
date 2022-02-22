import { Col, Input, Popconfirm, Popover, Row, Tooltip, Button } from "antd";
import { CloseOutlined } from '@ant-design/icons';
import "antd/dist/antd.css";
import { saveAs } from "file-saver";
import { findIndex } from "lodash-es";
import debounce from "lodash/debounce";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  AiFillVideoCamera,
  AiOutlineCheck,
  AiOutlineClose,
  AiOutlineEdit,
} from "react-icons/ai";
import {
  AiFillEdit,
  AiOutlineInfoCircle,
  MdCenterFocusWeak,
} from "react-icons/all";
import {
  FiBookmark,
  FiCamera,
  FiDatabase,
  FiDownload,
  FiFastForward,
  FiFilm,
  FiGrid,
  FiImage,
  FiList,
  FiPause,
  FiPlay,
  FiRewind,
  FiScissors,
} from "react-icons/fi";
import { RiCalendarTodoLine, RiDeleteBinLine } from "react-icons/ri";
import { reactLocalStorage } from "reactjs-localstorage";
import { v4 as uuidV4 } from "uuid";
import AIEventsApi from "../../../actions/api/ai-events/AIEventsApi";
import {
  default as deleteExportEventFileApi,
  default as ExportEventFileApi,
} from "../../../actions/api/exporteventfile/ExportEventFileApi";
import permissionCheck from "../../../actions/function/MyUltil/PermissionCheck";
import cheetahSvcApi from "../../../api/cheetah/fileApi";
import eventApi from "../../../api/controller-api/eventApi";
import lionSvcApi from "../../../api/lion/cameraApi";
import playbackApi from "../../../api/playback/cameraApi";
import imagePoster from "../../../assets/event/videoposter.png";
import Notification from "../../../components/vms/notification/Notification";
import { captureVideoFrame } from "../../../utility/vms/captureVideoFrame";
import { getBase64Text } from "../../../utility/vms/getBase64Text";
import { NOTYFY_TYPE } from "../../common/vms/Constant";
import Loading from "../../Loading";
import "./../../commonStyle/commonDatePicker.scss";
import "./../../commonStyle/commonForm.scss";
import "./../../commonStyle/commonInput.scss";
import "./../../commonStyle/commonPopconfirm.scss";
import "./../../commonStyle/commonSelect.scss";
import "./../../commonStyle/commonTable.scss";
import "./export-event-file.scss";
import { MemoizedInfoObjectPopoverContent } from "./InfoObjectPopoverContent";
import { MemoizedInfoPopoverContent } from "./InfoPopoverContent";
import { MemoizedHlsPlayer } from "./PlayerHls";
import { MemoizedTableEventFile } from "./TableEventFile";
import { MemoizedTableFile } from "./TableFile";
import { MemoizedThumbnailVideo } from "./ThumbnailVideo";
const AI_SOURCE = process.env.REACT_APP_AI_SOURCE;
const { TextArea } = Input;

const ExportEventFile = () => {
  let defaultEventFile = {
    id: "",
    uuid: "",
    eventUuid: "",
    eventName: "",
    name: "",
    violationTime: -1,
    createdTime: -1,
    note: "",
    cameraUuid: "",
    cameraName: "",
    type: -1,
    length: 0,
    address: "",
    rootFileUuid: "",
    pathFile: "",
    isImportant: false,
    thumbnailData: [""],
    nginx_host: "",
    blob: null,
    isSaved: false,
    tBlob: null,
  };

  const { t } = useTranslation();
  const language = reactLocalStorage.get("language");
  const [playerSrc, setPlayerSrc] = useState("");
  //const [volumeVideo, setVolumeVideo] = useState(0.45);
  const [duration, setDuration] = useState(0);
  let playbackRate = 1;
  const [urlSnapshot, setUrlSnapshot] = useState("");
  const playerVideo = useRef(null);
  const refCanvas = useRef(null);
  const [viewFileType, setViewFileType] = useState(0);
  const [isTableView, setIsGridView] = useState(true);
  const [urlVideoTimeline, setUrlVideoTimeline] = useState(null);
  const [playerReady, setPlayerReady] = useState(false);
  const [captureMode, setCaptureMode] = useState(false);
  const [listEventFiles, setListEventFiles] = useState([]);
  const [downloadFileName, setDownloadFileName] = useState("");
  const [eventFileCurrent, setEventFileCurrent] = useState(defaultEventFile);
  const [fileCurrent, setFileCurrent] = useState(null);
  const [imageAICurrent, setImageAICurrent] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOpenRootFile, setIsOpenRootFile] = useState(false);
  const [listFiles, setListFiles] = useState([]);
  const [total, setTotal] = useState(0);
  const [eventList, setEventList] = useState([]);
  const [eventListAI, setEventListAI] = useState([]);
  const [imageOther, setImageOther] = useState([]);

  const [currNode, setCurrNode] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [detailAI, setDetailAI] = useState(defaultEventFile);

  const zoom = ((window.outerWidth - 10) / window.innerWidth) * 100;

  useEffect(() => {
    language === "vn"
      ? (document.title = "CCTV | Xuất sự kiện")
      : (document.title = "CCTV | Export Event");
  }, [t]);

  useEffect(() => {
    eventApi
      .getAll({ page: 0, size: 1000000, sort_by: "name", order_by: "asc" })
      .then((data) => {
        if (data && data.payload) {
          setEventList(data.payload);
        }
      });

    const dataEventList = [
      {
        id: 0,
        type: "first_seen",
        name: `${t('view.ai_events.attendance')}`,
      },
      {
        id: 0,
        type: "just_crossed",
        name: `${t("view.ai_events.line_crossing")}`,
      },
      {
        id: 0,
        type: "intruding",
        name: `${t("view.ai_events.intruding")}`,
      },
    ];
    setEventListAI(dataEventList);
  }, []);

  useEffect(() => {
    refresh();
  }, [viewFileType]);

  useEffect(() => {
    if (viewFileType === 4) {
      let imageOther = []

      if (AI_SOURCE === "philong") {
        if (fileCurrent.plateNumberUrl) {
          imageOther.push(fileCurrent.plateNumberUrl)
        }
        if (fileCurrent.vehicleUrl) {
          imageOther.push(fileCurrent.vehicleUrl)
        }
      } else {
        setDetailAI({})
        if (fileCurrent && fileCurrent.uuid != null) {
          AIEventsApi.getEventsByTrackingId(fileCurrent.trackingId).then(
            (data) => {
              data.payload.map((ef) => {
                if (ef.thumbnailData != null) {
                  imageOther.push({
                    image: ef.thumbnailData,
                    uuid: ef.uuid,
                    cameraUuid: ef.cameraUuid,
                    trackingId: ef.trackingId,
                    fileName: ef.fileName
                  });
                }

              })
            }
          );
          setImageOther(imageOther)

          AIEventsApi.getDetailEvent(fileCurrent.uuid).then(
            (data) => {
              if (data && data.payload) {
                setDetailAI({
                  ...fileCurrent,
                  code: data.payload.code,
                  name: data.payload.name,
                  position: data.payload.position,
                  note: data.payload.note,
                  plateNumber: data.payload.plateNumber,
                  departmentUuid: data.payload.departmentUuid,
                  departmentName: data.payload.departmentName,
                  typeObject: data.payload.useCase === "zac_vehicle" ? "vehicle" : "human"
                })
                setImageAICurrent({
                  cameraUuid: fileCurrent.cameraUuid,
                  trackingId: fileCurrent.trackingId,
                  uuid: fileCurrent.uuid,
                  fileName: fileCurrent.fileName,
                });
              }
            }
          );
        }
      }
    }
  }, [fileCurrent]);



  const refresh = () => {
    setCaptureMode(false);
    setUrlSnapshot("");
    setUrlVideoTimeline(null);
    setPlayerReady(false);
    setListEventFiles([]);
    setEventFileCurrent(defaultEventFile);
    setFileCurrent(null);
    setIsOpenRootFile(false);
  };

  const onClickTableFileHandler = async (row) => {

    if (row) {
      setCaptureMode(false);
      setUrlVideoTimeline(null);
      setUrlSnapshot("");


      if (viewFileType === 0) {
        await openFile(row);
      } else {
        await openEventFile(row);
      }
    }
  };

  const openFile = async (file) => {
    setLoading(true);
    try {
      // Get event file belong to this file
      const response = await ExportEventFileApi.getEventFileList({
        page: 1,
        size: 1000,
        rootFileUuid: file.uuid,
      });
      if (response && response.payload) {
        setListEventFiles(
          response.payload.map((ef) => {
            const { important, ...eventFile } = ef;
            return {
              ...eventFile,
              isImportant: ef.important,
              blob: null,
              isSaved: true,
            };
          })
        );

        setOriginalFile({ ...file, tableName: "file" });
        // Play file
        await playFile(file);

        addDataToEvent(file, 0);
      }
    } catch (e) {
      Notification({
        type: NOTYFY_TYPE.warning,
        title: `${t("noti.archived_file")}`,
        description: `${t("noti.error_get_file_check_again")}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const playFile = async (file) => {
    let user = reactLocalStorage.getObject("user", null);
    if (user !== undefined && user !== null) {
      setLoading(true);
      const playbackPermissionReq = {
        cameraUuid: file.cameraUuid,
        domain: file.domain,
        date: 0,
        userId: user.userUuid,
        diskId: file.diskId,
      };
      try {
        let checkPerRes = await lionSvcApi.checkPermissionForViewOnline(
          playbackPermissionReq
        );
        if (checkPerRes) {
          const playReq = {
            fileAbsName: file.path + "/" + file.name,
            domain: file.domain,
            userId: user.userUuid,
            token: checkPerRes.token,
          };

          const payload = await playbackApi.playSingleFile(
            checkPerRes.playbackUrl,
            playReq
          );
          if (payload) {
            let videoSrc =
              checkPerRes.playbackUrl +
              "/play/hls/" +
              payload.reqUuid +
              "/index.m3u8";
            setDownloadFileName(file.name);
            setDuration(file.length);
            setFileCurrent({ ...file, tableName: "file" });
            setPlayerReady(true);
            setPlayerSrc(videoSrc);
            playHandler("default");

            // Call Nginx to get blob data of file
            // await ExportEventFileApi.getFileData(file.id, file.fileType, file.nginx_host).then(async (result) => {
            //     const blob = new Blob([result.data], {type: "octet/stream"});
            //     const url = window.URL.createObjectURL(blob);
            //
            //     setUrlVideo(url);
            //     setDownloadFileName(file.name);
            //     setDuration(file.length);
            //     setUrlVideoTimeline(new File([blob], file.name));
            //
            //     setFileCurrent({...file, tableName: 'file'});
            //     setPlayerReady(true);
            //     setPlayerSrc(videoSrc);
            //     playHandler("default");
            // });
          }
        }
      } catch (e) {
        console.log("e:", e.toString());
      } finally {
        setLoading(false);
      }
    }
  };

  const openEventFile = async (file) => {
    if (viewFileType === 1 || viewFileType === 2) {
      setFileCurrent({ ...file, tableName: "event_file" });
    } else if (viewFileType === 3) {
      setFileCurrent({ ...file });
    } else if (viewFileType === 4) {
      setFileCurrent({ ...file, fileType: '4' });
    }
    if (file.type === 1) {

      //setUrlSnapshot("data:image/jpeg;base64," + file.thumbnailData[0]);
      // Call Nginx to get blob data of file
      await ExportEventFileApi.downloadFile(
        file.uuid + ".jpeg",
        file.type
      ).then(async (result) => {
        const blob = new Blob([result.data], { type: "octet/stream" });
        getBase64Text(blob, async (image) => {
          setUrlSnapshot(image);
        });
      });

    } else if (viewFileType === 4) {
      if (AI_SOURCE === "philong") {
        setUrlSnapshot(file.overViewUrl);
      } else {
        await ExportEventFileApi.downloadFileAI(
          file.cameraUuid,
          file.trackingId,
          file.uuid,
          file.fileName,
          4
        ).then(async (result) => {
          const blob = new Blob([result.data], { type: "octet/stream" });
          getBase64Text(blob, async (image) => {
            setUrlSnapshot(image);
          });

        });

        // setUrlSnapshot("data:image/jpeg;base64," + file.thumbnailData);
      }
    } else {
      if (file.tableName === "file") {
        // Play file
        await playFile(file);
      } else {
        // Play event file
        await playEventFile(file);
      }
    }
    if (viewFileType === 4) {
      setDownloadFileName(file.fileName);
    } else {
      setDownloadFileName(file.name);
    }

    addDataToEvent(file, 1);
  };

  const playEventFile = async (row) => {
    setUrlVideoTimeline(null);
    let user = reactLocalStorage.getObject("user", null);
    if (user !== undefined && user !== null) {
      const playbackPermissionReq = {
        cameraUuid: row.cameraUuid,
        domain: row.domain,
        date: 0,
        userId: user.userUuid,
        diskId: row.diskId,
      };
      try {
        setLoading(true);
        let checkPerRes = await lionSvcApi.checkPermissionForViewOnline(
          playbackPermissionReq
        );
        if (checkPerRes) {
          const playReq = {
            fileAbsName: row.pathFile,
            domain: row.domain,
            userId: user.userUuid,
            token: checkPerRes.token,
          };
          const payload = await playbackApi.playSingleFile(
            checkPerRes.playbackUrl,
            playReq
          );
          if (payload) {
            let videoSrc =
              checkPerRes.playbackUrl +
              "/play/hls/" +
              payload.reqUuid +
              "/index.m3u8";
            setDownloadFileName(row.name);
            setDuration(row.length);
            setFileCurrent({ ...row, tableName: "event_file" });
            setPlayerReady(true);
            setPlayerSrc(videoSrc);
            playHandler("default");

            // Call Nginx to get blob data of file
            // await ExportEventFileApi.getFileData(row.id, row.type, row.nginx_host).then(async (result) => {
            //     const blob = new Blob([result.data], {type: "octet/stream"});
            //     const url = window.URL.createObjectURL(blob);
            //
            //     setUrlVideo(url);
            //     setDownloadFileName(row.name);
            //     setDuration(row.length);
            //     setUrlVideoTimeline(new File([blob], row.name));
            //
            //     setFileCurrent({...row, tableName: 'event_file'});
            //     setPlayerReady(true);
            //     setPlayerSrc(videoSrc);
            //     playHandler("default");
            // });
          }
        }
      } catch (e) {
        console.log("e:", e.toString());
      } finally {
        setLoading(false);
      }
    }
  };

  const onSearchHandler = async (dataParam) => {
    // refresh();
    setLoading(true);
    try {
      let perToCheck = [];
      if (viewFileType === 0) perToCheck.push("view_record_file");
      if (viewFileType === 1) perToCheck.push("view_capture_file");
      if (viewFileType === 2) perToCheck.push("view_event_file");
      if (viewFileType === 3) {
        perToCheck.push("view_record_file");
        perToCheck.push("view_capture_file");
        perToCheck.push("view_event_file");
      }
      let per = true;
      perToCheck.forEach((p) => {
        const res = permissionCheck(p);
        per = res && per;
      });
      if (per) {
        if (viewFileType === 0) {
          await ExportEventFileApi.getFileList(dataParam).then((data) => {
            if (data && data.payload) {
              if (data.payload.length === 0) {
                Notification({
                  type: NOTYFY_TYPE.warning,
                  title: `${t("noti.archived_file")}`,
                  description: `${t("noti.no_valid_results_found")}`,
                });
                setListFiles([]);
                setTotal(0);
                return;
              }
              setListFiles(
                data.payload.map((f) => {
                  const { important, ...file } = f;
                  return {
                    ...file,
                    isImportant: f.important,
                  };
                })
              );
              setTotal(data.metadata.total);
            }
          });
        } else if (viewFileType === 1 || viewFileType === 2) {
          await ExportEventFileApi.getEventFileList(dataParam).then((data) => {
            if (data && data.payload) {
              if (data.payload.length === 0) {
                Notification({
                  type: NOTYFY_TYPE.warning,
                  title: `${t("noti.archived_file")}`,
                  description: `${t("noti.no_valid_results_found")}`,
                });
                setListFiles([]);
                setTotal(0);
                return;
              }
              setListFiles(
                data.payload.map((f) => {
                  const { important, ...file } = f;
                  return {
                    ...file,
                    isImportant: f.important,
                  };
                })
              );
              setTotal(data.metadata.total);
            }
          });
        } else if (viewFileType === 3) {
          await ExportEventFileApi.getImportantFileList(dataParam).then(
            (data) => {
              if (data && data.payload) {
                if (data.payload.length === 0) {
                  Notification({
                    type: NOTYFY_TYPE.warning,
                    title: `${t("noti.archived_file")}`,
                    description: `${t("noti.no_valid_results_found")}`,
                  });
                  setListFiles([]);
                  setTotal(0);
                  return;
                }
                setListFiles(
                  data.payload.map((f) => {
                    const { important, ...file } = f;
                    return {
                      ...file,
                      isImportant: f.important,
                    };
                  })
                );
                setTotal(data.metadata.total);
              }
            }
          );
        } else if (viewFileType === 4) {
          setListFiles([]);
          setTotal(0);
          await AIEventsApi.getEvents(dataParam).then((data) => {
            if (data && data.payload) {
              if (data.payload.length === 0) {
                Notification({
                  type: NOTYFY_TYPE.warning,
                  title: `${t("noti.archived_file")}`,
                  description: `${t("noti.no_valid_results_found")}`,
                });
                setListFiles([]);
                setTotal(0);
                return;
              }
              setListFiles(
                data.payload.map((f) => {
                  const { important, ...file } = f;
                  return {
                    ...file,
                    subEventType: f.eventType,
                    isImportant: f.important,
                  };
                })
              );
              setTotal(data.metadata.total);
            }
          });
        }
      } else {
        Notification({
          type: NOTYFY_TYPE.warning,
          title: `${t("noti.archived_file")}`,
          description: `${t("noti.do_not_have_permission_to_action")}`,
        });
        setListFiles([]);
        setTotal(0);
      }
    } catch (e) {
      Notification({
        type: NOTYFY_TYPE.warning,
        title: `${t("noti.archived_file")}`,
        description: `${t("noti.error_search_file")}`,
      });
      console.log(e);
      setListFiles([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const setFileName = (type) => {
    if (type === 0) {
      return "Cut." + moment().format("DDMMYYYY.hhmmss") + ".mp4";
    }
    return "Cap." + moment().format("DDMMYYYY.hhmmss") + ".jpg";
  };

  let addDataToEvent = (row, vFileType) => {
    if (vFileType === 0) {
      let value = {
        ...defaultEventFile,
        name: setFileName(0),
        violationTime: row?.createdTime,
        createdTime: new Date().getTime(),
        cameraUuid: row?.cameraUuid,
        cameraName: row?.cameraName,
        address: row?.address,
        rootFileUuid: row.uuid,
        type: 0,
      };

      if (value) setEventFileCurrent(value);
    } else {
      setEventFileCurrent({ ...row, blob: null, isSaved: false });
    }
    setCurrNode(row.note)
  };

  const captureSnapshotHandler = () => {
    const isExistEl = listEventFiles.some(
      (el) => el.uuid === eventFileCurrent.uuid
    );
    if (!isExistEl && eventFileCurrent) {
      const { blob, tBlob } = captureVideoFrame(
        playerVideo.current,
        refCanvas.current,
        "jpeg"
      );
      const lstEf = [...listEventFiles];
      const fileName = setFileName(1);
      const uuid = uuidV4();
      const newEventFile = {
        ...eventFileCurrent,
        uuid: uuid,
        type: 1,
        name: fileName,
        blob: blob,
        tBlob: tBlob,
      };
      lstEf.push(newEventFile);
      setFileCurrent(newEventFile);
      setListEventFiles([...lstEf]);
      const url = window.URL.createObjectURL(blob);
      setCaptureMode(true);
      setUrlSnapshot(url);
      setDownloadFileName(fileName);
    }
  };

  const captureVideoHandler = async () => {
    setLoading(true);
    try {
      const isExistEl = listEventFiles.some(
        (el) => el.uuid === eventFileCurrent.uuid
      );
      if (!isExistEl && eventFileCurrent && fileCurrent) {
        const cbLeft = document.getElementById("cb-left");
        const cbRight = document.getElementById("cb-right");
        const sTime = cbLeft.getAttribute("data-start_time");
        const eTime = cbRight.getAttribute("data-end_time");
        const fileName = fileCurrent.path + "/" + fileCurrent.name;
        const captureFileReq = {
          startCaptureTime: +sTime,
          stopCaptureTime: +eTime,
          fileName: setFileName(0),
          originalFileName: fileName,
        };
        let captureFileRes = await cheetahSvcApi.captureFile(captureFileReq);
        if (captureFileRes && captureFileRes.payload) {
          let eventFile = {
            ...eventFileCurrent,
            uuid: uuidV4(),
            type: 0,
            name: captureFileRes.payload.fileName,
            length: captureFileRes.payload.length,
            pathFile:
              captureFileRes.payload.path +
              "/" +
              captureFileRes.payload.fileName,
            thumbnailData: captureFileRes.payload.thumbnailData,
            nginx_host: captureFileRes.payload.nginx_host,
            isSaved: true,
            diskId: fileCurrent.diskId,
          };
          let { blob, isSaved, ...requestObject } = eventFile;
          const response = await ExportEventFileApi.createNewEventFile(
            requestObject
          );
          if (response && response.payload) {
            Notification({
              type: NOTYFY_TYPE.success,
              title: `${t("noti.archived_file")}`,
              description: `${t("noti.successfully_add_file")}`,
            });
            eventFile = { ...eventFile, id: response.payload.id };
            const lstEf = [...listEventFiles];
            lstEf.push(eventFile);
            setListEventFiles([...lstEf]);

            // Play captured file
            setCaptureMode(true);
            await playEventFile(eventFile);
          }
        }
      }
    } catch (e) {
      Notification({
        type: NOTYFY_TYPE.warning,
        title: `${t("noti.archived_file")}`,
        description: `${t("noti.error_cut_file")}`,
      });
      console.log("e:", e.toString());
    } finally {
      setLoading(false);
    }
  };

  const playHandler = (cmd) => {
    const pauseEle = document.getElementById("video-control-pause");
    const playEle = document.getElementById("video-control-play");
    if (cmd === "default") {
      pauseEle.style.display = "none";
      playEle.style.display = "block";
      playbackRate = 1;
      playerVideo.current.defaultPlaybackRate = playbackRate;
      playerVideo.current.playbackRate = playbackRate;
    } else if (cmd === "play") {
      const cbRight = document.getElementById("cb-right");
      let eTime = cbRight.getAttribute("data-end_time");
      if (playerVideo.current.currentTime < +eTime) {
        pauseEle.style.display = "block";
        playEle.style.display = "none";
        playerVideo.current.play();
      }
    } else if (cmd === "pause") {
      pauseEle.style.display = "none";
      playEle.style.display = "block";
      playerVideo.current.pause();
    } else if (cmd === "decrease_rate") {
      if (playbackRate === 0.125) return;
      playbackRate = playbackRate / 2;
      playerVideo.current.defaultPlaybackRate = playbackRate;
      playerVideo.current.playbackRate = playbackRate;
    } else if (cmd === "increase_rate") {
      if (playbackRate === 16) return;
      playbackRate = playbackRate * 2;
      playerVideo.current.defaultPlaybackRate = playbackRate;
      playerVideo.current.playbackRate = playbackRate;
    }
  };

  const downloadFileHandler = async () => {
    if (downloadFileName) {
      let per = true;
      let perStr = "";
      switch (viewFileType) {
        case 0:
          perStr = "download_record_file";
          break;
        case 1:
          perStr = "download_capture_file";
          break;
        case 2:
          perStr = "download_event_file";
          break;
        case 4:
          perStr = "download_event_file";
          break;
        case 3:
          if (fileCurrent.tableName === "file") {
            perStr = "download_record_file";
          } else if (fileCurrent.eventUuid !== "") {
            perStr = "download_event_file";
          } else {
            perStr = "download_capture_file";
          }
          break;
        default:
      }
      if (perStr !== "") {
        per = permissionCheck(perStr);
      }
      if (per) {
        if (fileCurrent.type === 1) {
          saveAs(urlSnapshot, downloadFileName);
        } else {
          setLoading(true);
          console.log("fileCu2222222222222222222 ", fileCurrent.fileType)

          try {
            if (fileCurrent.tableName === "file") {
              // Call Nginx to get blob data of file
              await ExportEventFileApi.downloadFileNginx(
                fileCurrent.id,
                fileCurrent.fileType,
                fileCurrent.nginx_host
              ).then(async (result) => {
                const blob = new Blob([result.data], { type: "octet/stream" });
                const url = window.URL.createObjectURL(blob);
                saveAs(url, downloadFileName);
              });
            } else {
              if (fileCurrent.fileType === "4") {
                await ExportEventFileApi.downloadFileAI(
                  imageAICurrent.cameraUuid,
                  imageAICurrent.trackingId,
                  imageAICurrent.uuid,
                  imageAICurrent.fileName,
                  4
                ).then(async (result) => {
                  const blob = new Blob([result.data], { type: "octet/stream" });
                  console.log("blob___", blob)
                  const url = window.URL.createObjectURL(blob);
                  saveAs(url, downloadFileName);

                });
                // Call Nginx to get blob data of file

              } else {
                await ExportEventFileApi.downloadFileNginx(
                  fileCurrent.id,
                  fileCurrent.type,
                  fileCurrent.nginx_host
                ).then(async (result) => {
                  const blob = new Blob([result.data], { type: "octet/stream" });
                  const url = window.URL.createObjectURL(blob);
                  saveAs(url, downloadFileName);
                });
              }
              // Call Nginx to get blob data of file

            }
          } catch (e) {
            Notification({
              type: NOTYFY_TYPE.warning,
              title: `${t("noti.archived_file")}`,
              description: `${t("noti.error_download_file")}`,
            });
          } finally {
            setLoading(false);
          }
          // saveAs(urlVideo, downloadFileName);
        }
      } else {
        Notification({
          type: NOTYFY_TYPE.warning,
          title: `${t("noti.archived_file")}`,
          description: `${t("noti.do_not_have_permission_to_action")}`,
        });
      }
    }
  };

  const editRootFileHandler = async (uuid) => {
    setLoading(true);
    try {
      await ExportEventFileApi.getFileByUuid(uuid).then((data) => {
        setIsOpenRootFile(true);
        setViewFileType(0);
        if (data && data.payload) {
          let { important, ...file } = data.payload;
          file = {
            ...file,
            isImportant: data.payload.important,
          };
          setListFiles([file]);
          setTotal(1);
          openFile(file);
        }
      });
    } catch (e) {
      Notification({
        type: NOTYFY_TYPE.warning,
        title: `${t("noti.archived_file")}`,
        description: `${t("noti.error_open_file")}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteImageHandler = async (uuid) => {
    setLoading(true);

    const deleteFileDataRes = await AIEventsApi.deleteFileData(
      uuid
    );

    if (deleteFileDataRes && deleteFileDataRes.code === 1700) {
      Notification({
        type: NOTYFY_TYPE.success,
        title: `${t("noti.archived_file")}`,
        description: `${t("noti.successfully_delete_file")}`,
      });
      const updatedImageOther = imageOther.filter(
        (item) => item.uuid !== uuid
      );

      setImageOther([...updatedImageOther]);
    } else {
      Notification({
        type: NOTYFY_TYPE.warning,
        title: `${t("noti.archived_file")}`,
        description: `${t("noti.do_not_have_permission_to_action")}`,
      });
    }
    setLoading(false);
  };

  const viewImageAIHandler = async (item) => {
    setLoading(true);
    console.log("_________ ", item)
    await ExportEventFileApi.downloadFileAI(
      item.cameraUuid,
      item.trackingId,
      item.uuid,
      item.fileName,
      4
    ).then(async (result) => {
      const blob = new Blob([result.data], { type: "octet/stream" });
      getBase64Text(blob, async (image) => {
        setUrlSnapshot(image);
      });
    });
    setImageAICurrent({
      cameraUuid: item.cameraUuid,
      trackingId: item.trackingId,
      uuid: item.uuid,
      fileName: item.fileName,
    });
    setLoading(false);

  };

  const deleteFileHandler = async () => {
    let response = null;
    if (fileCurrent.uuid !== "") {

      if (fileCurrent.tableName === "file") {
        const deletePhysicalFileRes =
          await deleteExportEventFileApi.deletePhysicalFile(fileCurrent.uuid);
        if (deletePhysicalFileRes && +deletePhysicalFileRes.code === 800) {
          response = await ExportEventFileApi.deleteFile(fileCurrent.uuid);
          if (response) {
            Notification({
              type: NOTYFY_TYPE.success,
              title: `${t("noti.archived_file")}`,
              description: `${t("noti.successfully_delete_file")}`,
            });
            const updatedListFile = listFiles.filter(
              (item) => item.uuid !== fileCurrent.uuid
            );
            setListFiles([...updatedListFile]);
            refresh();
          }
        }
      } else {
        let isSuccess = false;

        if (fileCurrent.type === 0) {
          // Video
          const deletePhysicalFileRes =
            await deleteExportEventFileApi.deletePhysicalFile(fileCurrent.uuid);
          if (deletePhysicalFileRes && +deletePhysicalFileRes.code === 800) {
            isSuccess = true;
          }
        } else {
          if (fileCurrent.fileType === "4") {

            const delete_file =
              await AIEventsApi.delete(fileCurrent.uuid);

            if (delete_file) {
              Notification({
                type: NOTYFY_TYPE.success,
                title: `${t("noti.archived_file")}`,
                description: `${t("noti.successfully_delete_file")}`,
              });
              const updatedListFile = listFiles.filter(
                (item) => item.uuid !== fileCurrent.uuid
              );

              setListFiles([...updatedListFile]);
              refresh();
            }
          } else {
            const deleteFileDataRes = await ExportEventFileApi.deleteFileData(
              fileCurrent.pathFile
            );
            if (deleteFileDataRes && deleteFileDataRes.code === "1600") {
              isSuccess = true;
            }
          }

          // Image

        }
        if (isSuccess && fileCurrent.fileType !== "4") {
          response = await ExportEventFileApi.deleteEventFile(fileCurrent.uuid);
          if (response) {
            Notification({
              type: NOTYFY_TYPE.success,
              title: `${t("noti.archived_file")}`,
              description: `${t("noti.successfully_delete_file")}`,
            });
            const updatedListFile = listFiles.filter(
              (item) => item.uuid !== fileCurrent.uuid
            );
            setListFiles([...updatedListFile]);
            refresh();
          }
        }
      }
    }
  };

  const editFileHandler = async (file, dataList, perStr) => {
    let per = true;
    if (perStr !== "") {
      per = permissionCheck(perStr);
    }
    if (per) {
      let response = null;
      let { ...requestObject } = file;
      if (requestObject.tableName === "file") {
        response = await ExportEventFileApi.updateFile(
          requestObject,
          requestObject.uuid
        );
      } else {
        response = await ExportEventFileApi.updateEventFile(
          requestObject,
          requestObject.uuid
        );
      }
      if (response) {
        Notification({
          type: NOTYFY_TYPE.success,
          title: `${t("noti.archived_file")}`,
          description: `${t("noti.successfully_edit_file")}`,
        });
        if (viewFileType === 3 && !requestObject.isImportant) {
          refresh();
          const updatedListFile = dataList.filter(
            (item) => item.uuid !== requestObject.uuid
          );
          setListFiles([...updatedListFile]);
        } else {
          const index = findIndex(
            dataList,
            (item) => item.uuid === requestObject.uuid
          );
          dataList[index] = requestObject;
          setListFiles([...dataList]);
          // setFileCurrent({ ...requestObject });
          // setEventFileCurrent(preSate => {
          //     return { ...preSate, isImportant: requestObject.isImportant, eventName: requestObject.eventName };
          // });
        }
      }
    } else {
      Notification({
        type: NOTYFY_TYPE.warning,
        title: `${t("noti.archived_file")}`,
        description: `${t("noti.do_not_have_permission_to_action")}`,
      });
    }
  };

  const editFileOnPopoverHandler = async (isImportant, note) => {
    if (fileCurrent) {
      let perStr = "";
      if (isImportant !== null) perStr = "mark_important_file";
      if (note !== null) perStr = "edit_file_note";
      const per = permissionCheck(perStr);
      if (per) {
        let requestObject = Object.assign({ ...fileCurrent });
        if (isImportant !== null) {
          requestObject = Object.assign({
            ...requestObject,
            isImportant: isImportant,
          });
        }
        if (note !== null) {
          requestObject = Object.assign({ ...requestObject, note: note });
        }
        let response = null;
        if (requestObject.tableName === "file") {
          response = await ExportEventFileApi.updateFile(
            requestObject,
            requestObject.uuid
          );
        } else {
          response = await ExportEventFileApi.updateEventFile(
            requestObject,
            requestObject.uuid
          );
        }

        if (response) {
          Notification({
            type: NOTYFY_TYPE.success,
            title: `${t("noti.archived_file")}`,
            description: `${t("noti.successfully_edit_file")}`,
          });
          const dataList = [...listFiles];
          if (viewFileType === 3 && !requestObject.isImportant) {
            refresh();
            const updatedListFile = dataList.filter(
              (item) => item.uuid !== requestObject.uuid
            );
            setListFiles([...updatedListFile]);
          } else {
            const index = findIndex(
              dataList,
              (item) => item.uuid === requestObject.uuid
            );
            dataList[index] = requestObject;
            setListFiles([...dataList]);
            setFileCurrent({ ...requestObject });
            setEventFileCurrent((preSate) => {
              return {
                ...preSate,
                isImportant: requestObject.isImportant,
                note: requestObject.note,
              };
            });
          }
        }
      } else {
        Notification({
          type: NOTYFY_TYPE.warning,
          title: `${t("noti.archived_file")}`,
          description: `${t("noti.do_not_have_permission_to_action")}`,
        });
      }
    }
  };

  const originalHandler = async () => {
    // In case play capture file
    if (urlSnapshot === "") {
      // Play file
      await playFile(originalFile);
    }
    setCaptureMode(false);
    setUrlSnapshot("");
    setFileCurrent(originalFile);
  };

  const clickTableEventFileHandler = async (eventFile, dataList) => {
    setCaptureMode(true);
    setFileCurrent(eventFile);
    if (eventFile.type === 0) {
      //Video type
      setUrlSnapshot("");
      setListEventFiles([...dataList]);
      // Play event file
      await playEventFile(eventFile);
    } else {
      //Image type
      if (eventFile.isSaved) {
        setUrlSnapshot("data:image/jpeg;base64," + eventFile.thumbnailData[0]);
        setListEventFiles([...dataList]);
      } else {
        if (eventFile.blob) {
          const url = window.URL.createObjectURL(eventFile.blob);
          setUrlSnapshot(url);
          setListEventFiles([...dataList]);
        }
      }
    }
  };

  const deleteEventFileHandler = async (uuid) => {
    const index = findIndex(listEventFiles, (item) => item.uuid === uuid);
    if (index !== -1) {
      if (listEventFiles[index].isSaved) {
        let isSuccess = false;
        if (listEventFiles[index].type === 0) {
          // Video
          const deletePhysicalFileRes =
            await deleteExportEventFileApi.deletePhysicalFile(uuid);
          if (deletePhysicalFileRes && +deletePhysicalFileRes.code === 800) {
            isSuccess = true;
          }
        } else {
          // Image
          const deleteFileDataRes = await ExportEventFileApi.deleteFileData(
            listEventFiles[index].pathFile
          );
          if (deleteFileDataRes && deleteFileDataRes.code === "1600") {
            isSuccess = true;
          }
        }
        if (isSuccess) {
          const response = await ExportEventFileApi.deleteEventFile(uuid);
          if (response) {
            Notification({
              type: NOTYFY_TYPE.success,
              title: `${t("noti.archived_file")}`,
              description: `${t("noti.successfully_delete_file")}`,
            });
            const updatedListFile = listEventFiles.filter(
              (item) => item.uuid !== uuid
            );
            setListEventFiles([...updatedListFile]);
            setUrlSnapshot("");
            refresh();
          }
        }
      } else {
        const updatedListFile = listEventFiles.filter(
          (item) => item.uuid !== uuid
        );
        setListEventFiles([...updatedListFile]);
        setUrlSnapshot("");
      }
    }
  };

  const editEventFileHandler = async (eventFile, dataList) => {
    let { blob, tBlob, isSaved, ...requestObject } = eventFile; //Create requestObject without blob, isSaved fields
    requestObject = Object.assign({ ...requestObject, isSaved: true });
    const response = await ExportEventFileApi.updateEventFile(
      requestObject,
      requestObject.uuid
    );
    if (response) {
      Notification({
        type: NOTYFY_TYPE.success,
        title: `${t("noti.archived_file")}`,
        description: `${t("noti.successfully_edit_file")}`,
      });
      const index = findIndex(
        dataList,
        (item) => item.uuid === requestObject.uuid
      );
      dataList[index] = requestObject;
      setListEventFiles([...dataList]);
    }
  };

  const changeEditModeHandler = (dataList) => {
    setListEventFiles([...dataList]);
  };

  const closeObjectForm = () => {
    AIEventsApi.getDetailEvent(fileCurrent.uuid).then(
      (data) => {

        if (data && data.payload) {
          setDetailAI({
            ...fileCurrent,
            code: data.payload.code,
            name: data.payload.name,
            position: data.payload.position,
            note: data.payload.note,
            plateNumber: data.payload.plateNumber,
            departmentUuid: data.payload.departmentUuid,
            departmentName: data.payload.departmentName,
            typeObject: data.payload.useCase === "zac_vehicle" ? "vehicle" : "human"
          })

        }
      }
    );
  };

  const saveEventFileHandler = (eventFile, dataList) => {
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
        let { blob, tBlob, isSaved, ...requestObject } = eventFile; //Create requestObject without blob, isSaved fields
        getBase64Text(eventFile.tBlob, async (thumbnailData) => {
          requestObject = Object.assign({
            ...requestObject,
            pathFile: path,
            isSaved: true,
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
              title: `${t("noti.archived_file")}`,
              description: `${t("noti.successfully_add_file")}`,
            });
            let newDataList = [...dataList];
            const index = findIndex(
              newDataList,
              (item) => item.uuid === requestObject.uuid
            );
            newDataList[index] = requestObject;
            setListEventFiles([...newDataList]);
          }
        });
      } else {
        Notification({
          type: NOTYFY_TYPE.warning,
          title: `${t("noti.archived_file")}`,
          description: `${t("noti.error_save_file")}`,
        });
      }
    });
  };

  const checkDisabled = () => {
    if (captureMode) return "disabled";
    if (urlSnapshot) return "disabled";
    if (viewFileType === 4) return "disabled";
    if (!fileCurrent) return "disabled";
    if (fileCurrent.uuid === "") return "disabled";
    return "";
  };

  const checkBtnCaptureDisabled = () => {
    if (viewFileType > 0) return false;
    if (viewFileType === 4) return false;
    if (captureMode) return false;
    if (urlSnapshot) return false;
    if (!fileCurrent) return false;
    return fileCurrent.uuid !== "";
  };

  const checkBtnDeleteDisabled = () => {
    if (captureMode) return "disabled";
    if (!fileCurrent) return "disabled";
    if (fileCurrent.uuid === "") return "disabled";
    return "";
  };

  const checkBtnDownloadDisabled = () => {
    if (!fileCurrent) return "disabled";
    if (fileCurrent.uuid === "") return "disabled";
    return "";
  };

  const checkBtnEditRootFileDisabled = () => {
    if (viewFileType === 0) return false;
    if (viewFileType === 4) return false;
    if (!fileCurrent) return false;
    return !(fileCurrent.uuid === "" || fileCurrent.rootFileUuid === "");
  };

  const checkBtnInfoDisabled = () => {
    if (captureMode) return "disabled";
    if (viewFileType === 4) return "disabled";
    if (!fileCurrent) return "disabled";
    if (fileCurrent.uuid === "") return "disabled";
    return "";
  };

  const checkBtnInfoObjectDisabled = () => {
    if (captureMode) return "disabled";
    if (!fileCurrent) return "disabled";
    if (fileCurrent.uuid === "") return "disabled";
    return "";
  };

  const changeNoteHandler = (event) => {
    setCurrNode(event.target.value);
  };

  const cancelChangeNoteHandler = () => {
    setCurrNode(eventFileCurrent.note);
    setEditMode(false);
  };

  const saveFileHandler = (isImportant, note) => {
    // props.onEditFile(isImportant, note);
    editNoteHandler(note);
    setEditMode(false);
  };

  const editNoteHandler = async (note) => {
    if (eventFileCurrent) {
      let perStr = "";
      if (note !== null) perStr = "edit_file_note";
      const per = permissionCheck(perStr);

      if (per) {
        let requestObject = Object.assign({ ...eventFileCurrent });
        if (note !== null) {
          requestObject = Object.assign({ ...eventFileCurrent, note: note });
        }
        let response = null;
        response = await AIEventsApi.editInforOfEvent(
          requestObject.uuid,
          requestObject
        );

        if (response) {
          Notification({
            type: NOTYFY_TYPE.success,
            title: `${t("noti.archived_file")}`,
            description: `${t("noti.successfully_edit_file")}`,
          });
          const dataList = [...listFiles];
          if (viewFileType === 3 && !requestObject.isImportant) {
            refresh();
            const updatedListFile = dataList.filter(
              (item) => item.uuid !== requestObject.uuid
            );
            setListFiles([...updatedListFile]);
          } else {
            const index = findIndex(
              dataList,
              (item) => item.uuid === requestObject.uuid
            );
            dataList[index] = requestObject;
            setListFiles([...dataList]);
            setFileCurrent({ ...requestObject });
            setEventFileCurrent((preSate) => {
              return {
                ...preSate,
                isImportant: requestObject.isImportant,
                note: requestObject.note,
              };
            });
          }
        }
      } else {
        Notification({
          type: NOTYFY_TYPE.warning,
          title: `${t("noti.archived_file")}`,
          description: `${t("noti.do_not_have_permission_to_action")}`,
        });
      }
    }
  };

  const renderEventFileDetail = () => {
    if (viewFileType === 4) {
      return (
        <>
          <Row gutter={[16, 30]} className="eventFileDetail">
            <Col span={6}>
              <div className="title">
                {t("view.ai_events.camera_name")}
              </div>
              <div>{detailAI?.cameraName}</div>
            </Col>
            <Col span={6}>
              <div className="title">{t("view.storage.violation_time")}</div>
              <div>
                {detailAI != null && detailAI.createdTime === -1
                  ? ""
                  : moment(detailAI.createdTime).format(
                    "HH:mm DD/MM/YYYY"
                  )}
              </div>
            </Col>
            <Col span={6}>
              <div className="title">{t("view.ai_events.typeObject")}</div>
              {detailAI?.subEventType
                ? <div>{t("view.ai_events." + detailAI.subEventType)}</div>
                : null}


            </Col>
            <Col span={6}>
              <div className="title">
                {t("view.ai_events.info")}
                <Tooltip
                  placement="bottomLeft"
                  title={t("view.ai_events.edit_info")}
                >
                  <Popover
                    overlayClassName={`${checkBtnInfoObjectDisabled()
                      ? "fileInfoPopoverHidden"
                      : "fileInfoPopover"
                      }`}
                    placement="topRight"
                    title=""
                    
                    content={
                      checkBtnInfoObjectDisabled()
                        ? ""
                        : renderInfoObjectPopoverContent
                    }
                    trigger={`${checkBtnInfoObjectDisabled() ? "" : "click"}`}
                  >
                    <AiFillEdit
                      className={`${checkBtnInfoObjectDisabled()
                        ? "action__disabled"
                        : "action"
                        }`}
                      onClick={(e) => {
                        if (checkBtnInfoObjectDisabled()) return;
                        e.stopPropagation();
                      }}
                    />
                  </Popover>
                </Tooltip>
              </div>
              {detailAI.useCase === "zac_vehicle"
                ? <ul style={{ listStyleType: 'none', display: 'inline-block' }}>
                  <li>{t("view.ai_events.type")} : {t("view.ai_events.useCase." + detailAI.useCase)}</li>
                  <li>{t("view.ai_events.plateNumber")} : {detailAI.plateNumber ? detailAI.plateNumber : t("view.ai_events.UnKnow")}</li>
                </ul>
                : null}
              {detailAI.useCase === "zac_human"
                ? <ul style={{ listStyleType: 'none', display: 'inline-block' }}>
                  <li>{t("view.ai_events.type")} : {t("view.ai_events.useCase." + detailAI.useCase)}</li>
                  <li>{t("view.ai_events.code")} : {detailAI.code ? detailAI.code : t("view.ai_events.UnKnow")}</li>
                  <li>{t("view.ai_events.name")} : {detailAI.name ? detailAI.name : t("view.ai_events.UnKnow")}</li>
                  <li>{t("view.ai_events.position")} : {detailAI.position ? detailAI.position : t("view.ai_events.UnKnow")}</li>
                  <li>{t("view.ai_events.department")} : {detailAI.departmentName ? detailAI.departmentName : t("view.ai_events.UnKnow")}</li>
                </ul>
                : null}
              {detailAI.useCase === "attendance"
                ? <ul style={{ listStyleType: 'none', display: 'inline-block' }}>
                  <li>{t("view.ai_events.code")} : {detailAI.code}</li>
                  <li>{t("view.ai_events.name")} : {detailAI.name}</li>
                  <li>{t("view.ai_events.position")} : {detailAI.position}</li>
                  <li>{t("view.ai_events.department")} : {detailAI.departmentName}</li>
                </ul>
                : null}
              {/* <div>
                {t("view.ai_events.plateNumber")} : {eventFileCurrent.plateNumber}
              </div> */}
            </Col>
            <Col span={6}>
              <div className="title">{t("view.storage.file_name")}</div>
              <div>{detailAI.fileName}</div>
            </Col>
            <Col span={12}>
              <div className="title">{t("view.storage.path")}</div>
              <div className="pathFile">{detailAI.pathFile}</div>
            </Col>
            <Col span={24}>
              <div className="title">{t("view.ai_events.err_image")}</div>
              <div>
                <ul >
                  {

                    imageOther ? imageOther.map((item, index) =>

                      <li key={item.uuid} style={{ listStyleType: 'none', display: 'inline-block', marginRight: '20px' }}><div style={{ width: '90%', paddingBottom: '10px' }}>

                        <div className='img__item' style={{ position: "relative" }}>
                          {item.uuid != detailAI.uuid ? <Popconfirm title="Chắc chắn để xóa?"
                            onCancel={event => {
                              event.stopPropagation();
                            }}
                            onConfirm={(event) => { event.stopPropagation(); deleteImageHandler(item.uuid); }}>
                            <Button className="button-photo-remove" size="small" type="danger"
                              onClick={event => {
                                event.stopPropagation();
                              }}
                              style={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                width: '15px',
                                height: '15px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'red',
                                // padding: '15px'
                              }}
                            >
                              <CloseOutlined style={{}} />
                            </Button>
                          </Popconfirm> : null}

                          <img onClick={event => {

                            event.stopPropagation();
                            viewImageAIHandler(item)
                          }} style={{ width: '120px', height: "120px" }} className="cursor-pointer" src={"data:image/jpeg;base64," + item.image} alt="Avatar" />
                        </div>
                      </div></li>
                    ) : null

                  }

                </ul>
              </div>
            </Col>
            <Col span={12}>
              <div className="title">
                <span>{t("view.common_device.note")}</span>
                {editMode && (
                  <AiOutlineEdit
                    className="iconEdit"
                    onClick={() => {
                      setEditMode(true);
                    }}
                  />
                )}
                {editMode && (
                  <AiOutlineCheck
                    className="iconEdit"
                    onClick={() => saveFileHandler(null, currNode)}
                  />
                )}
                {editMode && (
                  <AiOutlineClose
                    className="iconEdit"
                    onClick={() => cancelChangeNoteHandler()}
                  />
                )}
              </div>
              <div>
                {!editMode && <span>{eventFileCurrent.note}</span>}
                {editMode && (
                  <TextArea
                    defaultValue={currNode}
                    rows={4}
                    onChange={debounce(changeNoteHandler, 500)}
                  />
                )}
              </div>
            </Col>
          </Row>
        </>
      );
    } else {
      return (
        <>
          <Row gutter={[16, 30]} className="eventFileDetail">
            <Col span={6}>
              <div className="title">{t("view.storage.file_name")}</div>
              <div>{eventFileCurrent.name}</div>
            </Col>
            <Col span={6}>
              <div className="title">{t("view.storage.event")}</div>
              <div>{eventFileCurrent.eventName}</div>
            </Col>
            <Col span={12}>
              <div className="title">{t("view.storage.path")}</div>
              <div className="pathFile">{eventFileCurrent.pathFile}</div>
            </Col>
            <Col span={6}>
              <div className="title">{t("view.storage.violation_time")}</div>
              <div>
                {eventFileCurrent.violationTime === -1
                  ? ""
                  : moment(eventFileCurrent.violationTime * 1000).format(
                    "HH:mm DD/MM/YYYY"
                  )}
              </div>
            </Col>
            <Col span={6}>
              <div className="title">{t("view.storage.created_time")}</div>
              <div>
                {eventFileCurrent.createdTime === -1
                  ? ""
                  : moment(eventFileCurrent.createdTime).format(
                    "HH:mm DD/MM/YYYY"
                  )}
              </div>
            </Col>
            <Col span={12}>
              <div className="title">
                {t("view.storage.camera_name", { cam: t("camera") })}
              </div>
              <div>{eventFileCurrent.cameraName}</div>
            </Col>
            <Col span={6}>
              <div className="title">{t("view.storage.type")}</div>
              <div>
                {eventFileCurrent.type === 0 && <FiFilm className="iconType" />}
                {eventFileCurrent.type === 1 && (
                  <FiImage className="iconType" />
                )}
              </div>
            </Col>
            <Col span={6}>
              <div className="title">{t("view.storage.length")}</div>
              <div>
                {eventFileCurrent.length ? new Date(+eventFileCurrent.length * 1000)
                  .toISOString()
                  .substr(11, 8) : 0}
              </div>
            </Col>
            <Col span={12}>
              <div className="title">{t("view.storage.address")}</div>
              <div>{eventFileCurrent.address}</div>
            </Col>
            <Col span={6}>
              <div className="title">{t("view.storage.note")}</div>
              <div>{eventFileCurrent.note}</div>
            </Col>
          </Row>
        </>
      );
    }
  };

  const renderInfoPopoverContent = () => {
    return (
      <MemoizedInfoPopoverContent
        viewFileType={viewFileType}
        fileCurrent={fileCurrent}
        onEditFile={editFileOnPopoverHandler}
        onDownloadFile={downloadFileHandler}
        onDeleteFile={deleteFileHandler}

      />
    );
  };

  const renderInfoObjectPopoverContent = () => {
    return (
      <MemoizedInfoObjectPopoverContent
        viewFileType={viewFileType}
        fileCurrent={detailAI}
        onEditFile={editFileOnPopoverHandler}
        onDownloadFile={downloadFileHandler}
        onDeleteFile={deleteFileHandler}
        closeObjectForm={closeObjectForm}
      />
    );
  };

  return (
    <>
      <Row>
        <Col span={8} className="FileListContainer">
          <Row className="rowMode">
            <Col span={12} className="sourceView">
              <Tooltip
                placement="bottomLeft"
                title={t("view.storage.daily_archive_files_list")}
              >
                <div className="iconContainer">
                  <FiDatabase
                    className={`icon ${viewFileType === 0 ? "iconActive" : ""}`}
                    onClick={() => setViewFileType(0)}
                  />
                </div>
              </Tooltip>
              <Tooltip
                placement="bottomLeft"
                title={t("view.storage.captured_files_list")}
              >
                <div className="iconContainer">
                  <MdCenterFocusWeak
                    className={`icon ${viewFileType === 1 ? "iconActive" : ""}`}
                    onClick={() => setViewFileType(1)}
                  />
                </div>
              </Tooltip>
              <Tooltip
                placement="bottomLeft"
                title={t("view.storage.event_files_list")}
              >
                <div className="iconContainer">
                  <RiCalendarTodoLine
                    className={`icon ${viewFileType === 2 ? "iconActive" : ""}`}
                    onClick={() => setViewFileType(2)}
                  />
                </div>
              </Tooltip>
              <Tooltip
                placement="bottomLeft"
                title={t("view.storage.important_files_list")}
              >
                <div className="iconContainer">
                  <FiBookmark
                    className={`icon ${viewFileType === 3 ? "iconActive" : ""}`}
                    onClick={() => setViewFileType(3)}
                  />
                </div>
              </Tooltip>
              <Tooltip
                placement="bottomLeft"
                title={t("view.ai_events.event_files_list")}
              >
                <div className="iconContainer">
                  <AiFillVideoCamera
                    className={`icon ${viewFileType === 4 ? "iconActive" : ""}`}
                    onClick={() => setViewFileType(4)}
                  />
                </div>
              </Tooltip>
            </Col>
            <Col span={12} className="modeView">
              <Tooltip placement="bottom" title={t("view.storage.list_view")}>
                <div className="iconContainer">
                  <FiList
                    className={`icon ${isTableView ? "iconActive" : ""}`}
                    onClick={() => setIsGridView(!isTableView)}
                  />
                </div>
              </Tooltip>
              <Tooltip placement="bottom" title={t("view.storage.grid_view")}>
                <div className="iconContainer">
                  <FiGrid
                    className={`icon ${!isTableView ? "iconActive" : ""}`}
                    onClick={() => setIsGridView(!isTableView)}
                  />
                </div>
              </Tooltip>
            </Col>
          </Row>
          <MemoizedTableFile
            listFiles={listFiles || []}
            eventList={eventList || []}
            eventListAI={eventListAI || []}
            total={total}
            viewFileType={viewFileType}
            isTableView={isTableView}
            isOpenRootFile={isOpenRootFile}
            onClickRow={onClickTableFileHandler}
            onSearch={onSearchHandler}
            onEditFile={editFileHandler}

          />
        </Col>
        <Col span={16} className="viewFileContainer">
          <Row className="screenView">
            <Col span={24}>
              <div className="displayScreen">
                <div
                  className={`iconPoster ${playerReady && !urlSnapshot ? "" : "hidden"
                    }`}
                >
                  <MemoizedHlsPlayer
                    playerReady={playerReady}
                    urlSnapshot={urlSnapshot}
                    playerVideo={playerVideo}
                    playerSrc={playerSrc}
                    duration={duration}
                  />
                </div>
                <img
                  className={`iconPoster ${!playerReady && !urlSnapshot ? "" : "hidden"
                    }`}
                  src={imagePoster}
                  alt=""
                />
                <img
                  className={`iconPoster ${urlSnapshot ? "" : "hidden"}`}
                  src={`${urlSnapshot ? urlSnapshot : imagePoster}`}
                  alt=""
                />
              </div>
            </Col>
          </Row>
          <Row className="playControl">
            <Col span={7} />
            <Col className="actionControl" span={10}>
              <div
                className={`disable-select ${checkDisabled()
                  ? "playIconContainer__disabled"
                  : "playIconContainer"
                  }`}
              >
                <FiRewind
                  className="playIcon"
                  onClick={() => {
                    if (checkDisabled()) return;
                    playHandler("decrease_rate");
                  }}
                />
              </div>
              {/*<div className={`${checkDisabled()?'playIconContainer__disabled':'playIconContainer'}`}>*/}
              {/*    <FiSkipBack className="playIcon"/>*/}
              {/*</div>*/}
              <div
                className={`disable-select ${checkDisabled()
                  ? "playIcon2Container__disabled"
                  : "playIcon2Container"
                  }`}
                onClick={() => {
                  if (checkDisabled()) return;
                  const playEle = document.getElementById("video-control-play");
                  if (playEle.style.display === "none") {
                    playHandler("pause");
                  } else {
                    playHandler("play");
                  }
                }}
              >
                <FiPause
                  id="video-control-pause"
                  className="playIcon2"
                  style={{ display: "none" }}
                // onClick={() => {
                //   if (checkDisabled()) return;
                //   playHandler("pause");
                // }}
                />
                <FiPlay
                  id="video-control-play"
                  className="playIcon2"
                // onClick={() => {
                //   if (checkDisabled()) return;
                //   playHandler("play");
                // }}
                />
              </div>
              {/*<div className={`${checkDisabled()?'playIconContainer__disabled':'playIconContainer'}`}>*/}
              {/*    <FiSkipForward className="playIcon"/>*/}
              {/*</div>*/}
              <div
                className={`disable-select ${checkDisabled()
                  ? "playIconContainer__disabled"
                  : "playIconContainer"
                  }`}
              >
                <FiFastForward
                  className="playIcon"
                  onClick={() => {
                    if (checkDisabled()) return;
                    playHandler("increase_rate");
                  }}
                />
              </div>
            </Col>
            <Col span={7} className="captureContainer">
              {checkDisabled() &&
                viewFileType === 0 &&
                eventFileCurrent.type !== -1 && (
                  <Tooltip placement="bottomLeft" title={t("view.storage.org")}>
                    <span className="ogLabel" onClick={originalHandler}>
                      ORG
                    </span>
                  </Tooltip>
                )}
              {checkBtnEditRootFileDisabled() && (
                <Tooltip placement="bottomLeft" title={t("view.storage.org")}>
                  <span
                    className="ogLabel"
                    onClick={() => {
                      if (fileCurrent.tableName === "file") {
                        editRootFileHandler(fileCurrent.uuid).then();
                      } else {
                        editRootFileHandler(fileCurrent.rootFileUuid).then();
                      }
                    }}
                  >
                    ORG
                  </span>
                </Tooltip>
              )}
              <Tooltip
                placement="bottomLeft"
                title={t("view.storage.view_information")}
              >
                <Popover
                  overlayClassName={`${checkBtnInfoDisabled()
                    ? "fileInfoPopoverHidden"
                    : "fileInfoPopover"
                    }`}
                  placement="topRight"
                  title=""
                  content={
                    checkBtnInfoDisabled() ? "" : renderInfoPopoverContent
                  }
                  trigger={`${checkBtnInfoDisabled() ? "" : "click"}`}
                >
                  <AiOutlineInfoCircle
                    className={`${checkBtnInfoDisabled() ? "action__disabled" : "action"
                      }`}
                    onClick={(e) => {
                      if (checkBtnInfoDisabled()) return;
                      e.stopPropagation();
                    }}
                  />
                </Popover>
              </Tooltip>
              <Tooltip
                placement="bottomLeft"
                title={t("view.storage.download_file")}
              >
                <FiDownload
                  className={`${checkBtnDownloadDisabled() ? "action__disabled" : "action"
                    }`}
                  onClick={() => {
                    if (checkBtnDownloadDisabled()) return;
                    downloadFileHandler();
                  }}
                />
              </Tooltip>
              {checkBtnCaptureDisabled() && (
                <Tooltip
                  placement="bottomLeft"
                  title={t("view.storage.cut_file")}
                >
                  <FiScissors
                    className="action"
                    onClick={() => {
                      captureVideoHandler().then();
                    }}
                  />
                </Tooltip>
              )}
              {checkBtnCaptureDisabled() && (
                <Tooltip
                  placement="bottomLeft"
                  title={t("view.storage.capture_snapshot")}
                >
                  <FiCamera
                    className="action"
                    onClick={() => {
                      captureSnapshotHandler();
                    }}
                  />
                </Tooltip>
              )}
              <Tooltip placement="bottomLeft" title={t("view.storage.delete")}>
                <Popconfirm
                  title={t("noti.delete_file", { this: t("this") })}
                  cancelText={t("view.user.detail_list.cancel")}
                  okText={t("view.user.detail_list.confirm")}
                  onConfirm={() => {
                    if (checkBtnDeleteDisabled()) return;
                    deleteFileHandler().then((r) => { });
                  }}
                >
                  <RiDeleteBinLine
                    className={`${checkBtnDeleteDisabled() ? "action__disabled" : "action"
                      }`}
                  />
                </Popconfirm>
              </Tooltip>
            </Col>
          </Row>
          {/*<Row className="timeDuration" style={{display: `${checkDisabled() ? 'none' : 'flex'}`}}>*/}
          {/*    <div className="text">*/}
          {/*        {format(duration)}*/}
          {/*    </div>*/}
          {/*</Row>*/}
          <Row
            style={{
              margin: "25px 0px",
              display: `${checkDisabled() ? "none" : "inherit"}`,
            }}
          >
            <Col span={23} style={{ margin: "auto" }}>
              {fileCurrent && (
                <MemoizedThumbnailVideo
                  duration={duration}
                  videoFile={urlVideoTimeline}
                  playerVideo={playerVideo}
                  fileCurrent={fileCurrent}
                  viewFileType={viewFileType}
                  zoom={zoom}
                />
              )}
            </Col>
            <canvas ref={refCanvas} className="snapshotCanvas" />
          </Row>
          <Row>
            {viewFileType === 0 && (
              <MemoizedTableEventFile
                key="uuid"
                dataList={[...listEventFiles]}
                eventList={[...eventList]}
                onClickRow={clickTableEventFileHandler}
                onDeleteEventFile={deleteEventFileHandler}
                onEditEventFile={editEventFileHandler}
                onSaveEventFile={saveEventFileHandler}
                onChangeEditModeHandler={changeEditModeHandler}
              />
            )}
            {viewFileType !== 0 && renderEventFileDetail()}
          </Row>
        </Col>
      </Row>
      {loading ? <Loading /> : null}
    </>
  );
};

export default ExportEventFile;
