import { reactLocalStorage } from 'reactjs-localstorage';
import controllerApi from '../../api/controller-api/api';
import Notification from '../../components/vms/notification/Notification';
import { history } from '../../history';
import axios from "axios";
import _uniqueId from "lodash/uniqueId";
import {NOTYFY_TYPE} from "../../view/common/vms/Constant";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const getHeadersDownload = () => {
  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json; charset=utf-8'
  };
  let user = reactLocalStorage.getObject('user', null);
  if (user !== null) {
    let token = user.token;
    if (token) {
      headers.Authorization = token;
    }
  }
  return headers;
};

const MyService = {
  _checkResponse(response) {
    if (
      response.data.code === 11 ||
      response.data.code === 176 ||
      response.data.code === 177 ||
      response.data.code === 178 ||
      response.data.code === 179 ||
      response.data.code === 180
    ) {
      reactLocalStorage.remove('user');
      history.push('/pages/login');
      return false;
    }
    return true;
  },

  async getRequestData(url, queryParams) {
    const response = await controllerApi.axiosIns
      .get(`${BASE_URL}${url}`, {
        params: queryParams
      })

      .catch((error) => {
        const notifyMess = {
          type: 'error',
          title: '',
          description: error.response.data.errors.message
        };
        Notification(notifyMess);
      });

    if (response && response.data) {
      return response.data;
    }
    return [];
  },

  async getRequestDataBlob(url, data) {
    return await axios
        .get(BASE_URL + url,
            {
              params: data,
              headers: {
                ...getHeadersDownload(),
                requestId: _uniqueId('cctv')
              },
              responseType: 'blob',
            }
        )
        .then((response) => {
          if (response && response?.data) {
            let check = this._checkResponse(response);
            if (!check) {
              return;
            }
            return response.data;
          }
        })
        .catch((e) => {
          Notification({
            type: NOTYFY_TYPE.warning,
            title: '',
            description: e.toString()
          });
          return {};
        });
  },

  async postRequestData(url, data) {
    const response = await controllerApi.axiosIns
      .post(`${BASE_URL}${url}`, data)
      .catch((error) => {
        const notifyMess = {
          type: 'error',
          title: '',
          description: error.response.data.error
        };
        Notification(notifyMess);
      });
    if (response && response?.data) {
      let check = this._checkResponse(response);
      if (!check) {
        return;
      }
      return response.data;
    }
  },

  async postRequestDataBlob(url, data) {
    return await axios
        .post(BASE_URL + url, data,
            {
              headers: {
                ...getHeadersDownload(),
                requestId: _uniqueId('cctv')
              },
              responseType: 'blob',
            }
        )
        .then((response) => {
          if (response && response?.data) {
            let check = this._checkResponse(response);
            if (!check) {
              return;
            }
            return response.data;
          }
        })
        .catch((e) => {
          Notification({
            type: NOTYFY_TYPE.warning,
            title: '',
            description: e.toString()
          });
          return {};
        });
  },

  async putRequestData(url, data) {
    const response = await controllerApi.axiosIns
      .put(`${BASE_URL}${url}`, data)
      .catch((error) => {
        const notifyMess = {
          type: 'error',
          title: '',
          description: error.response.data.errors.message
        };
        Notification(notifyMess);
      });

    if (response && response?.data) {
      let check = this._checkResponse(response);
      if (!check) {
        return;
      }
      return response.data;
    }
  },

  async deleteRequestData(url) {
    const response = await controllerApi.axiosIns
      .delete(`${BASE_URL}${url}`)
      .catch((error) => {
        const notifyMess = {
          type: 'error',
          title: '',
          description: error.response.data.errors.message
        };
        Notification(notifyMess);
      });

    if (response && response?.data) {
      let check = this._checkResponse(response);
      if (!check) {
        return;
      }
      return response.data;
    }
  }
};

export default MyService;
