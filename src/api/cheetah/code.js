import { reactLocalStorage } from "reactjs-localstorage";
import Notification from "../../components/vms/notification/Notification";
import { NOTYFY_TYPE } from "../../view/common/vms/Constant";
import { handleForbiddenCode } from "../authz/forbidden";

const KCheetahSuccess = 900;
const KCheetahBadRequest = 901;
const KCheetahInternalServerError = 904;
const KCheetahSendReqFailed = 903;
const KCheetahNvrNotFound = 902;
const StatusForbidden = 605;

const language = reactLocalStorage.get("language");

export const handleErrCode = (data) => {
  const { code, message, deny_permission_codes } = data;
  switch (code) {
    case KCheetahSuccess:
      return data;
    case KCheetahBadRequest:
      // Notification({
      //     type: NOTYFY_TYPE.warning,
      //     title: code.toString(),
      //     description: message
      // });
      // return null

      if (language === "vn") {
        Notification({
          type: NOTYFY_TYPE.warning,
          title: code.toString(),
          description: "Không thể ghi hình camera này",
        });
      } else {
        Notification({
          type: NOTYFY_TYPE.warning,
          title: code.toString(),
          description: "Could not find camera to capture",
        });
      }

      return null;

    case KCheetahInternalServerError:
      Notification({
        type: NOTYFY_TYPE.warning,
        title: code.toString(),
        description: message,
      });
      return null;
    case KCheetahSendReqFailed:
      Notification({
        type: NOTYFY_TYPE.warning,
        title: code.toString(),
        description: message,
      });
      return null;
    case KCheetahNvrNotFound:
      Notification({
        type: NOTYFY_TYPE.warning,
        title: code.toString(),
        description: message,
      });
      return null;
    case StatusForbidden:
      handleForbiddenCode(deny_permission_codes);
      return null;
    default:
      Notification({
        type: NOTYFY_TYPE.warning,
        title: code.toString(),
        description: message,
      });
      return null;
  }
};
