import Notification from "../../components/vms/notification/Notification";
import { handleForbiddenCode } from "../authz/forbidden";

const OKE = 1000
const FAILED = 1001
const COMING_SOON = 1002
const AUTHZ_NO_RESPONSE = 1005
const MISSING_PARAMS = 1010
const CAMERA_ID_MISSING = 1011
const DIRECTION_MISSING = 1012
const ISSTOP_MISSING = 1013
const SPEED_MISSING = 1014
const PRESET_ID_MISSING = 1015
const PRESET_TOUR_ID_MISSING = 1016
const LIST_POINT_MISSING = 1017
const TIME_DELAY_MISSING = 1018
const NAME_MISSING = 1019
const IP_STRIP_MISSING = 1020
const PTZ_MISSING = 1021
const PTZ_KEY_MISSING = 1022
const ZONE_MISSING = 1023
const VENDOR_MISSING = 1026
const CAMERA_ID_OUT_OF_RANGE = 1031
const DIRECTION_OUT_OF_RANGE = 1032
const ISSTOP_OUT_OF_RANGE = 1033
const SPEED_OUT_OF_RANGE = 1034
const PRESET_ID_OUT_OF_RANGE = 1035
const PRESET_TOUR_ID_OUT_OF_RANGE = 1036
const LIST_POINT_OUT_OF_RANGE = 1037
const TIME_DELAY_OUT_OF_RANGE = 1038
const NAME_OUT_OF_RANGE = 1039
const IP_STRIP_OUT_OF_RANGE = 1040
const ZONE_OUT_OF_RANGE = 1043
const PAGE_OUT_OF_RANGE = 1044
const SIZE_OUT_OF_RANGE = 1045
const USER_OUT_OF_RANGE = 1047
const PTZ_EXIST = 1050
const PTZ_BUSY = 1051
const SYSTEM_BUSY = 1052
const PTZ_FAILSE = 1060
const PTZ_CAMERA_NO_CONNECT = 1061
const PTZ_PRESET_NO_EXIST = 1062
const PTZ_PRESET_OUT_OF_RANGE = 1063
const PTZ_NO_SUPPORT = 1064
const PTZ_NO_EXIST = 1065
const PTZ_CONNECTED_NOT_EXIST = 1066
const PTZ_NOT_RESPONSE = 1067
const PTZ_CANT_READ_RESPONSE = 1068
const PTZ_LOGIN_FAILSE = 1069
const PTZ_PARAM_MISSING = 1070
const PTZ_ACTION_MISSING = 1071
const CANT_INSERT_DATABASE = 1080
const CANT_UPDATE_DATABASE = 1081
const CANT_DELETE_DATABASE = 1082
const ISAPI_CANT_FIND_CHANEL = 1085
const SCAN_EMPTY = 1090
const SCAN_FAILED = 1091
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
        case FAILED:
            errCode.description = 'Thất bại';
            Notification(errCode)
            return null
        case COMING_SOON:
            errCode.description = 'Chức năng chưa hoàn thiện';
            Notification(errCode)
            return null
        case AUTHZ_NO_RESPONSE:
            errCode.description = 'Không phản hồi hoặc không đọc được phản hồi của Authz';
            Notification(errCode)
            return null
        case MISSING_PARAMS:
            errCode.description = 'Thiếu trường dữ liệu';
            Notification(errCode)
            return null
        case CAMERA_ID_MISSING:
            errCode.description = 'cameraUuid? - Vui lòng chọn camera';
            Notification(errCode)
            return null
        case DIRECTION_MISSING:
            errCode.description = 'direction? - Vui lòng chọn hướng quay';
            Notification(errCode)
            return null
        case ISSTOP_MISSING:
            errCode.description = 'isStop? - Vui lòng chọn kiểu hành động (bắt đầu hay kết thúc)';
            Notification(errCode)
            return null
        case SPEED_MISSING:
            errCode.description = 'speed? - Vui lòng chọn tốc độ quay';
            Notification(errCode)
            return null
        case PRESET_ID_MISSING:
            errCode.description = 'presetId? - Vui lòng chọn điểm quay';
            Notification(errCode)
            return null
        case PRESET_TOUR_ID_MISSING:
            errCode.description = 'presetTourId? - Vui lòng chọn hành trình quay';
            Notification(errCode)
            return null
        case LIST_POINT_MISSING:
            errCode.description = 'listPoint? - Thiếu danh sách điểm quay';
            Notification(errCode)
            return null
        case TIME_DELAY_MISSING:
            errCode.description = 'timeDelay? - Vui lòng chọn thời gian nghỉ';
            Notification(errCode)
            return null
        case NAME_MISSING:
            errCode.description = 'name? - Vui lòng điền tên';
            Notification(errCode)
            return null
        case IP_STRIP_MISSING:
            errCode.description = 'ipStrip? - Vui lòng chọn dải IP';
            Notification(errCode)
            return null
        case PTZ_MISSING:
            errCode.description = 'clientId? - Vui lòng chọn PTZ onvif (biên)';
            Notification(errCode)
            return null
        case PTZ_KEY_MISSING:
            errCode.description = 'clientKey? - Thiếu key của PTZ onvif (biên)';
            Notification(errCode)
            return null
        case ZONE_MISSING:
            errCode.description = 'zoneUuid? - Vui lòng chọn zone';
            Notification(errCode)
            return null
        case VENDOR_MISSING:
            errCode.description = 'vendorUuid? - Vui lòng chọn hãng camera';
            Notification(errCode)
            return null
        case CAMERA_ID_OUT_OF_RANGE:
            errCode.description = 'cameraUuid? - Không tìm thấy camera';
            Notification(errCode)
            return null
        case DIRECTION_OUT_OF_RANGE:
            errCode.description = 'direction? - Hướng quay không đúng';
            Notification(errCode)
            return null
        case ISSTOP_OUT_OF_RANGE:
            errCode.description = 'isStop? - Kiểu hành động không đúng';
            Notification(errCode)
            return null
        case SPEED_OUT_OF_RANGE:
            errCode.description = 'speed? - Tốc độ không đúng';
            Notification(errCode)
            return null
        case PRESET_ID_OUT_OF_RANGE:
            errCode.description = 'presetId? - Id ngoài khoảng';
            Notification(errCode)
            return null
        case PRESET_TOUR_ID_OUT_OF_RANGE:
            errCode.description = 'presetTourId? - Id ngoài khoảng';
            Notification(errCode)
            return null
        case LIST_POINT_OUT_OF_RANGE:
            errCode.description = 'listPoint? - Số lượng listPoint không đúng';
            Notification(errCode)
            return null
        case TIME_DELAY_OUT_OF_RANGE:
            errCode.description = 'timeDelay? - Thời gian nghỉ ngoài khoảng';
            Notification(errCode)
            return null
        case NAME_OUT_OF_RANGE:
            errCode.description = 'name? - Tên không đúng';
            Notification(errCode)
            return null
        case IP_STRIP_OUT_OF_RANGE:
            errCode.description = 'ipStrip? - Dải địa chỉ IP không đúng';
            Notification(errCode)
            return null
        case ZONE_OUT_OF_RANGE:
            errCode.description = 'zoneUuid? - Zone không tồn tại';
            Notification(errCode)
            return null
        case PAGE_OUT_OF_RANGE:
            errCode.description = 'page? - Giá trị page không đúng';
            Notification(errCode)
            return null
        case SIZE_OUT_OF_RANGE:
            errCode.description = 'size? - Giá trị size không đúng';
            Notification(errCode)
            return null
        case USER_OUT_OF_RANGE:
            errCode.description = 'userUuid? - Không tìm thấy người dùng này';
            Notification(errCode)
            return null
        case PTZ_EXIST:
            errCode.description = 'PTZ Onvif này đã tồn tại';
            Notification(errCode)
            return null
        case PTZ_BUSY:
            errCode.description = 'PTZ Onvif này đang bận';
            Notification(errCode)
            return null
        case SYSTEM_BUSY:
            errCode.description = 'Hệ thống đang bận';
            Notification(errCode)
            return null
        case PTZ_FAILSE:
            errCode.description = 'Hành động không thành công';
            Notification(errCode)
            return null
        case PTZ_CAMERA_NO_CONNECT:
            errCode.description = 'Không gửi được lệnh cho camera';
            Notification(errCode)
            return null
        case PTZ_PRESET_NO_EXIST:
            errCode.description = 'Điểm preset chưa được lưu trên camera';
            Notification(errCode)
            return null
        case PTZ_PRESET_OUT_OF_RANGE:
            errCode.description = 'Giới hạn số lượng điểm preset';
            Notification(errCode)
            return null
        case PTZ_NO_SUPPORT:
            errCode.description = 'Không hỗ trợ hành động';
            Notification(errCode)
            return null
        case PTZ_NO_EXIST:
            errCode.description = 'Chưa có PTZ Onvif nào được cấu hình tại zone này';
            Notification(errCode)
            return null
        case PTZ_CONNECTED_NOT_EXIST:
            errCode.description = 'Không có PTZ Onvif nào online tại zone này';
            Notification(errCode)
            return null
        case PTZ_NOT_RESPONSE:
            errCode.description = 'Module PTZ Onvif(biên) không phải hồi';
            Notification(errCode)
            return null
        case PTZ_CANT_READ_RESPONSE:
            errCode.description = 'Không đọc được phản hồi từ Module PTZ Onvif(biên)';
            Notification(errCode)
            return null
        case PTZ_LOGIN_FAILSE:
            errCode.description = 'Đăng nhập để điều khiển camera không thành công';
            Notification(errCode)
            return null
        case PTZ_PARAM_MISSING:
            errCode.description = 'Thiếu thông tin về camera (IP, port, user name, pass word)';
            Notification(errCode)
            return null
        case PTZ_ACTION_MISSING:
            errCode.description = 'action? Không tìm được hành động phù hợp (PTZ Onvif). Liên hệ admin';
            Notification(errCode)
            return null
        case CANT_INSERT_DATABASE:
            errCode.description = 'Không insert được vào database';
            Notification(errCode)
            return null
        case CANT_UPDATE_DATABASE:
            errCode.description = 'Không update được vào database';
            Notification(errCode)
            return null
        case CANT_DELETE_DATABASE:
            errCode.description = 'Không delete được database';
            Notification(errCode)
            return null
        case ISAPI_CANT_FIND_CHANEL:
            errCode.description = 'Không tìm được chanel của camera';
            Notification(errCode)
            return null
        case SCAN_EMPTY:
            errCode.description = 'Không tìm thấy thiết bị nào';
            Notification(errCode)
            return null
        case SCAN_FAILED:
            errCode.description = 'Không quét được';
            Notification(errCode)
            return null
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