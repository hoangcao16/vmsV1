import Notification from "../../components/vms/notification/Notification";
import {handleForbiddenCode} from "../authz/forbidden";
import { reactLocalStorage } from "reactjs-localstorage";

const language = reactLocalStorage.get('language')

const KPandaSuccess = 12000;
const KPandaMissingFieldDomainOrUser = 12101
const KPandaBadRequest = 12102
export const KPandaInternalServer = 12103
const KPandaCamproxyNotFound = 12104
const KPandaCamNotFound = 12105
const StatusForbidden = 605;

export const handleErrCode = ({code, message, payload, deny_permission_codes}) => {
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
    switch (code) {
        case KPandaSuccess:
            return payload
        case KPandaMissingFieldDomainOrUser:
            if (language == 'vn') {
                errCode.description = "Mất miền hoặc người dùng";
            } else {
                errCode.description = "Missing domain or user";
            }
            Notification(errCode)
            return null
        case KPandaBadRequest:
            if (language == 'vn') {
                errCode.description = "Yêu cầu không hợp lệ";
            } else {
                errCode.description = "Bad request";
            }
            Notification(errCode)
            return null
        case KPandaInternalServer:
            if (language == 'vn') {
                errCode.description = "Lỗi máy chủ nội bộ";
            } else {
                errCode.description = "Internal server";
            }
            Notification(errCode)
            return null
        case KPandaCamproxyNotFound:
            if (language == 'vn') {
                errCode.description = "Không tìm thấy Camproxy";
            } else {
                errCode.description = "Not found any Camproxy";
            }
            Notification(errCode)
            return null
        case KPandaCamNotFound:
            if (language == 'vn') {
                errCode.description = "Không tìm thấy Camera";
            } else {
                errCode.description = "Not found any Camera";
            }
            Notification(errCode)
            return null
        case StatusForbidden:
            handleForbiddenCode(deny_permission_codes);
            return null;
        default:
            if (language == 'vn') {
                errCode.description = "Không xác định";
            } else {
                errCode.description = "Unknown";
            }
            Notification(errCode)
            return null
    }
}