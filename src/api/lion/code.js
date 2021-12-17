import Notification from "../../components/vms/notification/Notification";
import {handleForbiddenCode} from "../authz/forbidden";
import { reactLocalStorage } from "reactjs-localstorage";

const language = reactLocalStorage.get("language");

const KLionSuccess = 1100;
const KLionBadRequest = 1101;
const KLionPlaybackNotFound = 1102;
const KLionSendReqFailed = 1103;
const KLionInternalServerError = 1104;
const KLionInternalFileNotFound = 1105;
const StatusForbidden = 605;

export const handleErrCode = ({ code, message, payload, deny_permission_codes }) => {
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
  switch (code) {
    case KLionSuccess:
      return payload;
    case KLionBadRequest:
      if (language == "vn") {
        errCode.description = "Yêu cầu không hợp lệ";
      } else {
        errCode.description = "Bad request";
      }
      Notification(errCode);
      return null;
    case KLionPlaybackNotFound:
      if (language == "vn") {
        errCode.description = "Không tìm thấy Playback";
      } else {
        errCode.description = "Playback not found";
      }
      Notification(errCode);
      return null;
    case KLionSendReqFailed:
      if (language == "vn") {
        errCode.description = "Gửi yêu cầu thất bại";
      } else {
        errCode.description = "Send request fail";
      }
      Notification(errCode);
      return null;
    case KLionInternalServerError:
      if (language == "vn") {
        errCode.description = "Lỗi máy chủ nội bộ";
      } else {
        errCode.description = "Internal server error";
      }
      Notification(errCode);
      return null;
    case KLionInternalFileNotFound:
      if (language == "vn") {
        errCode.description = "Không tìm thấy tệp mp4 nào";
      } else {
        errCode.description = "Could not find any mp4 file";
      }
      Notification(errCode);
      return null;
    case StatusForbidden:
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
