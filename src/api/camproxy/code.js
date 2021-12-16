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
            errCode.description = 'Missing token'
            Notification(errCode)
            return null
        case KCamproxySDPRemoteOfferFailed:
            errCode.description = 'SDP remote offer failed'
            Notification(errCode)
            return null
        case KCamproxySDPCreateAnswerFailed:
            errCode.description = 'SDP create answer failed'
            Notification(errCode)
            return null
        case KCamproxySDPLocalOfferFailed:
            errCode.description = 'SDP local offer failed'
            Notification(errCode)
            return null
        case KCamproxyAddTrackFailed:
            errCode.description = 'SDP add track failed'
            Notification(errCode)
            return null
        case KCamproxyNewLocalStaticFailed:
            errCode.description = 'New local static failed'
            Notification(errCode)
            return null
        case KCamproxyCamNotFound:
            errCode.description = 'Not found camera'
            Notification(errCode)
            return null
        case KCamproxyCreatePeerConnFailed:
            errCode.description = 'Create peer connection'
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