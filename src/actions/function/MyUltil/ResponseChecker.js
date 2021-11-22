import { isEmpty } from 'lodash';
import { handleErrCode } from '../../../api/controller-api/code';
import Notification from '../../../components/vms/notification/Notification';
import { handleForbiddenCode } from "../../../api/authz/forbidden";

export function responseCheckerErrorsController(result) {
  return handleErrCode(result);
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

export const handleErrCodeAuthZ = (data) => {
  const { code, message, deny_permission_codes } = data || {};
  const errCode = {
    type: 'error',
    title: 'Code:' + code,
    description: ''
  };
  switch (+code) {
    case AuthZStatusOK:
      return data;
    case AuthZStatusCreated:
      return data;

    case AuthZStatusBadRequest:
      errCode.description = "Đăng nhập không thành công. Vui lòng kiểm tra lại Tài khoản hoặc Mật khẩu";
      Notification(errCode);
      return null;

    case AuthZStatusUnauthorized:
      errCode.description = message;
      Notification(errCode);
      return null;
    case AuthZStatusNotFound:
      errCode.description = message;
      Notification(errCode);
      return null;
    case AuthZStatusConflict:
      errCode.description = message;
      Notification(errCode);
      return null;
    case AuthZStatusForbidden:
      handleForbiddenCode(deny_permission_codes);
      return null;
    case AuthZStatusInternalServerError:
      errCode.description = message;
      Notification(errCode);
      return null;

    default:
      errCode.description = 'Unknown';
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
    const errCode = {
      type: 'error',
      title: 'Code: Unknown',
      description: 'No data'
    };
    Notification(errCode);
    return null;
  }
  const { code, message, deny_permission_codes } = data;
  const errCode = {
    type: 'error',
    title: 'Code:' + code,
    description: ''
  };

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
      errCode.description = 'Unknown';
      Notification(errCode);
      return null;
  }
};

const REPORT_OKE = 1300;
const REPORT_BAD_REQUEST = 1301;

export const handleErrCodeReport = (data) => {
  if (!data) {
    const errCode = {
      type: 'error',
      title: 'Code:',
      description: 'data is null'
    };
    Notification(errCode);
    return null;
  }
  const { code, message, payload, deny_permission_codes } = data;
  const errCode = {
    type: 'error',
    title: 'Code:' + code,
    description: ''
  };
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
      errCode.description = 'Unknown';
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
    const errCode = {
      type: 'error',
      title: 'Code: Unknown',
      description: 'Unknown'
    };
    Notification(errCode);
    return null;
  }
  const { code, message, payload } = data;
  const errCode = {
    type: 'error',
    title: 'Code:' + code,
    description: ''
  };
  switch (+code) {
    case AI_OKE:
      return data;
    case AI_BAD_REQUEST:
      errCode.description = message;
      Notification(errCode);
      return null;
    default:
      errCode.description = 'Unknown';
      Notification(errCode);
      return null;
  }
};
