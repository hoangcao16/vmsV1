import Notification from "../../components/vms/notification/Notification";
import {handleForbiddenCode} from "../authz/forbidden";
import { reactLocalStorage } from "reactjs-localstorage";

const language = reactLocalStorage.get('language')

const KCamproxySuccess = 15000
const KCamproxyBadRequest = 15101
const KCamproxyMissingToken = 15102
const KCamproxySDPRemoteOfferFailed = 15103
const KCamproxySDPCreateAnswerFailed = 15104
const KCamproxySDPLocalOfferFailed = 15105
const KCamproxyAddTrackFailed = 15106
const KCamproxyNewLocalStaticFailed = 15107
const KCamproxyCamNotFound = 15108
const KCamproxyCreatePeerConnFailed = 15109
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
        case KCamproxySuccess:
            return payload
        case KCamproxyBadRequest:
            if (language == 'vn') {
                errCode.description = "Yêu cầu không hợp lệ";
            } else {
                errCode.description = "Bad request";
            }
            Notification(errCode)
            return null
        case KCamproxyMissingToken:
            if (language == 'vn') {
                errCode.description = "Không tìm thấy Token";
            } else {
                errCode.description = "Missing Token";
            }
            Notification(errCode)
            return null
        case KCamproxySDPRemoteOfferFailed:
            if (language == 'vn') {
                errCode.description = "SDP đề nghị điều khiển từ xa không thành công";
            } else {
                errCode.description = "SDP remote offer failed";
            }
            Notification(errCode)
            return null
        case KCamproxySDPCreateAnswerFailed:
            if (language == 'vn') {
                errCode.description = "SDP tạo câu trả lời không thành công";
            } else {
                errCode.description = "SDP create answer failed";
            }
            Notification(errCode)
            return null
        case KCamproxySDPLocalOfferFailed:
            if (language == 'vn') {
                errCode.description = "SDP cục bộ đề nghị không thành công";
            } else {
                errCode.description = "SDP local offer failed";
            }
            Notification(errCode)
            return null
        case KCamproxyAddTrackFailed:
            if (language == 'vn') {
                errCode.description = "SDP thêm theo dõi không thành công";
            } else {
                errCode.description = "SDP add track failed";
            }
            Notification(errCode)
            return null
        case KCamproxyNewLocalStaticFailed:
            if (language == 'vn') {
                errCode.description = "Cục bộ tĩnh mới không thành công";
            } else {
                errCode.description = "New local static failed";
            }
            Notification(errCode)
            return null
        case KCamproxyCamNotFound:
            if (language == 'vn') {
                errCode.description = "Không tìm thấy Camera";
            } else {
                errCode.description = "Not found Camera";
            }
            Notification(errCode)
            return null
        case KCamproxyCreatePeerConnFailed:
            if (language == 'vn') {
                errCode.description = "Tạo kết nối ngang hàng";
            } else {
                errCode.description = "Create peer connection";
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