import { isEmpty } from "lodash";
import Notification from "../../components/vms/notification/Notification";
import { handleForbiddenCode } from "../authz/forbidden";

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

export const handleErrCode = (data) => {
  if (isEmpty(data)) {
    const errCode = {
      type: "error",
      title: "Code: Unknown",
      description: "Unknown",
    };
    Notification(errCode);
    return null;
  }
  // const { code, message, payload } = data;
  const { code, message, payload, deny_permission_codes } = data;
  const errCode = {
    type: "error",
    title: "Code:" + code,
    description: "",
  };
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
      errCode.description = message;
      Notification(errCode);
      return null;
    case KControllerCannotDelete:
      errCode.description = message;
      Notification(errCode);
      return null;
    case KControllerInternalServerError:
      errCode.description = message;
      Notification(errCode);
      return null;
    case StatusBadRequest:
      errCode.description = "Bad request";
      Notification(errCode);
      return null;
    case StatusInternalServerError:
      errCode.description = "Internal server error";
      Notification(errCode);
      return null;
    case StatusUnauthorized:
      errCode.description = "Unauthorized";
      Notification(errCode);
      return null;
    case StatusNotFound:
      errCode.description = "Not found";
      Notification(errCode);
      return null;
    case StatusConflict:
      errCode.description = "Conflict";
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
