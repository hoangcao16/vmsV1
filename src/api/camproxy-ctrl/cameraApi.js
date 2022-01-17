import Notification from "../../components/vms/notification/Notification";
import serviceApi from "./api";
import { handleErrCode, KPandaInternalServer } from "./code";

const CHECK_PERMISSION_VIEW_ONLINE_ENDPOINT = "/panda/api/v1/view-online";
const pandaApi = {
  async checkPermissionForViewOnline(queryParams) {
    try {
      const response = await new Promise((resolve, reject) => {
        const headers = {
          "Content-Type": "application/json",
        };
        serviceApi.axiosIns
          .post(CHECK_PERMISSION_VIEW_ONLINE_ENDPOINT, queryParams, {
            headers: headers,
          })
          .then((response) => resolve(response))
          .catch((error) => reject(error));
      });
      if (response && response.data) {
        const payload = handleErrCode(response.data);
        if (payload) {
          return payload;
        }
      }
      return null;
    } catch (e) {
      Notification({
        type: "error",
        title: "Code:" + KPandaInternalServer.toString(),
        description: e.message,
      });
      return null;
    }
  },
};

export default pandaApi;
