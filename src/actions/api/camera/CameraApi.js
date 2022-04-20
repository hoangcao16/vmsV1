import { reactLocalStorage } from "reactjs-localstorage";
import {
  handleErrCodeAuthZ,
  handleErrCodeReport,
  responseCheckerErrorsController,
} from "../../function/MyUltil/ResponseChecker";
import MyService from "../service";
import Notification from "./../../../components/vms/notification/Notification";
const CameraApi = {
  getAllCamera: async (dataSearch) => {
    let result;

    try {
      result = await MyService.getRequestData(
        `/cctv-controller-svc/api/v1/cameras`,
        dataSearch
      );
    } catch (error) {
      console.log(error);
    }
    if (responseCheckerErrorsController(result) === null) {
      return [];
    }
    return result.payload;
  },
  getCameraByTagName: async (dataSearch) => {
    let result;

    try {
      result = await MyService.postRequestData(
        `/cctv-controller-svc/api/v1/cameras/find_by_tags`,
        dataSearch
      );
    } catch (error) {
      console.log(error);
    }
    if (responseCheckerErrorsController(result) === null) {
      return [];
    }
    return result.payload;
  },
  getAllCameraWithTotal: async (dataSearch) => {
    let result;

    try {
      result = await MyService.getRequestData(
        `/cctv-controller-svc/api/v1/cameras`,
        dataSearch
      );
    } catch (error) {
      console.log(error);
    }
    if (responseCheckerErrorsController(result) === null) {
      return [];
    }
    return result;
  },

  getReportCamera: async () => {
    let result;

    try {
      result = await MyService.getRequestData("/owl/api/v1/get-report-camera");
    } catch (error) {
      console.log(JSON.stringify(error));
    }
    if (result === undefined || handleErrCodeReport(result) === null) {
      return [];
    }

    return result.payload;
  },

  getAllCameraWidthTotal: async (dataSearch) => {
    let result;
    try {
      result = await MyService.getRequestData(
        `/cctv-controller-svc/api/v1/cameras`,
        dataSearch
      );
    } catch (error) {
      console.log(error);
    }
    if (responseCheckerErrorsController(result) === null) {
      return [];
    }
    return result;
  },

  getAllGroupCamera: async (dataInput) => {
    const data = {
      ...dataInput,

      parent: dataInput?.parent === undefined ? "" : dataInput?.parent,
      page: 0,
      size: 10000,
    };
    let result;

    try {
      result = await MyService.getRequestData(
        `/cctv-controller-svc/api/v1/camera_groups`,
        data
      );
    } catch (error) {
      console.log(error);
    }
    if ((responseCheckerErrorsController(result) === null) === null) {
      return [];
    }

    return result?.payload;
  },

  getGroupCameraById: async (camGroupUuid) => {
    let result;

    try {
      result = await MyService.getRequestData(
        `/cctv-controller-svc/api/v1/camera_groups/${camGroupUuid}`
      );
    } catch (error) {
      console.log(error);
    }
    if (responseCheckerErrorsController(result) === null) {
      return [];
    }

    return result.payload;
  },

  updateCameraGroup: async (camGroupUuid, cameraGroupPayload) => {
    let result;

    try {
      result = await MyService.putRequestData(
        `/cctv-controller-svc/api/v1/camera_groups/${camGroupUuid}`,
        cameraGroupPayload
      );
    } catch (error) {
      console.log(error);
    }

    if (responseCheckerErrorsController(result) === null) {
      return false;
    }
    return true;
  },

  getCameraByUuid: async (uuid) => {
    let result;

    try {
      result = await MyService.getRequestData(
        `/cctv-controller-svc/api/v1/cameras/${uuid}`
      );
    } catch (error) {
      console.log(error);
    }
    if (responseCheckerErrorsController(result) === null) {
      return [];
    }
    return result.payload;
  },

  getAllCameraTypes: async (data) => {
    let result;

    try {
      result = await MyService.getRequestData(
        `/cctv-controller-svc/api/v1/camera_types?name=${data?.name}${
          data?.size ? `&size=${data?.size}` : ""
        }`
      );
    } catch (error) {
      console.log(error);
    }

    if (responseCheckerErrorsController(result) === null) {
      return [];
    }
    return result.payload;
  },

  getCameraTypesByUuid: async (uuid) => {
    let result;

    try {
      result = await MyService.getRequestData(
        `/cctv-controller-svc/api/v1/camera_types/${uuid}`
      );
    } catch (error) {
      console.log(error);
    }

    if (responseCheckerErrorsController(result) === null) {
      return [];
    }
    return result.payload;
  },

  editCameraTypesByUuid: async (uuid, cameraTypePayload) => {
    let result;

    try {
      result = await MyService.putRequestData(
        `/cctv-controller-svc/api/v1/camera_types/${uuid}`,
        cameraTypePayload
      );
    } catch (error) {
      console.log(error);
    }

    if (responseCheckerErrorsController(result) === null) {
      return false;
    }
    return true;
  },

  delete: async (uuid) => {
    let result;
    try {
      result = await MyService.deleteRequestData(
        `/cctv-controller-svc/api/v1/cameras/${uuid}`
      );
    } catch (error) {
      console.log(error);
    }

    if (responseCheckerErrorsController(result) === null) {
      return false;
    }
    return true;
  },
  deleteCameraType: async (uuid) => {
    let result;
    try {
      result = await MyService.deleteRequestData(
        `/cctv-controller-svc/api/v1/camera_types/${uuid}`
      );
    } catch (error) {
      console.log(error);
    }

    if (responseCheckerErrorsController(result) === null) {
      return false;
    }
    return true;
  },

  deleteCameraGroup: async (uuid) => {
    let result;
    try {
      result = await MyService.deleteRequestData(
        `/cctv-controller-svc/api/v1/camera_groups/${uuid}`
      );
    } catch (error) {
      console.log(error);
    }

    if (responseCheckerErrorsController(result) === null) {
      return false;
    }
    return true;
  },

  addCamera: async (cameraPayload) => {
    let result;

    try {
      result = await MyService.postRequestData(
        "/cctv-controller-svc/api/v1/cameras",
        cameraPayload
      );
    } catch (error) {
      console.log(error);
    }
    if (responseCheckerErrorsController(result) === null) {
      return false;
    }
    return true;
  },
  addCameraGroup: async (cameraGroupPayload) => {
    let result;

    try {
      result = await MyService.postRequestData(
        "/cctv-controller-svc/api/v1/camera_groups",
        cameraGroupPayload
      );
    } catch (error) {
      console.log(error);
    }
    if (responseCheckerErrorsController(result) === null) {
      return false;
    }
    return true;
  },

  addCamerasGroupForUser: async (data) => {
    let result;

    try {
      result = await MyService.postRequestData(
        "/authz/api/v0/groups/set",
        data
      );
    } catch (error) {
      console.log(error);
    }
    if (handleErrCodeAuthZ(result) === null) {
      return false;
    }
    return true;
  },
  addCameraType: async (cameraTypePayload) => {
    let result;

    try {
      result = await MyService.postRequestData(
        "/cctv-controller-svc/api/v1/camera_types",
        cameraTypePayload
      );
    } catch (error) {
      console.log(error);
    }

    if (responseCheckerErrorsController(result) === null) {
      return false;
    }
    return true;
  },

  setPermisionCamGroup: async (data) => {
    let result;

    try {
      result = await MyService.postRequestData(
        "/authz/api/v0/authorization/add_permission",
        data
      );
    } catch (error) {
      console.log(error);
    }
    if (handleErrCodeAuthZ(result) === null) {
      return false;
    }
    return true;
  },
  removePermisionCamGroup: async (data) => {
    let result;

    try {
      result = await MyService.postRequestData(
        "/authz/api/v0/authorization/remove_permission",
        data
      );
    } catch (error) {
      console.log(error);
    }
    if (handleErrCodeAuthZ(result) === null) {
      return false;
    }

    return true;
  },
  addMultilPermission: async (data) => {
    let result;

    try {
      result = await MyService.postRequestData(
        "/authz/api/v0/authorization/add_multi_permission",
        data
      );
    } catch (error) {
      console.log(error);
    }
    if (handleErrCodeAuthZ(result) === null) {
      return false;
    }

    return true;
  },

  editCamera: async (cameraId, cameraPayload) => {
    let result;

    try {
      result = await MyService.putRequestData(
        `/cctv-controller-svc/api/v1/cameras/${cameraId}`,
        cameraPayload
      );
    } catch (error) {
      console.log(error);
    }

    if (responseCheckerErrorsController(result) === null) {
      return false;
    }
    const language = reactLocalStorage.get("language");
    let notifyMess = {};
    if (language == "vn") {
      notifyMess = {
        type: "success",
        title: "",
        description: "Sửa Camera thành công",
      };
    } else {
      notifyMess = {
        type: "success",
        title: "",
        description: "Successfully edit Camera",
      };
    }
    Notification(notifyMess);
    return true;
  },

  getExportData: async (body) => {
    let result;
    try {
      result = await MyService.postRequestDataBlob(
        "/owl/api/v1/report-camera",
        body
      );
    } catch (error) {
      console.log(error);
    }
    return result;
  },
};

export default CameraApi;
