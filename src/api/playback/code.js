import Notification from "../../components/vms/notification/Notification";
import {handleForbiddenCode} from "../authz/forbidden";
import { reactLocalStorage } from "reactjs-localstorage";

const language = reactLocalStorage.get("language");

const KPlaybackSuccess = 1400;
const KPlaybackBadRequest = 1401;
const KPlaybackExistToken = 1405;
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
    case KPlaybackSuccess:
      return payload;
    case KPlaybackBadRequest:
      if (language == "vn") {
        errCode.description = "Yêu cầu không hợp lệ";
      } else {
        errCode.description = "Bad request";
      }
      Notification(errCode);
      return null;
    case KPlaybackExistToken:
      if (language == "vn") {
        errCode.description = "Token không hợp lệ";
      } else {
        errCode.description = "Token is not valid";
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
