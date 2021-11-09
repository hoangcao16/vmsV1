import Notification from "../../components/vms/notification/Notification";
import {NOTYFY_TYPE} from "../../view/common/vms/Constant";
import {handleErrCode} from "./code";
import authzApi from './api'
import {getRefreshToken} from "../token";

const REFRESH_TOKEN_ENDPOINT = '/authz/refresh'
const tokenApi = {
    async refreshToken() {
        try {
            const oldRefreshToken = getRefreshToken()
            const request = {
                token: oldRefreshToken
            }
            const response = await new Promise((resolve, reject) => {
                authzApi.axiosIns.post(REFRESH_TOKEN_ENDPOINT, request)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
            if (response && response.data) {
              if(response.data.code == 600){
                  return []
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

export default tokenApi
