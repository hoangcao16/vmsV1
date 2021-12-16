import Notification from '../../components/vms/notification/Notification';
import { handleForbiddenCode } from "./forbidden";
import { reactLocalStorage } from "reactjs-localstorage";

const language = reactLocalStorage.get('language')

const StatusOK = 600;
const StatusCreated = 600;
const StatusBadRequest = 601;
const StatusUnauthorized = 602;
const StatusNotFound = 603;
const StatusConflict = 604;
const StatusForbidden = 605;
const StatusInternalServerError = 606;
const WrongPass = 607;
const AccountNotExists = 608;
const AccountAlreadyExists = 609;
// const AccountNotActive = 2;
// WrongPass=607
// AccountNotExists=608
// AccountAlreadyExists=609
// AccountNotActive=609

export const handleErrCode = ({ code, message, payload, deny_permission_codes }) => {
  let errCode = {};
  if (language == 'vn') {
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
    case StatusOK:
      return payload != null ? payload : [];
    case StatusCreated:
      return payload != null ? payload : [];
    case StatusBadRequest:
      if (language == 'vn') {
        errCode.description = "Đăng nhập không thành công. Vui lòng kiểm tra lại Tài khoản hoặc Mật khẩu";
      } else {
        errCode.description = "Login failed. Please recheck your account or password";
      }
      Notification(errCode);
      return null;
    case StatusInternalServerError:
      if (language == 'vn') {
        errCode.description = "Lỗi máy chủ nội bộ";
      } else {
        errCode.description = "Internal server error";
      }
      Notification(errCode);
      return null;
    case StatusUnauthorized:
      if (language == 'vn') {
        errCode.description = "Không được phép truy cập";
      } else {
        errCode.description = "Unauthorized";
      }
      Notification(errCode);
      return null;
    case StatusNotFound:
      if (language == 'vn') {
        errCode.description = "Không tìm thấy";
      } else {
        errCode.description = "Not found";
      }
      Notification(errCode);
      return null;
    case StatusConflict:
      if (language == 'vn') {
        errCode.description = "Yêu cầu không hợp lệ";
      } else {
        errCode.description = "Conflict";
      }
      Notification(errCode);
      return null;
    case StatusForbidden:
      handleForbiddenCode(deny_permission_codes);
      return null;
    case WrongPass:
      if (language == 'vn') {
        errCode.description = "Vui lòng kiểm tra lại Mật khẩu";
      } else {
        errCode.description = "Please recheck your password";
      }
      Notification(errCode);
      return null;
    case AccountNotExists:
      if (language == 'vn') {
        errCode.description = "Email không tồn tại trong hệ thống";
      } else {
        errCode.description = "Email does't exist in the system database";
      }
      Notification(errCode);
      return null;
    case AccountAlreadyExists:
      if (language == 'vn') {
        errCode.description = "Email đã tồn tại trong hệ thống";
      } else {
        errCode.description = "Email already exist in the system database";
      }
      Notification(errCode);
      return null;
    default:
      if (language == 'vn') {
        errCode.description = "Không xác định";
      } else {
        errCode.description = "Unknown";
      }
      Notification(errCode);
      return null;
  }
};
