import { reactLocalStorage } from 'reactjs-localstorage';
import controllerApi from '../../api/controller-api/api';
import Notification from '../../components/vms/notification/Notification';
import { history } from '../../history';

const BASE_URL = process.env.REACT_APP_BASE_URL;
const AI_URL = process.env.REACT_APP_AI_BASE_URL;


const AIService = {
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
      .get(`${AI_URL}${url}`, {
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

  async postRequestData(url, data) {
    const response = await controllerApi.axiosIns
      .post(`${AI_URL}${url}`, data)
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

  async putRequestData(url, data) {
    const response = await controllerApi.axiosIns
      .put(`${AI_URL}${url}`, data)
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
      .delete(`${AI_URL}${url}`)
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

export default AIService;
