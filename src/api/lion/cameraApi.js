/*
 * playback controller api
 */
import lionApi from "../lion/api";
import Notification from "../../components/vms/notification/Notification";
import {NOTYFY_TYPE} from "../../view/common/vms/Constant";
import {handleErrCode} from "./code";

const LION_ENDPOINT = '/lion/v1/playback/acceptRequest'
const lionSvcApi = {
    async checkPermissionForViewOnline(queryParams) {
        try {
            const response = await new Promise((resolve, reject) => {
                lionApi.axiosIns.post(LION_ENDPOINT, queryParams)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
            if (response && response.data) {
                const payload = handleErrCode(response.data)
                if (payload) {
                    return payload;
                }
            }
            return null;
        } catch (error) {
            Notification({
                type: NOTYFY_TYPE.warning,
                title: '',
                description: error.message
            });
            return null;
        }
    },
}

export default lionSvcApi
