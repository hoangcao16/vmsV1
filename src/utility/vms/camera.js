import { reactLocalStorage } from "reactjs-localstorage";
import pandaApi from "../../api/camproxy-ctrl/cameraApi";
import Notification from "../../components/vms/notification/Notification";
import { NOTYFY_TYPE } from "../../view/common/vms/Constant";


const language = reactLocalStorage.get("language");
const getServerCamproxyForPlay = async (camUuid,mode) => {
  try {
    const data = await pandaApi.checkPermissionForViewOnline({
      cameraUuid: camUuid,
      mode
    });
    return data;
  } catch (err) {
    if (language == "vn") {
      Notification({
        type: NOTYFY_TYPE.warning,
        title: "Xem trực tiếp",
        description:
          "Bạn không có quyền để xem trực tiếp Camera này. Liên hệ quản trị viên. " +
          err.toString(),
      });
    } else {
      Notification({
        type: NOTYFY_TYPE.warning,
        title: "View online",
        description:
          "You don't have permission to view Camera online. Please contact administrator. " +
          err.toString(),
      });
    }
    return null;
  }
};

export default getServerCamproxyForPlay;
