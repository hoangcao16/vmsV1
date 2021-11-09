import controllerApi from './api';
import {handleErrCode} from "./code";

const PTZCONFIG_ENDPOINT = '/ptz-man';
const ptzConfigApi = {
    async getAllPTZConfig(queryParams) {
        return new Promise((resolve, reject) => {
            try {
                const response = controllerApi.axiosIns
                    .get(`${PTZCONFIG_ENDPOINT}/profiles`, {params: queryParams})
                    .then((response) => resolve(response))
                    .catch((error) => reject(error));
                if (response && response.data) {
                    const payload = handleErrCode(response.data)
                    if (payload) {
                        return payload
                    }
                }
                return null
            } catch (e) {
                return null
            }
        });
    },
    postCreatePTZConfig(body) {
        return new Promise((resolve, reject) => {
            try {
                const response = controllerApi.axiosIns
                    .post(`${PTZCONFIG_ENDPOINT}/create-profile`, body)
                    .then((response) => resolve(response))
                    .catch((error) => reject(error));
                if (response && response.data) {
                    const payload = handleErrCode(response.data)
                    if (payload) {
                        return payload
                    }
                }
                return null
            } catch (e) {
                return null
            }
        });
    },
};
