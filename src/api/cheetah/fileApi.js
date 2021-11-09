/*
 * nvr controller api
 */
import cheetahApi from "../cheetah/api";
import {handleErrCode} from "./code";
import Notification from "../../components/vms/notification/Notification";
import {NOTYFY_TYPE} from "../../view/common/vms/Constant";

const CHEETAH_ENDPOINT = '/cheetah/v1/nvr'
const cheetahSvcApi = {
    //Capture from mp4 file
    async captureFile(queryParams) {
        try {
            const response = await new Promise((resolve, reject) => {
                cheetahApi.axiosIns.post(CHEETAH_ENDPOINT + '/captureFile', queryParams)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
            if (response && response.data) {
                return handleErrCode(response.data);
            }
        }catch (e) {
            Notification({
                type: NOTYFY_TYPE.warning,
                title: 'File lưu trữ',
                description: e.toString()
            });
            return null;
        }
        return null;
    },

    //Capture online
    async startCaptureStream(queryParams) {
        try {
            const response = await new Promise((resolve, reject) => {
                cheetahApi.axiosIns.post(CHEETAH_ENDPOINT + '/startCaptureStream', queryParams)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
            if (response && response.data) {
                return handleErrCode(response.data);
            }
        }catch (e) {
            Notification({
                type: NOTYFY_TYPE.warning,
                title: 'Playback',
                description: e.toString()
            });
            return null;
        }
        return null;
    },

    async stopCaptureStream(queryParams) {
        try {
            const response = await new Promise((resolve, reject) => {
                cheetahApi.axiosIns.post(CHEETAH_ENDPOINT + '/stopCaptureStream', queryParams)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
            if (response && response.data) {
                return handleErrCode(response.data);
            }
        }catch (e) {
            Notification({
                type: NOTYFY_TYPE.warning,
                title: 'Playback',
                description: e.toString()
            });
            return null;
        }
        return null;
    },

    //Capture from playback
    async capturePlayback(queryParams) {
        try {
            const response = await new Promise((resolve, reject) => {
                cheetahApi.axiosIns.post(CHEETAH_ENDPOINT + '/capturePlayback', queryParams)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
            if (response && response.data) {
                return handleErrCode(response.data);
            }
        }catch (e) {
            Notification({
                type: NOTYFY_TYPE.warning,
                title: 'Playback',
                description: e.toString()
            });
            return null;
        }
        return null;
    },

}

export default cheetahSvcApi;
