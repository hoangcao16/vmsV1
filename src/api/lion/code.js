import Notification from "../../components/vms/notification/Notification";
import {handleForbiddenCode} from "../authz/forbidden";

const KLionSuccess = 1100;
const KLionBadRequest = 1101;
const KLionPlaybackNotFound = 1102;
const KLionSendReqFailed = 1103;
const KLionInternalServerError = 1104;
const KLionInternalFileNotFound = 1105;
const StatusForbidden = 605;

export const handleErrCode = ({ code, message, payload, deny_permission_codes }) => {
  const errCode = {
    type: "error",
    title: "Code:" + code,
    description: "",
  };
  switch (code) {
    case KLionSuccess:
      return payload;
    case KLionBadRequest:
      errCode.description = "Bad request";
      Notification(errCode);
      return null;
    case KLionPlaybackNotFound:
      errCode.description = "Playback not found";
      Notification(errCode);
      return null;
    case KLionSendReqFailed:
      errCode.description = "Send request fail";
      Notification(errCode);
      return null;
    case KLionInternalServerError:
      errCode.description = "Internal server error";
      Notification(errCode);
      return null;
    case KLionInternalFileNotFound:
      errCode.description = "Could not find any mp4 file";
      Notification(errCode);
      return null;
    case StatusForbidden:
      handleForbiddenCode(deny_permission_codes);
      return null;
    default:
      errCode.description = "Unknown";
      Notification(errCode);
      return null;
  }
};
