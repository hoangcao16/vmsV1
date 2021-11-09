import serviceApi from './api'
import {handleErrCode, KPandaInternalServer} from "./code";
import Notification from "../../components/vms/notification/Notification";

const CHECK_PERMISSION_VIEW_ONLINE_ENDPOINT = '/panda/api/v1/view-online'
const pandaApi = {
    async checkPermissionForViewOnline(queryParams) {
        try {
            const response = await new Promise((resolve, reject) => {
                console.log('getPermissionForViewOnline:', queryParams)
                const headers = {
                    'Content-Type': 'application/json',
                    // 'x-domain': 'edsolabs',
                    // 'x-user-id': '8af70814-c110-49a9-89a2-eb0539d6201c'
                }
                serviceApi.axiosIns.post(CHECK_PERMISSION_VIEW_ONLINE_ENDPOINT, queryParams, {
                    headers: headers,
                })
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
            if (response && response.data) {
                const payload = handleErrCode(response.data)
                if (payload) {
                    return payload
                }
            }
            return null
        } catch (e) {
            Notification({
                type: "error",
                title: "Code:" + KPandaInternalServer.toString(),
                description: e.message,
            });
            return null
        }

    },
}

export default pandaApi
