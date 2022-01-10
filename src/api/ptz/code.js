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
  if (language === "vn") {
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
      if (language === "vn") {
        errCode.description = "Thất bại";
      } else {
        errCode.description = "Failed";
      }
      Notification(errCode);
      return null;
    case COMING_SOON:
      if (language === "vn") {
        errCode.description = "Chức năng chưa hoàn thiện";
      } else {
        errCode.description = "Function not completed";
      }
      Notification(errCode);
      return null;
    case AUTHZ_NO_RESPONSE:
      if (language === "vn") {
        errCode.description =
          "Không phản hồi hoặc không đọc được phản hồi của Authz";
      } else {
        errCode.description = "Not responded or can't read response from Authz";
      }
      Notification(errCode);
      return null;
    case MISSING_PARAMS:
      if (language === "vn") {
        errCode.description = "Thiếu trường dữ liệu";
      } else {
        errCode.description = "Missing data feild";
      }
      Notification(errCode);
      return null;
    case CAMERA_ID_MISSING:
      if (language === "vn") {
        errCode.description = "Vui lòng chọn Camera";
      } else {
        errCode.description = "Please choose Camera";
      }
      Notification(errCode);
      return null;
    case DIRECTION_MISSING:
      if (language === "vn") {
        errCode.description = "Vui lòng chọn hướng quay";
      } else {
        errCode.description = "Please choose direction";
      }
      Notification(errCode);
      return null;
    case ISSTOP_MISSING:
      if (language === "vn") {
        errCode.description =
          "Vui lòng chọn kiểu hành động (bắt đầu hoặc kết thúc)";
      } else {
        errCode.description = "Please choose action type (start or end)";
      }
      Notification(errCode);
      return null;
    case SPEED_MISSING:
      if (language === "vn") {
        errCode.description = "Vui lòng chọn tốc độ quay";
      } else {
        errCode.description = "Please choose rotation speed";
      }
      Notification(errCode);
      return null;
    case PRESET_ID_MISSING:
      if (language === "vn") {
        errCode.description = "Vui lòng chọn preset Id";
      } else {
        errCode.description = "Please choose rotation point";
      }
      Notification(errCode);
      return null;
    case PRESET_TOUR_ID_MISSING:
      if (language === "vn") {
        errCode.description = "Vui lòng chọn preset tour Id";
      } else {
        errCode.description = "Please choose preset tour Id";
      }
      Notification(errCode);
      return null;
    case LIST_POINT_MISSING:
      if (language === "vn") {
        errCode.description = "Thiếu danh sách điểm quay";
      } else {
        errCode.description = "List point is missing";
      }
      Notification(errCode);
      return null;
    case TIME_DELAY_MISSING:
      if (language === "vn") {
        errCode.description = "Vui lòng chọn thời gian trì hoãn";
      } else {
        errCode.description = "Please choose time delay";
      }
      Notification(errCode);
      return null;
    case NAME_MISSING:
      if (language === "vn") {
        errCode.description = "Vui lòng điền tên";
      } else {
        errCode.description = "Please enter name";
      }
      Notification(errCode);
      return null;
    case IP_STRIP_MISSING:
      if (language === "vn") {
        errCode.description = "Vui lòng chọn dải IP";
      } else {
        errCode.description = "Please choose IP range";
      }
      Notification(errCode);
      return null;
    case PTZ_MISSING:
      if (language === "vn") {
        errCode.description = "Vui lòng chọn PTZ Onvif";
      } else {
        errCode.description = "Please choose PTZ Onvif";
      }
      Notification(errCode);
      return null;
    case PTZ_KEY_MISSING:
      if (language === "vn") {
        errCode.description = "Thiếu khóa của PTZ Onvif";
      } else {
        errCode.description = "The key of PTZ Onvif is missing";
      }
      Notification(errCode);
      return null;
    case ZONE_MISSING:
      if (language === "vn") {
        errCode.description = "Vui lòng chọn Zone";
      } else {
        errCode.description = "Please choose Zone";
      }
      Notification(errCode);
      return null;
    case VENDOR_MISSING:
      if (language === "vn") {
        errCode.description = "Vui lòng chọn hãng Camera";
      } else {
        errCode.description = "Please choose Camera vendor";
      }
      Notification(errCode);
      return null;
    case CAMERA_ID_OUT_OF_RANGE:
      if (language === "vn") {
        errCode.description = "Không tìm thấy Camera";
      } else {
        errCode.description = "No valid Camera found";
      }
      Notification(errCode);
      return null;
    case DIRECTION_OUT_OF_RANGE:
      if (language === "vn") {
        errCode.description = "Hướng quay không đúng";
      } else {
        errCode.description = "The direction is not correct";
      }
      Notification(errCode);
      return null;
    case ISSTOP_OUT_OF_RANGE:
      if (language === "vn") {
        errCode.description = "Kiểu hành động không đúng";
      } else {
        errCode.description = "The action type is not correct";
      }
      Notification(errCode);
      return null;
    case SPEED_OUT_OF_RANGE:
      if (language === "vn") {
        errCode.description = "Tốc độ quay không đúng";
      } else {
        errCode.description = "The rotation speed is not correct";
      }
      Notification(errCode);
      return null;
    case PRESET_ID_OUT_OF_RANGE:
      if (language === "vn") {
        errCode.description = "Preset Id ngoài khoảng";
      } else {
        errCode.description = "Preset Id out of range";
      }
      Notification(errCode);
      return null;
    case PRESET_TOUR_ID_OUT_OF_RANGE:
      if (language === "vn") {
        errCode.description = "Preset tour Id ngoài khoảng";
      } else {
        errCode.description = "Preset tour Id out of range";
      }
      Notification(errCode);
      return null;
    case LIST_POINT_OUT_OF_RANGE:
      if (language === "vn") {
        errCode.description = "Số lượng điểm quay ngoài khoảng 2-255";
      } else {
        errCode.description = "Number of rotation points out of range 2 - 255";
      }
      Notification(errCode);
      return null;
    case TIME_DELAY_OUT_OF_RANGE:
      if (language === "vn") {
        errCode.description = "Thời gian trì hoãn không đúng";
      } else {
        errCode.description = "The time delay is not correct";
      }
      Notification(errCode);
      return null;
    case NAME_OUT_OF_RANGE:
      if (language === "vn") {
        errCode.description = "Tên không đúng";
      } else {
        errCode.description = "Name is not correct";
      }
      Notification(errCode);
      return null;
    case IP_STRIP_OUT_OF_RANGE:
      if (language === "vn") {
        errCode.description = "Dải IP không đúng";
      } else {
        errCode.description = "The IP range is not correct";
      }
      Notification(errCode);
      return null;
    case ZONE_OUT_OF_RANGE:
      if (language === "vn") {
        errCode.description = "Zone không tồn tại";
      } else {
        errCode.description = "No available Zone found";
      }
      Notification(errCode);
      return null;
    case PAGE_OUT_OF_RANGE:
      if (language === "vn") {
        errCode.description = "Giá trị trang không đúng";
      } else {
        errCode.description = "The page value is not correct";
      }
      Notification(errCode);
      return null;
    case SIZE_OUT_OF_RANGE:
      if (language === "vn") {
        errCode.description = "Giá trị kich thước không đúng";
      } else {
        errCode.description = "The size value is not correct";
      }
      Notification(errCode);
      return null;
    case USER_OUT_OF_RANGE:
      if (language === "vn") {
        errCode.description = "Không tìm thấy người dùng này";
      } else {
        errCode.description = "No valid user found";
      }
      Notification(errCode);
      return null;
    case PTZ_EXIST:
      if (language === "vn") {
        errCode.description = "PTZ Onvif này đã tồn tại";
      } else {
        errCode.description = "PTZ Onvif already exist";
      }
      Notification(errCode);
      return null;
    case PTZ_BUSY:
      if (language === "vn") {
        errCode.description = "PTZ Onvif đâng bận";
      } else {
        errCode.description = "PTZ Onvif is busy";
      }
      Notification(errCode);
      return null;
    case SYSTEM_BUSY:
      if (language === "vn") {
        errCode.description = "Hệ thống đang bận";
      } else {
        errCode.description = "System is busy";
      }
      Notification(errCode);
      return null;
    case PTZ_FAILSE:
      if (language === "vn") {
        errCode.description = "Hành động không thành công";
      } else {
        errCode.description = "Action is not success";
      }
      Notification(errCode);
      return null;
    case PTZ_CAMERA_NO_CONNECT:
      if (language === 'vn') {
        errCode.description = "Không gửi được lệnh cho Camera";
      } else {
        errCode.description = "Can't send command to camera";
      }
      Notification(errCode);
      return null;
    case PTZ_PRESET_NO_EXIST:
      if (language === 'vn') {
        errCode.description = "Điểm preset chưa được lưu trên Camera";
      } else {
        errCode.description = "Preset point did not be saved on Camera";
      }
      Notification(errCode);
      return null;
    case PTZ_PRESET_OUT_OF_RANGE:
      if (language === 'vn') {
        errCode.description = "Giới hạn số lượng điểm preset";
      } else {
        errCode.description = "Limit of the number of preset points";
      }
      Notification(errCode);
      return null;
    case PTZ_NO_SUPPORT:
      if (language === 'vn') {
        errCode.description = "Không hỗ trợ hành động";
      } else {
        errCode.description = "This action is not supported";
      }
      Notification(errCode);
      return null;
    case PTZ_NO_EXIST:
      if (language === 'vn') {
        errCode.description = "Chưa có PTZ Onvif nào được cấu hình tại Zone này";
      } else {
        errCode.description = "No PTZ Onvif is configured in this Zone";
      }
      Notification(errCode);
      return null;
    case PTZ_CONNECTED_NOT_EXIST:
      if (language === 'vn') {
        errCode.description = "Không có PTZ Onvif nào trực tuyến tại Zone này";
      } else {
        errCode.description = "No online PTZ Onvif in this Zone";
      }
      Notification(errCode);
      return null;
    case PTZ_NOT_RESPONSE:
      if (language === 'vn') {
        errCode.description = "PTZ Onvif không phải hồi";
      } else {
        errCode.description = "PTZ Onvif is not responding";
      }
      Notification(errCode);
      return null;
    case PTZ_CANT_READ_RESPONSE:
      if (language === 'vn') {
        errCode.description = "Không đọc được phản hồi từ PTZ Onvif";
      } else {
        errCode.description = "Can't read response from";
      }
      Notification(errCode);
      return null;
    case PTZ_LOGIN_FAILSE:
      if (language === 'vn') {
        errCode.description = "Đăng nhập để điều khiển Camera không thành công";
      } else {
        errCode.description = "Login to control Camera failed";
      }
      Notification(errCode);
      return null;
    case PTZ_PARAM_MISSING:
      if (language === 'vn') {
        errCode.description = "Thiếu thông tin về Camera";
      } else {
        errCode.description = "Camera information is missing";
      }
      Notification(errCode);
      return null;
    case PTZ_ACTION_MISSING:
      if (language === 'vn') {
        errCode.description = "Không tìm được hành động phù hợp (PTZ Onvif). Liên hệ quản trị viên";
      } else {
        errCode.description = "No appropriate action was found (PTZ Onvif). Please contact administrator";
      }
      Notification(errCode);
      return null;
    case CANT_INSERT_DATABASE:
      if (language === 'vn') {
        errCode.description = "Không thêm được vào cơ sở dữ liệu";
      } else {
        errCode.description = "Can't insert to database";
      }
      Notification(errCode);
      return null;
    case CANT_UPDATE_DATABASE:
      if (language === 'vn') {
        errCode.description = "Không cập nhật được vào cơ sở dữ liệu";
      } else {
        errCode.description = "Can't update to database";
      }
      Notification(errCode);
      return null;
    case CANT_DELETE_DATABASE:
      if (language === 'vn') {
        errCode.description = "Không xóa được cơ sở dữ liệu";
      } else {
        errCode.description = "Can't delete database";
      }
      Notification(errCode);
      return null;
    case ISAPI_CANT_FIND_CHANEL:
      if (language === 'vn') {
        errCode.description = "Không tìm được kênh của Camera";
      } else {
        errCode.description = "Can't find Camera's channel";
      }
      Notification(errCode);
      return null;
    case SCAN_EMPTY:
      if (language === 'vn') {
        errCode.description = "Không tìm thấy thiết bị nào";
      } else {
        errCode.description = "Can't find any device";
      }
      Notification(errCode);
      return null;
    case SCAN_FAILED:
      if (language === 'vn') {
        errCode.description = "Không quét được";
      } else {
        errCode.description = "Can't scan";
      }
      Notification(errCode);
      return null;
    default:
      if (language === 'vn') {
        errCode.description = "Không xác định";
      } else {
        errCode.description = "Unknown";
      }
      Notification(errCode);
      return null;
  }
};

export const handleDeleteErrCode = ({ code, message, payload }) => {
  let errCode = {};
  if (language === 'vn') {
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
      return { code, message, payload };
    default:
      if (language === 'vn') {
        errCode.description = "Không xác định";
      } else {
        errCode.description = "Unknown";
      }
      Notification(errCode);
      return null;
  }
};
