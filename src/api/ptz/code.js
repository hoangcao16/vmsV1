import Notification from "../../components/vms/notification/Notification";
import { handleForbiddenCode } from "../authz/forbidden";

const OKE = 1000
// const FAILED = 1001
// const COMING_SOON = 1002
// const AUTHZ_NO_RESPONSE = 1005
// const MISSING_PARAMS = 1010
// const CAMERA_ID_MISSING = 1011
// const DIRECTION_MISSING = 1012
// const ISSTOP_MISSING = 1013
// const SPEED_MISSING = 1014
// const PRESET_ID_MISSING = 1015
// const PRESET_TOUR_ID_MISSING = 1016
// const LIST_POINT_MISSING = 1017
// const TIME_DELAY_MISSING = 1018
// const NAME_MISSING = 1019
// const IP_STRIP_MISSING = 1020
// const PTZ_MISSING = 1021
// const PTZ_KEY_MISSING = 1022
// const ZONE_MISSING = 1023
// const VENDOR_MISSING = 1026
// const CAMERA_ID_OUT_OF_RANGE = 1031
// const DIRECTION_OUT_OF_RANGE = 1032
// const ISSTOP_OUT_OF_RANGE = 1033
// const SPEED_OUT_OF_RANGE = 1034
// const PRESET_ID_OUT_OF_RANGE = 1035
// const PRESET_TOUR_ID_OUT_OF_RANGE = 1036
// const LIST_POINT_OUT_OF_RANGE = 1037
// const TIME_DELAY_OUT_OF_RANGE = 1038
// const NAME_OUT_OF_RANGE = 1039
// const IP_STRIP_OUT_OF_RANGE = 1040
// const ZONE_OUT_OF_RANGE = 1043
// const PAGE_OUT_OF_RANGE = 1044
// const SIZE_OUT_OF_RANGE = 1045
// const USER_OUT_OF_RANGE = 1047
// const PTZ_EXIST = 1050
// const PTZ_BUSY = 1051
// const SYSTEM_BUSY = 1052
// const PTZ_FAILSE = 1060
// const PTZ_CAMERA_NO_CONNECT = 1061
// const PTZ_PRESET_NO_EXIST = 1062
// const PTZ_PRESET_OUT_OF_RANGE = 1063
// const PTZ_NO_SUPPORT = 1064
// const PTZ_NO_EXIST = 1065
// const PTZ_CONNECTED_NOT_EXIST = 1066
// const PTZ_NOT_RESPONSE = 1067
// const PTZ_CANT_READ_RESPONSE = 1068
// const PTZ_LOGIN_FAILSE = 1069
// const PTZ_PARAM_MISSING = 1070
// const PTZ_ACTION_MISSING = 1071
// const CANT_INSERT_DATABASE = 1080
// const CANT_UPDATE_DATABASE = 1081
// const CANT_DELETE_DATABASE = 1082
// const ISAPI_CANT_FIND_CHANEL = 1085
// const SCAN_EMPTY = 1090
// const SCAN_FAILED = 1091
const StatusForbidden = 605;

export const handleErrCode = ({ code, message, payload, deny_permission_codes }) => {
    const errCode = {
        type: "error",
        title: "Code:" + code,
        description: '',
    };
    switch (code) {
        case OKE:
            return payload != null ? payload : []
        case StatusForbidden:
            handleForbiddenCode(deny_permission_codes);
            return null;
        default:
            errCode.description = 'Unknown'
            Notification(errCode)
            return null
    }
}

export const handleDeleteErrCode = ({ code, message, payload }) => {
    const errCode = {
        type: "error",
        title: "Code:" + code,
        description: '',
    };
    switch (code) {
        case OKE:
            return { code, message, payload }
        default:
            errCode.description = 'Unknown'
            Notification(errCode)
            return null
    }
}