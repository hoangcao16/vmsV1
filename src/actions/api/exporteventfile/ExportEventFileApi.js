import { reactLocalStorage } from "reactjs-localstorage";
import controllerApi from "../../../api/controller-api/api";
import { handleErrCode } from "../../../api/controller-api/code";
import Notification from "../../../components/vms/notification/Notification";
import { NOTYFY_TYPE } from "../../../view/common/vms/Constant";
import FileService from "./fileservice";

const FILE_ENDPOINT = "/cctv-controller-svc/api/v1/files";
const EVENT_FILE_ENDPOINT = "/cctv-controller-svc/api/v1/event-files";
const IMPORTANT_FILE_ENDPOINT = "/cctv-controller-svc/api/v1/important_files";
const MONITOR_CONTROLLER_ENDPOINT = "/cctv-monitor-ctrl-svc/api/v1";

const language = reactLocalStorage.get("language");

const ExportEventFileApi = {
  downloadFileNginx: async (fileId, fileType, nginx_host) => {
    let result;
    try {
      result = await FileService.getRequestData("/api/v1/downloadFileNginx", {
        fileId: fileId,
        fileType: fileType,
        nginxHost: nginx_host,
      });
    } catch (e) {
      if (language == "vn") {
        Notification({
          type: NOTYFY_TYPE.warning,
          title: "Tệp lưu trữ",
          description: e.toString(),
        });
      } else {
        Notification({
          type: NOTYFY_TYPE.warning,
          title: "Archived file",
          description: e.toString(),
        });
      }
      return null;
    }
    return result;
  },

  downloadFile: async (fileId, fileType) => {
    let result;
    try {
      result = await FileService.getRequestData("/api/v1/downloadFile", {
        fileId: fileId,
        fileType: fileType,
      });
    } catch (e) {
      if (language == "vn") {
        Notification({
          type: NOTYFY_TYPE.warning,
          title: "Tệp lưu trữ",
          description: e.toString(),
        });
      } else {
        Notification({
          type: NOTYFY_TYPE.warning,
          title: "Archived file",
          description: e.toString(),
        });
      }
      return null;
    }
    return result;
  },

  downloadFileAI: async (cameraUuid, trackingId, uuid, fileName, fileType) => {
    let result;
    try {
      result = await FileService.getRequestData("/api/v1/downloadAIFile", {
        cameraUuid: cameraUuid,
        trackingId: trackingId,
        uuid: uuid,
        fileName: fileName
      });
    } catch (e) {
      if (language == "vn") {
        Notification({
          type: NOTYFY_TYPE.warning,
          title: "Tệp lưu trữ",
          description: e.toString(),
        });
      } else {
        Notification({
          type: NOTYFY_TYPE.warning,
          title: "Archived file",
          description: e.toString(),
        });
      }
      return null;
    }
    return result;
  },

  getAvatar: async (avatarFileName) => {
    let result;
    try {
      result = await FileService.getRequestData("/api/v1/viewAvatar", {
        fileId: avatarFileName,
      });
    } catch (e) {
      return {};
    }
    return result;
  },

  uploadAvatar: async (avatarFileName, file) => {
    let result;
    const fmData = new FormData();
    fmData.append(
      "fileInfo",
      new Blob(['{"fileName": "' + avatarFileName + '"}'], {
        type: "application/json",
      }),
      "fileInfo.json"
    );
    fmData.append("files", file);
    try {
      result = await FileService.postRequestData(
        "/api/v1/uploadAvatar",
        fmData
      );
    } catch (e) {
      if (language == "vn") {
        Notification({
          type: NOTYFY_TYPE.warning,
          title: "Tệp lưu trữ",
          description: e.toString(),
        });
      } else {
        Notification({
          type: NOTYFY_TYPE.warning,
          title: "Archived file",
          description: e.toString(),
        });
      }
      return {};
    }
    return result;
  },

  uploadFile: async (fileName, file) => {
    let result;
    const fmData = new FormData();
    fmData.append(
      "fileInfo",
      new Blob(['{"fileName": "' + fileName + '"}'], {
        type: "application/json",
      }),
      "fileInfo.json"
    );
    fmData.append("files", file);
    try {
      result = await FileService.postRequestData("/api/v1/uploadFile", fmData);
    } catch (e) {
      if (language == "vn") {
        Notification({
          type: NOTYFY_TYPE.warning,
          title: "Tệp lưu trữ",
          description: e.toString(),
        });
      } else {
        Notification({
          type: NOTYFY_TYPE.warning,
          title: "Archived file",
          description: e.toString(),
        });
      }
      return {};
    }
    return result;
  },

  deleteFileData: async (pathFile) => {
    let result;
    try {
      result = await FileService.deleteRequestData("/api/v1/deleteFile", {
        fileName: pathFile,
      });
    } catch (e) {
      if (language == "vn") {
        Notification({
          type: NOTYFY_TYPE.warning,
          title: "Tệp lưu trữ",
          description: e.toString(),
        });
      } else {
        Notification({
          type: NOTYFY_TYPE.warning,
          title: "Archived file",
          description: e.toString(),
        });
      }
      return null;
    }
    return result;
  },

  getFileList: async (params) => {
    const response = await new Promise((resolve, reject) => {
      controllerApi.axiosIns
        .get(FILE_ENDPOINT, {
          params: params,
        })
        .then((response) => resolve(response))
        .catch((error) => reject(error));
    });
    if (response && response.data) {
      return handleErrCode(response.data);
    }
    return null;
  },

  getFileByUuid: async (uuid) => {
    const response = await new Promise((resolve, reject) => {
      controllerApi.axiosIns
        .get(`${FILE_ENDPOINT}/${uuid}`)
        .then((response) => resolve(response))
        .catch((error) => reject(error));
    });
    if (response && response.data) {
      return handleErrCode(response.data);
    }
    return null;
  },

  getEventFileList: async (params) => {
    const response = await new Promise((resolve, reject) => {
      controllerApi.axiosIns
        .get(EVENT_FILE_ENDPOINT, {
          params: params,
        })
        .then((response) => resolve(response))
        .catch((error) => reject(error));
    });
    if (response && response.data) {
      return handleErrCode(response.data);
    }
    return null;
  },

  getImportantFileList: async (params) => {
    const response = await new Promise((resolve, reject) => {
      controllerApi.axiosIns
        .get(IMPORTANT_FILE_ENDPOINT, {
          params: params,
        })
        .then((response) => resolve(response))
        .catch((error) => reject(error));
    });
    if (response && response.data) {
      return handleErrCode(response.data);
    }
    return null;
  },

  createNewEventFile: async (record) => {
    const response = await new Promise((resolve, reject) => {
      controllerApi.axiosIns
        .post(EVENT_FILE_ENDPOINT, record)
        .then((response) => resolve(response))
        .catch((error) => reject(error));
    });
    if (response && response.data) {
      return handleErrCode(response.data);
    }
    return null;
  },

  updateEventFile: async (record, uuid) => {
    const response = await new Promise((resolve, reject) => {
      controllerApi.axiosIns
        .put(`${EVENT_FILE_ENDPOINT}/${uuid}`, record)
        .then((response) => resolve(response))
        .catch((error) => reject(error));
    });
    if (response && response.data) {
      return handleErrCode(response.data);
    }
    return null;
  },

  updateFile: async (record, uuid) => {
    const response = await new Promise((resolve, reject) => {
      controllerApi.axiosIns
        .put(`${FILE_ENDPOINT}/${uuid}`, record)
        .then((response) => resolve(response))
        .catch((error) => reject(error));
    });
    if (response && response.data) {
      return handleErrCode(response.data);
    }
    return null;
  },

  deleteEventFile: async (uuid) => {
    try {
      const response = await new Promise((resolve, reject) => {
        controllerApi.axiosIns
          .delete(`${EVENT_FILE_ENDPOINT}/${uuid}`)
          .then((response) => resolve(response))
          .catch((error) => reject(error));
      });
      if (response && response.data) {
        return handleErrCode(response.data);
      }
    } catch (e) {
      if (language == "vn") {
        Notification({
          type: NOTYFY_TYPE.warning,
          title: "Tệp lưu trữ",
          description: e.toString(),
        });
      } else {
        Notification({
          type: NOTYFY_TYPE.warning,
          title: "Archived file",
          description: e.toString(),
        });
      }
      return null;
    }
    return null;
  },

  deleteFile: async (uuid) => {
    try {
      const response = await new Promise((resolve, reject) => {
        controllerApi.axiosIns
          .delete(`${FILE_ENDPOINT}/${uuid}`)
          .then((response) => resolve(response))
          .catch((error) => reject(error));
      });
      if (response && response.data) {
        return handleErrCode(response.data);
      }
    } catch (e) {
      if (language == "vn") {
        Notification({
          type: NOTYFY_TYPE.warning,
          title: "Tệp lưu trữ",
          description: e.toString(),
        });
      } else {
        Notification({
          type: NOTYFY_TYPE.warning,
          title: "Archived file",
          description: e.toString(),
        });
      }
      return null;
    }
    return null;
  },

  deletePhysicalFile: async (uuid) => {
    try {
      const request = { listUuid: [uuid] };
      const response = await new Promise((resolve, reject) => {
        controllerApi.axiosIns
          .post(MONITOR_CONTROLLER_ENDPOINT + "/file/delete-file", request)
          .then((response) => resolve(response))
          .catch((error) => reject(error));
      });
      if (response && response.data) {
        return handleErrCode(response.data);
      }
    } catch (e) {
      if (language == "vn") {
        Notification({
          type: NOTYFY_TYPE.warning,
          title: "Tệp lưu trữ",
          description: e.toString(),
        });
      } else {
        Notification({
          type: NOTYFY_TYPE.warning,
          title: "Archived file",
          description: e.toString(),
        });
      }
      return null;
    }
    return null;
  },
};

export default ExportEventFileApi;
