import { message } from 'antd';
import axios from 'axios';
import _uniqueId from 'lodash/uniqueId';
import { getToken, refreshToken, setUserData } from '../../../api/token';
import { history } from '../../../history';
import Notification from "../../../components/vms/notification/Notification";
import { NOTYFY_TYPE } from "../../../view/common/vms/Constant";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL || 'http://10.0.0.62:10001',
});

const axiosAuthzInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL || 'http://10.0.0.62:10001',
});

const axiosCoreInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL || 'http://10.0.0.62:10001',
});

const axiosCamproxyInstance = axios.create({
  baseURL: process.env.REACT_APP_CAMPROXY_URL || 'http://10.0.0.64:8082',
});

const axiosCamproxyCtrlInstance = axios.create({
  baseURL: process.env.REACT_APP_CAMPROXY_CTRL_URL || 'http://10.0.0.62:10001',
});

const axiosPlaybackInstance = axios.create({
  baseURL: process.env.REACT_APP_PLAYBACK_URL || 'http://10.0.0.63:18602',
});

const axiosLionInstance = axios.create({
  baseURL: process.env.REACT_APP_LION_URL || 'http://10.0.0.62:10001',
});

const axiosCheetahInstance = axios.create({
  baseURL: process.env.REACT_APP_CHEETAH_URL || 'http://10.0.0.62:10001',
});

const axiosGoogleServiceInstance = axios.create({
  baseURL: process.env.API_GOOGLE_MODULE,
});

const axiosPTZInstance = axios.create({
  baseURL: process.env.REACT_APP_PTZ_URL || 'http://10.0.0.62:9933',
});

export {
  axiosPTZInstance,
  axiosInstance,
  axiosCoreInstance,
  axiosAuthzInstance,
  axiosGoogleServiceInstance,
  axiosCamproxyInstance,
  axiosCamproxyCtrlInstance,
  axiosLionInstance,
  axiosCheetahInstance
};

let subscribers = [];

function onAccessTokenFetched(accessToken) {
  subscribers = this.subscribers.filter((callback) => callback(accessToken));
}

function addSubscriber(callback) {
  subscribers.push(callback);
}

export function registerResponseInterceptor(axiosInstance) {
  axiosInstance.interceptors.response.use(
    (response) => {
      //Dont have permission
      if (response && response.status === 200 && response.data.code == 403) {
        const notifyMess = {
          type: 'error',
          title: '',
          description: 'Bạn không có quyền để thực hiện hành động này'
        };
        Notification(notifyMess);
        return null;
      }
      if (response && response.status && response.data) {
        if (response.data.code == 600 && response.config.url.endsWith("/authz/refresh")) {
          const userDataStr = localStorage.getItem("user");
          const userData = JSON.parse(userDataStr)
          let user = JSON.stringify({
            token: response.data?.accessToken,
            refreshToken: response.data?.refreshToken,
            email: userData?.email,
            userUuid: userData?.userUuid,
            avatar_file_name: response.data?.avatar_file_name
          });

          setUserData(user);
        }
      }
      return response;
    },
    (error) => {
      const { config, response } = error;
      const originalRequest = config;
      if (response && response.status === 401 && response.data.code == 178) {
        refreshToken()
          .then((r) => {
            if (r.data == null) {
              history.push('/pages/login');
              return
            }
            if (r.data && r.data.code != 600) {
              history.push('/pages/login');
              return
            }
            if (r.data && r.data.accessToken) {
              const userDataStr = localStorage.getItem("user");
              const userData = JSON.parse(userDataStr)
              let data = JSON.stringify({
                token: r.data.accessToken,
                refreshToken: r.data.refreshToken,
                email: userData?.email,
                userUuid: userData?.userUuid,
                avatar_file_name: r.data?.avatar_file_name
              });
              setUserData(data);
              onAccessTokenFetched(r.data.accessToken);
            }

          })
          .catch((err) => {
            history.push('/pages/login');
            return;
          });
        const retryOriginalRequest = new Promise((resolve) => {
          addSubscriber((accessToken) => {
            originalRequest.headers.Authorization = `${accessToken}`;
            resolve(this.axiosIns(originalRequest));
          });
        });
        return retryOriginalRequest;
      } else if (response && response.status === 401) {
        history.push('/pages/login');
        return;
      } else if (response && response.status === 406) {
        Notification({
          type: NOTYFY_TYPE.warning,
          title: '',
          description: 'Bạn không có quyền để thực hiện hành động này'
        });
      } else {
        // if (response && response.data && response.data.message) 
        // {
        //   Notification({
        //     type: 'error',
        //     title: '',
        //     description: 'Lỗi hệ thống'
        //   });
        // }
      }
      return Promise.reject(error);
    }
  );
}

export function registerRequestInterceptor(axiosIns) {
  axiosIns.interceptors.request.use(
    (config) => {
      // Get token from
      const accessToken = getToken();
      if (accessToken) {
        config.headers.Authorization = `${accessToken}`;
        config.headers.requestId = _uniqueId('cctv');
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
}
