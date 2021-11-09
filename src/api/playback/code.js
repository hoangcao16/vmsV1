import Notification from "../../components/vms/notification/Notification";
import {handleForbiddenCode} from "../authz/forbidden";

const KPlaybackSuccess = 1400;
const KPlaybackBadRequest = 1401;
const KPlaybackExistToken = 1405;
const StatusForbidden = 605;

export const handleErrCode = ({ code, message, payload, deny_permission_codes }) => {
  const errCode = {
    type: "error",
    title: "Code:" + code,
    description: "",
  };
  switch (code) {
    case KPlaybackSuccess:
      return payload;
    case KPlaybackBadRequest:
      errCode.description = "Bad request";
      Notification(errCode);
      return null;
    case KPlaybackExistToken:
      errCode.description = "Token is not valid";
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
