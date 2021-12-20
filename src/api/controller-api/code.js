import { isEmpty } from "lodash";
import Notification from "../../components/vms/notification/Notification";
import { handleForbiddenCode } from "../authz/forbidden";

import { reactLocalStorage } from "reactjs-localstorage";

const language = reactLocalStorage.get("language");

export const KControllerOk = 700;
const KControllerBadRequest = 701;
const KControllerForbidden = 702;
const KControllerNotFound = 703;
const KControllerDuplicate = 704;
const KControllerCannotDelete = 705;
const KControllerInternalServerError = 706;
const KMonitorControllerOk = 800;
const StatusBadRequest = 601;
const StatusUnauthorized = 602;
const StatusNotFound = 603;
const StatusConflict = 604;
const StatusForbidden = 605;
const StatusInternalServerError = 606;

//USER-->controller-->authz

export const handleErrCode = (data,type) => {
  if (isEmpty(data)) {
    let errCode = {};
    if (language == "vn") {
      errCode = {
        type: "error",
        title: "Mã lỗi: Không xác định",
        description: "Không xác định",
      };
    } else {
      errCode = {
        type: "error",
        title: "Code: Unknown",
        description: "Unknown",
      };
    }

    Notification(errCode);
    return null;
  }
  // const { code, message, payload } = data;
  const { code, message, payload, deny_permission_codes } = data;
  let errCode = {};
  if (language == "vn") {
    errCode = {
      type: "error",
      title: "Mã lỗi: " + code,
      description: "",
    };
  } else {
    errCode = {
      type: "error",
      title: "Code: " + code,
      description: "",
    };
  }
  switch (+code) {
    case KMonitorControllerOk:
      return data;
    case KControllerOk:
      return data;
    case KControllerBadRequest:
      errCode.description = message;
      Notification(errCode);
      return null;
    case KControllerForbidden:
      errCode.description = message;
      Notification(errCode);
      return null;
    case KControllerNotFound:
      errCode.description = message;
      Notification(errCode);
      return null;
    case KControllerDuplicate:
      errCode.description =
        "Dữ liệu bạn nhập đã tồn tại hoặc không hợp lệ, vui lòng kiểm tra lại";
      Notification(errCode);
      return null;
    case KControllerCannotDelete:
      errCode.description =
        "Lĩnh vực đã được gán sự kiện. Xóa không thành công";
      Notification(errCode);
      return null;
    case KControllerInternalServerError:
      errCode.description = message;
      Notification(errCode);
      return null;
    case StatusBadRequest:
      if (language == "vn") {
        errCode.description = "Yêu cầu không hợp lệ";
      } else {
        errCode.description = "Bad request";
      }
      Notification(errCode);
      return null;
    case StatusInternalServerError:
      if (language == "vn") {
        errCode.description = "Lỗi máy chủ nội bộ";
      } else {
        errCode.description = "Internal server error";
      }
      Notification(errCode);
      return null;
    case StatusUnauthorized:
      if (language == "vn") {
        errCode.description = "Không được phép truy cập";
      } else {
        errCode.description = "Unauthorized";
      }
      Notification(errCode);
      return null;
    case StatusNotFound:
      if (language == "vn") {
        errCode.description = "Không tìm thấy";
      } else {
        errCode.description = "Not found";
      }
      Notification(errCode);
      return null;
    case StatusConflict:
      if (language == "vn") {
        errCode.description = "Yêu cầu không hợp lệ";
      } else {
        errCode.description = "Conflict";
      }
      Notification(errCode);
      return null;
    case StatusForbidden:
      if (type == 'noMessage') {
        return;
      } else {
        handleForbiddenCode(deny_permission_codes);
        return null;
      }
    default:
      if (language == "vn") {
        errCode.description = "Không xác định";
      } else {
        errCode.description = "Unknown";
      }
      Notification(errCode);
      return null;
  }
};
