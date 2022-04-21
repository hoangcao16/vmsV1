import { isEmpty } from "lodash";
import { handleErrCode } from "../../../api/controller-api/code";
import Notification from "../../../components/vms/notification/Notification";
import { handleForbiddenCode } from "../../../api/authz/forbidden";
import { reactLocalStorage } from "reactjs-localstorage";

const language = reactLocalStorage.get("language");

export function responseCheckerErrorsController(result, type) {
  return handleErrCode(result, type);
}

export function responseCheckerErrors(result) {
  if (result === undefined || result === null) {
    return true;
  }
  return false;
}

const AuthZStatusOK = 600;
const AuthZStatusCreated = 600;
const AuthZStatusBadRequest = 601;
const AuthZStatusUnauthorized = 602;
const AuthZStatusNotFound = 603;
const AuthZStatusConflict = 604;
const AuthZStatusForbidden = 605;
const AuthZStatusInternalServerError = 606;
const AuthZWrongPass = 607;
const AuthZAccountNotExists = 608;
const AuthZAccountAlreadyExists = 609;

export const handleErrCodeAuthZ = (data) => {
  const { code, message, deny_permission_codes, error } = data || {};
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
    case AuthZStatusOK:
      return data;
    case AuthZStatusCreated:
      return data;

    case AuthZStatusBadRequest:
      if (language == "vn") {
        errCode.description = "Vui lòng kiểm tra lại Tài khoản hoặc Mật khẩu";
      } else {
        errCode.description = "Please recheck your account or password";
      }
      Notification(errCode);
      return null;

    case AuthZStatusUnauthorized:
      if (language == "vn") {
        errCode.description = "Vui lòng kiểm tra lại Tài khoản hoặc Mật khẩu";
      } else {
        errCode.description = "Please recheck your account or password";
      }
      Notification(errCode);
      return null;
    case AuthZStatusNotFound:
      if (language == "vn") {
        errCode.description = "Vui lòng kiểm tra lại Tài khoản hoặc Mật khẩu";
      } else {
        errCode.description = "Please recheck your account or password";
      }
      Notification(errCode);
      return null;
    case AuthZStatusConflict:
      if (language == "vn") {
        const groupname = message.substring(
          message.indexOf("name ") + 5,
          message.indexOf(" already exists")
        );
        const fieldname =
          message.substring(0, message.indexOf(" with name")) === "Role"
            ? "Vai trò"
            : "Nhóm";
        errCode.description =
          fieldname + " có tên " + groupname + " đã tồn tại";
      } else {
        errCode.description = message;
      }
      Notification(errCode);
      return null;
    case AuthZStatusForbidden:
      handleForbiddenCode(deny_permission_codes, error);
      return null;
    case AuthZStatusInternalServerError:
      errCode.description = message;
      Notification(errCode);
      return null;
    case AuthZWrongPass:
      if (language == "vn") {
        errCode.description = "Vui lòng kiểm tra lại Mật khẩu";
      } else {
        errCode.description = "Please recheck your password";
      }
      Notification(errCode);
      return null;
    case AuthZAccountNotExists:
      if (language == "vn") {
        errCode.description = "Email không tồn tại trong hệ thống";
      } else {
        errCode.description = "Email does't exist in the system database";
      }
      Notification(errCode);
      return null;
    case AuthZAccountAlreadyExists:
      if (language == "vn") {
        errCode.description = "Email đã tồn tại trong hệ thống";
      } else {
        errCode.description = "Email already exist in the system database";
      }
      Notification(errCode);
      return null;
    default:
      if (language == "vn") {
        errCode.description = "Server không phản hồi";
      } else {
        errCode.description = "Server not responding";
      }
      Notification(errCode);
      return null;
  }
};

const OKE = 800;
const BAD_REQUEST = 801;
const NOT_FOUND = 804;
const CONFLICT = 809;
const UNAUTHORIZED = 802;
const MISS_HEAR_DER = 805;
const FORBIDDEN = 803;
const INTERNAL_SERVER_ERROR = 806;
const DISK_AGENT_CLIENT_NOT_EXIST = 807;
const TIME_OUT = 810;

export const handleErrCodeMonitorCtrl = (data) => {
  if (isEmpty(data)) {
    let errCode = {};
    if (language == "vn") {
      errCode = {
        type: "error",
        title: "Mã lỗi: Không xác định",
        description: "Không có dữ liệu",
      };
    } else {
      errCode = {
        type: "error",
        title: "Code: Unknown",
        description: "No data",
      };
    }
    Notification(errCode);
    return null;
  }
  const { code, message, deny_permission_codes } = data;
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
    case OKE:
      return data;
    case BAD_REQUEST:
      errCode.description = message;
      Notification(errCode);
      return null;
    case NOT_FOUND:
      errCode.description = message;
      Notification(errCode);
      return null;
    case CONFLICT:
      errCode.description = message;
      Notification(errCode);
      return null;
    case UNAUTHORIZED:
      errCode.description = message;
      Notification(errCode);
      return null;
    case MISS_HEAR_DER:
      errCode.description = message;
      Notification(errCode);
      return null;
    case FORBIDDEN:
      errCode.description = message;
      Notification(errCode);
      return null;
    case INTERNAL_SERVER_ERROR:
      errCode.description = message;
      Notification(errCode);
      return null;
    case DISK_AGENT_CLIENT_NOT_EXIST:
      errCode.description = message;
      Notification(errCode);
      return null;
    case TIME_OUT:
      errCode.description = message;
      Notification(errCode);
      return null;

    case AuthZStatusForbidden:
      handleForbiddenCode(deny_permission_codes);
      return null;

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

const REPORT_OKE = 1300;
const REPORT_BAD_REQUEST = 1301;

export const handleErrCodeReport = (data) => {
  if (!data) {
    let errCode = {};
    if (language == "vn") {
      errCode = {
        type: "error",
        title: "Mã lỗi: Không xác định",
        description: "Không có dữ liệu",
      };
    } else {
      errCode = {
        type: "error",
        title: "Code: Unknown",
        description: "No data",
      };
    }
    Notification(errCode);
    return null;
  }
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
    case REPORT_OKE:
      return data;
    case REPORT_BAD_REQUEST:
      errCode.description = message;
      Notification(errCode);
      return null;
    case AuthZStatusForbidden:
      handleForbiddenCode(deny_permission_codes);
      return null;
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

const AI_OKE = 1700;
const AI_BAD_REQUEST = 1701;
const AI_FORBIDDEN = 1702;
const AI_NOT_FOUND = 1703;
const AI_DUPLICATE_ENTITY = 1704;
const AI_CANNOT_DELETE_ENTITY = 1705;
const AI_INTERNAL_SERVER_ERROR = 1706;

export const handleErrCodeAI = (data) => {
  if (isEmpty(data)) {
    let errCode = {};
    if (language == "vn") {
      errCode = {
        type: "error",
        title: "Mã lỗi: Không xác định",
        description: "Không có dữ liệu",
      };
    } else {
      errCode = {
        type: "error",
        title: "Code: Unknown",
        description: "No data",
      };
    }
    Notification(errCode);
    return null;
  }
  const { code, message, payload } = data;
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
    case AI_OKE:
      return data;
    case AI_BAD_REQUEST:
      errCode.description = message;
      Notification(errCode);
      return null;
    case AI_NOT_FOUND:
      errCode.description = `${
        language === "vn" ? "Config không tồn tại" : "Config does not exist"
      }`;
      Notification(errCode);
      return null;
    case AI_CANNOT_DELETE_ENTITY:
      errCode.description = message;
      Notification(errCode);
      return null;
    case AI_DUPLICATE_ENTITY:
      errCode.description = `${
        language === "vn"
          ? "Đã có mã nhân viên trong hệ thống"
          : "Duplicate code"
      }`;
      Notification(errCode);
      return null;
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
