import { reactLocalStorage } from "reactjs-localstorage";
import Notification from "../../components/vms/notification/Notification";
import { NOTYFY_TYPE } from "../../view/common/vms/Constant";
import { handleForbiddenCode } from "../authz/forbidden";

const KCheetahSuccess = 900;
const KCheetahBadRequest = 901;
const KCheetahNvrNotFound = 902;
const KCheetahSendReqFailed = 903;
const KCheetahInternalServerError = 904;
const StatusForbidden = 605;

const language = reactLocalStorage.get("language");

export const handleErrCode = (data) => {
  const { code, message, deny_permission_codes } = data;
  switch (code) {
    case KCheetahSuccess:
      return data;
    case KCheetahBadRequest:
      if (language === "vn") {
        Notification({
          type: NOTYFY_TYPE.warning,
          title: code.toString(),
          description: "Không thể ghi hình Camera này",
        });
      } else {
        Notification({
          type: NOTYFY_TYPE.warning,
          title: code.toString(),
          description: "Could not find Camera to capture",
        });
      }
      return null;
    case KCheetahNvrNotFound:
      if (language === "vn") {
        Notification({
          type: NOTYFY_TYPE.warning,
          title: code.toString(),
          description: "Không tìm thấy địa chỉ NVR",
        });
      } else {
        Notification({
          type: NOTYFY_TYPE.warning,
          title: code.toString(),
          description: "Could not get NVR address",
        });
      }
      return null;
    case KCheetahSendReqFailed:
      if (language === "vn") {
        Notification({
          type: NOTYFY_TYPE.warning,
          title: code.toString(),
          description: "Xảy ra lỗi khi gửi yêu cầu tới NVR",
        });
      } else {
        Notification({
          type: NOTYFY_TYPE.warning,
          title: code.toString(),
          description: "Send request to NVR failed",
        });
      }
      return null;
    case KCheetahInternalServerError:
      if (language === "vn") {
        Notification({
          type: NOTYFY_TYPE.warning,
          title: code.toString(),
          description: "Xảy ra lỗi từ máy chủ",
        });
      } else {
        Notification({
          type: NOTYFY_TYPE.warning,
          title: code.toString(),
          description: "Got an internal error from server",
        });
      }
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
