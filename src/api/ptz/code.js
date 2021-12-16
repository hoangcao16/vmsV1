import Notification from "../../components/vms/notification/Notification";
import { handleForbiddenCode } from "../authz/forbidden";
import { reactLocalStorage } from "reactjs-localstorage";

const language = reactLocalStorage.get("language");

const OKE = 1000;
const FAILED = 1001;
const COMING_SOON = 1002;
const AUTHZ_NO_RESPONSE = 1005;
const MISSING_PARAMS = 1010;
const CAMERA_ID_MISSING = 1011;
const DIRECTION_MISSING = 1012;
const ISSTOP_MISSING = 1013;
const SPEED_MISSING = 1014;
const PRESET_ID_MISSING = 1015;
const PRESET_TOUR_ID_MISSING = 1016;
const LIST_POINT_MISSING = 1017;
const TIME_DELAY_MISSING = 1018;
const NAME_MISSING = 1019;
const IP_STRIP_MISSING = 1020;
const PTZ_MISSING = 1021;
const PTZ_KEY_MISSING = 1022;
const ZONE_MISSING = 1023;
const VENDOR_MISSING = 1026;
const CAMERA_ID_OUT_OF_RANGE = 1031;
const DIRECTION_OUT_OF_RANGE = 1032;
const ISSTOP_OUT_OF_RANGE = 1033;
const SPEED_OUT_OF_RANGE = 1034;
const PRESET_ID_OUT_OF_RANGE = 1035;
const PRESET_TOUR_ID_OUT_OF_RANGE = 1036;
const LIST_POINT_OUT_OF_RANGE = 1037;
const TIME_DELAY_OUT_OF_RANGE = 1038;
const NAME_OUT_OF_RANGE = 1039;
const IP_STRIP_OUT_OF_RANGE = 1040;
const ZONE_OUT_OF_RANGE = 1043;
const PAGE_OUT_OF_RANGE = 1044;
const SIZE_OUT_OF_RANGE = 1045;
const USER_OUT_OF_RANGE = 1047;
const PTZ_EXIST = 1050;
const PTZ_BUSY = 1051;
const SYSTEM_BUSY = 1052;
const PTZ_FAILSE = 1060;
const PTZ_CAMERA_NO_CONNECT = 1061;
const PTZ_PRESET_NO_EXIST = 1062;
const PTZ_PRESET_OUT_OF_RANGE = 1063;
const PTZ_NO_SUPPORT = 1064;
const PTZ_NO_EXIST = 1065;
const PTZ_CONNECTED_NOT_EXIST = 1066;
const PTZ_NOT_RESPONSE = 1067;
const PTZ_CANT_READ_RESPONSE = 1068;
const PTZ_LOGIN_FAILSE = 1069;
const PTZ_PARAM_MISSING = 1070;
const PTZ_ACTION_MISSING = 1071;
const CANT_INSERT_DATABASE = 1080;
const CANT_UPDATE_DATABASE = 1081;
const CANT_DELETE_DATABASE = 1082;
const ISAPI_CANT_FIND_CHANEL = 1085;
const SCAN_EMPTY = 1090;
const SCAN_FAILED = 1091;
const StatusForbidden = 605;

export const handleErrCode = ({
  code,
  message,
  payload,
  deny_permission_codes,
}) => {
  let errCode = {};
  if (language == "vn") {
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
    case OKE:
      return payload != null ? payload : [];
    case StatusForbidden:
      handleForbiddenCode(deny_permission_codes);
      return null;
    case FAILED:
      if (language == "vn") {
        errCode.description = "Thất bại";
      } else {
        errCode.description = "Failed";
      }
      Notification(errCode);
      return null;
    case COMING_SOON:
      if (language == "vn") {
        errCode.description = "Chức năng chưa hoàn thiện";
      } else {
        errCode.description = "Function not completed";
      }
      Notification(errCode);
      return null;
    case AUTHZ_NO_RESPONSE:
      if (language == "vn") {
        errCode.description =
          "Không phản hồi hoặc không đọc được phản hồi của Authz";
      } else {
        errCode.description = "Authz responses are unresponsive or unreadable";
      }
      Notification(errCode);
      return null;
    case MISSING_PARAMS:
      if (language == "vn") {
        errCode.description = "Thiếu trường dữ liệu";
      } else {
        errCode.description = "Missing data feild";
      }
      Notification(errCode);
      return null;
    case CAMERA_ID_MISSING:
      if (language == "vn") {
        errCode.description = "Vui lòng chọn Camera";
      } else {
        errCode.description = "Please choose Camera";
      }
      Notification(errCode);
      return null;
    case DIRECTION_MISSING:
      if (language == "vn") {
        errCode.description = "Vui lòng chọn hướng quay";
      } else {
        errCode.description = "Please choose direction";
      }
      Notification(errCode);
      return null;
    case ISSTOP_MISSING:
      if (language == "vn") {
        errCode.description =
          "Vui lòng chọn kiểu hành động (bắt đầu hoặc kết thúc)";
      } else {
        errCode.description = "Please choose action type (start or end)";
      }
      Notification(errCode);
      return null;
    case SPEED_MISSING:
      if (language == "vn") {
        errCode.description = "Vui lòng chọn tốc độ quay";
      } else {
        errCode.description = "Please choose rotation speed";
      }
      Notification(errCode);
      return null;
    case PRESET_ID_MISSING:
      if (language == "vn") {
        errCode.description = "Vui lòng chọn điểm quay";
      } else {
        errCode.description = "Please choose rotation point";
      }
      Notification(errCode);
      return null;
    case PRESET_TOUR_ID_MISSING:
      errCode.description = "presetTourId? - Vui lòng chọn hành trình quay";
      Notification(errCode);
      return null;
    case LIST_POINT_MISSING:
      errCode.description = "listPoint? - Thiếu danh sách điểm quay";
      Notification(errCode);
      return null;
    case TIME_DELAY_MISSING:
      if (language == "vn") {
        errCode.description = "Vui lòng chọn thời gian trì hoãn";
      } else {
        errCode.description = "Please choose time delay";
      }
      Notification(errCode);
      return null;
    case NAME_MISSING:
      if (language == "vn") {
        errCode.description = "Vui lòng điền tên";
      } else {
        errCode.description = "Please enter name";
      }
      Notification(errCode);
      return null;
    case IP_STRIP_MISSING:
      if (language == "vn") {
        errCode.description = "Vui lòng chọn dải IP";
      } else {
        errCode.description = "Please choose IP range";
      }
      Notification(errCode);
      return null;
    case PTZ_MISSING:
      errCode.description = "clientId? - Vui lòng chọn PTZ onvif (biên)";
      Notification(errCode);
      return null;
    case PTZ_KEY_MISSING:
      errCode.description = "clientKey? - Thiếu key của PTZ onvif (biên)";
      Notification(errCode);
      return null;
    case ZONE_MISSING:
      if (language == "vn") {
        errCode.description = "Vui lòng chọn Zone";
      } else {
        errCode.description = "Please choose Zone";
      }
      Notification(errCode);
      return null;
    case VENDOR_MISSING:
      if (language == "vn") {
        errCode.description = "Vui lòng chọn hãng Camera";
      } else {
        errCode.description = "Please choose Camera vendor";
      }
      Notification(errCode);
      return null;
    case CAMERA_ID_OUT_OF_RANGE:
      if (language == "vn") {
        errCode.description = "Không tìm thấy Camera";
      } else {
        errCode.description = "No valid Camera found";
      }
      Notification(errCode);
      return null;
    case DIRECTION_OUT_OF_RANGE:
      if (language == "vn") {
        errCode.description = "Hướng quay không đúng";
      } else {
        errCode.description = "The direction is not correct";
      }
      Notification(errCode);
      return null;
    case ISSTOP_OUT_OF_RANGE:
      if (language == "vn") {
        errCode.description = "Kiểu hành động không đúng";
      } else {
        errCode.description = "The action type is not correct";
      }
      Notification(errCode);
      return null;
    case SPEED_OUT_OF_RANGE:
      if (language == "vn") {
        errCode.description = "Tốc độ quay không đúng";
      } else {
        errCode.description = "The rotation speed is not correct";
      }
      Notification(errCode);
      return null;
    case PRESET_ID_OUT_OF_RANGE:
      errCode.description = "presetId? - Id ngoài khoảng";
      Notification(errCode);
      return null;
    case PRESET_TOUR_ID_OUT_OF_RANGE:
      errCode.description = "presetTourId? - Id ngoài khoảng";
      Notification(errCode);
      return null;
    case LIST_POINT_OUT_OF_RANGE:
      errCode.description =
        "Số lượng điểm quay trên hành trình ngoài khoảng (tối thiểu 2 - tối đa 255)";
      Notification(errCode);
      return null;
    case TIME_DELAY_OUT_OF_RANGE:
      if (language == "vn") {
        errCode.description = "Thời gian trì hoãn không đúng";
      } else {
        errCode.description = "The time delay is not correct";
      }
      Notification(errCode);
      return null;
    case NAME_OUT_OF_RANGE:
      if (language == "vn") {
        errCode.description = "Tên không đúng";
      } else {
        errCode.description = "Name is not correct";
      }
      Notification(errCode);
      return null;
    case IP_STRIP_OUT_OF_RANGE:
      if (language == "vn") {
        errCode.description = "Dải IP không đúng";
      } else {
        errCode.description = "The IP range is not correct";
      }
      Notification(errCode);
      return null;
    case ZONE_OUT_OF_RANGE:
      if (language == "vn") {
        errCode.description = "Zone không tồn tại";
      } else {
        errCode.description = "No available Zone found";
      }
      Notification(errCode);
      return null;
    case PAGE_OUT_OF_RANGE:
      if (language == "vn") {
        errCode.description = "Giá trị trang không đúng";
      } else {
        errCode.description = "The page value is not correct";
      }
      Notification(errCode);
      return null;
    case SIZE_OUT_OF_RANGE:
      if (language == "vn") {
        errCode.description = "Giá trị kich thước không đúng";
      } else {
        errCode.description = "The size value is not correct";
      }
      Notification(errCode);
      return null;
    case USER_OUT_OF_RANGE:
      if (language == "vn") {
        errCode.description = "Không tìm thấy người dùng này";
      } else {
        errCode.description = "No valid user found";
      }
      Notification(errCode);
      return null;
    case PTZ_EXIST:
      if (language == "vn") {
        errCode.description = "PTZ Onvif này đã tồn tại";
      } else {
        errCode.description = "PTZ Onvif already exist";
      }
      Notification(errCode);
      return null;
    case PTZ_BUSY:
      if (language == "vn") {
        errCode.description = "PTZ Onvif đâng bận";
      } else {
        errCode.description = "PTZ Onvif is busy";
      }
      Notification(errCode);
      return null;
    case SYSTEM_BUSY:
      if (language == "vn") {
        errCode.description = "Hệ thống đang bận";
      } else {
        errCode.description = "System is busy";
      }
      Notification(errCode);
      return null;
    case PTZ_FAILSE:
      if (language == "vn") {
        errCode.description = "Hành động không thành công";
      } else {
        errCode.description = "Action is not success";
      }
      Notification(errCode);
      return null;
    case PTZ_CAMERA_NO_CONNECT:
      errCode.description = "Không gửi được lệnh cho camera";
      Notification(errCode);
      return null;
    case PTZ_PRESET_NO_EXIST:
      errCode.description = "Điểm preset chưa được lưu trên camera";
      Notification(errCode);
      return null;
    case PTZ_PRESET_OUT_OF_RANGE:
      errCode.description = "Giới hạn số lượng điểm preset";
      Notification(errCode);
      return null;
    case PTZ_NO_SUPPORT:
      errCode.description = "Không hỗ trợ hành động";
      Notification(errCode);
      return null;
    case PTZ_NO_EXIST:
      errCode.description = "Chưa có PTZ Onvif nào được cấu hình tại zone này";
      Notification(errCode);
      return null;
    case PTZ_CONNECTED_NOT_EXIST:
      errCode.description = "Không có PTZ Onvif nào online tại zone này";
      Notification(errCode);
      return null;
    case PTZ_NOT_RESPONSE:
      errCode.description = "Module PTZ Onvif(biên) không phải hồi";
      Notification(errCode);
      return null;
    case PTZ_CANT_READ_RESPONSE:
      errCode.description = "Không đọc được phản hồi từ Module PTZ Onvif(biên)";
      Notification(errCode);
      return null;
    case PTZ_LOGIN_FAILSE:
      errCode.description = "Đăng nhập để điều khiển camera không thành công";
      Notification(errCode);
      return null;
    case PTZ_PARAM_MISSING:
      errCode.description =
        "Thiếu thông tin về camera (IP, port, user name, pass word)";
      Notification(errCode);
      return null;
    case PTZ_ACTION_MISSING:
      errCode.description =
        "action? Không tìm được hành động phù hợp (PTZ Onvif). Liên hệ admin";
      Notification(errCode);
      return null;
    case CANT_INSERT_DATABASE:
      errCode.description = "Không insert được vào database";
      Notification(errCode);
      return null;
    case CANT_UPDATE_DATABASE:
      errCode.description = "Không update được vào database";
      Notification(errCode);
      return null;
    case CANT_DELETE_DATABASE:
      errCode.description = "Không delete được database";
      Notification(errCode);
      return null;
    case ISAPI_CANT_FIND_CHANEL:
      errCode.description = "Không tìm được chanel của camera";
      Notification(errCode);
      return null;
    case SCAN_EMPTY:
      errCode.description = "Không tìm thấy thiết bị nào";
      Notification(errCode);
      return null;
    case SCAN_FAILED:
      errCode.description = "Không quét được";
      Notification(errCode);
      return null;
    default:
      errCode.description = "Unknown";
      Notification(errCode);
      return null;
  }
};

export const handleDeleteErrCode = ({ code, message, payload }) => {
  const errCode = {
    type: "error",
    title: "Code:" + code,
    description: "",
  };
  switch (code) {
    case OKE:
      return { code, message, payload };
    default:
      errCode.description = "Unknown";
      Notification(errCode);
      return null;
  }
};
