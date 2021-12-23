import UserApi from "../../actions/api/user/UserApi";
import Notification from "../../components/vms/notification/Notification";
import { reactLocalStorage } from "reactjs-localstorage";
const StatusForbidden = 605;

export const handleForbiddenCode = (forbiddenCodes, error) => {
  const language = reactLocalStorage.get("language");
  let errCode = {};
  if (language == "vn") {
    errCode = {
      type: "error",
      title: "Mã lỗi: " + StatusForbidden,
      description: "",
    };
  } else {
    errCode = {
      type: "error",
      title: "Code: " + StatusForbidden,
      description: "",
    };
  }
  let description = `${
    language == "vn"
      ? "Bạn không có quyền để thực hiện hành động này"
      : "You don't have permission to perform this action"
  }`;

  if (error) {
    description = `${
      language == "vn"
        ? "Xóa không thành công. Nhóm người dùng/Vai trò đang được sử dụng"
        : "Delete failed. User group/Role is in use."
    }`;
  }

  if (forbiddenCodes) {
    let data = {
      page: 0,
      size: 1000000,
      filter: "",
      lang: language
    };
    let forbiddenNames = [];
    UserApi.getAllPermission(data).then((result) => {
      if (result?.payload) {
        forbiddenCodes.map((code) => {
          const data = result?.payload.filter((r) => code === r.code);
          if (data && data.length > 0) {
            data.map((e) => forbiddenNames.push(e.name));
          }
        });
        if (forbiddenNames.length > 0) {
          description =
            `${
              language == "vn"
                ? "Bạn không có quyền "
                : "You don't have permission "
            }` + forbiddenNames.join(", ");
        }
        errCode.description = description;
        Notification(errCode);
      }
    });
  } else {
    errCode.description = description;
    Notification(errCode);
  }
  return null;
};
