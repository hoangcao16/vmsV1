import axios from 'axios/index';
import _uniqueId from 'lodash/uniqueId';
import {reactLocalStorage} from 'reactjs-localstorage';
import {history} from '../../../history';
import Notification from "../../../components/vms/notification/Notification";
import {NOTYFY_TYPE} from "../../../view/common/vms/Constant";
import {handleErrCode} from "../../../api/controller-api/code";

const getHeaders = () => {
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

const getHeadersDownload = () => {
    let headers = {
        Accept: 'application/octet-stream',
        'Content-Type': 'application/octet-stream'
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

const getHeadersUpload = () => {
    let headers = {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
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

const getAuth = () => {
    let user = reactLocalStorage.getObject('user', null);
    if (user !== null) {
        let token = user.token;
        if (token) {
            return token;
        }
    }
    return null;
}
const BASE_URL = process.env.REACT_APP_BASE_FILE_URL;
const KFileReserveProxyOk = 1600;
const FileService = {
    _checkResponse(response) {
        if (response && response.status) {
            if (response.status === 200){
                if (response.data && response.data.code && response.data.code !== (KFileReserveProxyOk+'')){
                    Notification({
                        type: NOTYFY_TYPE.warning,
                        title: response.data.code.toString(),
                        description: response.data.message
                    });
                    return false;
                }
                return true;
            }
            return false;
        }
        return false;
    },

    async getRequestData(url, params) {
        return await axios({
            method: 'get',
            url: BASE_URL + url,
            headers: {
                ...getHeadersDownload(),
                requestId: _uniqueId('cctv')
            },
            responseType: 'blob',
            params: {
                ...params,
            }
        })
            .then((response) => {
                let check = this._checkResponse(response);
                if (!check) {
                    return {};
                }
                return response;
            })
            .catch((e) => {
                return {};
            });
    },

    async postRequestData(url, data) {
        return await axios
            .post(BASE_URL + url, data,
                {
                    headers: {
                        ...getHeadersUpload(),
                        requestId: _uniqueId('cctv')
                    }
                }
            )
            .then((response) => {
                let check = this._checkResponse(response);
                if (!check) {
                    return {};
                }
                return response;
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

    async putRequestData(url, data, token) {
        return await axios
            .put(BASE_URL + url, data, {
                headers: getHeaders(token)
            })
            .then((response) => {
                let check = this._checkResponse(response);
                if (!check) {
                    return null;
                }
                return response.data;
            })
            .catch((e) => {
                Notification({
                    type: NOTYFY_TYPE.warning,
                    title: 'File lưu trữ',
                    description: e.toString()
                });
                return null;
            });
    },

    async deleteRequestData(url, data) {
        return await axios
            .post(BASE_URL + url, data,
                {
                    headers: {
                        ...getHeaders(),
                        requestId: _uniqueId('cctv')
                    }
                }
            )
            .then((response) => {
                let check = this._checkResponse(response);
                if (!check) {
                    return null;
                }
                return response.data;
            })
            .catch((e) => {
                Notification({
                    type: NOTYFY_TYPE.warning,
                    title: 'File lưu trữ',
                    description: e.toString()
                });
                return null;
            });
    }
};

export default FileService;
