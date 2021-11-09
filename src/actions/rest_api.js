import axios from 'axios';
import { reactLocalStorage } from 'reactjs-localstorage';
import { history } from '../history';

const BASE_URI = process.env.REACT_APP_BASE_URL;

export default {
  DEFAULT_TIME_OUT: 300000,

  getHeaders() {
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
  },

  async get(url, params, tm) {
    if (tm === undefined || tm === null) {
      tm = this.DEFAULT_TIME_OUT;
    }
    console.log('GET ' + url);
    return await axios({
      method: 'get',
      url: BASE_URI + url,
      headers: this.getHeaders(),
      timeout: tm,
      params
    })
      .then((response) => {
        let chk = this._checkResponse(response);
        if (!chk) {
          return;
        }
        return response.data;
      })
      .catch((error) => {
        console.log('err: ' + error);
      });
  },

  post(url, params, fn, tm, loading) {
    if (tm === undefined || tm === null) {
      tm = this.DEFAULT_TIME_OUT;
    }
    axios
      .post(BASE_URI + url, params, {
        headers: this.getHeaders(),
        timeout: tm
      })
      .then((response) => {
        let chk = this._checkResponse(response);
        if (!chk) {
          return;
        }
        if (fn) {
          fn(response.data);
        }
      })
      .catch((error) => {

        let msg = 'Thao tác không thành công';
        let rs = {
          code: -1000,
          message: error.message || msg
        };
        fn(rs);
      })
      .finally(() => {
        if (loading !== undefined && loading) {
        }
      });
  },

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
  }
};
