import Notification from '../../components/vms/notification/Notification';
import { handleForbiddenCode } from "./forbidden";

const StatusOK = 600;
const StatusCreated = 600;
const StatusBadRequest = 601;
const StatusUnauthorized = 602;
const StatusNotFound = 603;
const StatusConflict = 604;
const StatusForbidden = 605;
const StatusInternalServerError = 606;

export const handleErrCode = ({ code, message, payload, deny_permission_codes }) => {
  const errCode = {
    type: 'error',
    title: 'Code:' + code,
    description: ''
  };
  switch (+code) {
    case StatusOK:
      return payload != null ? payload : [];
    case StatusCreated:
      return payload != null ? payload : [];
    case StatusBadRequest:
      errCode.description = 'Đăng nhập không thành công. Vui lòng kiểm tra lại Tài khoản hoặc Mật khẩu';
      Notification(errCode);
      return null;
    case StatusInternalServerError:
      errCode.description = 'Internal server error';
      Notification(errCode);
      return null;
    case StatusUnauthorized:
      errCode.description = 'Unauthorized';
      Notification(errCode);
      return null;
    case StatusNotFound:
      errCode.description = 'Not found';
      Notification(errCode);
      return null;
    case StatusConflict:
      errCode.description = 'Conflict';
      Notification(errCode);
      return null;
    case StatusForbidden:
      handleForbiddenCode(deny_permission_codes);
      return null;
    default:
      errCode.description = 'Unknown';
      Notification(errCode);
      return null;
  }
};
