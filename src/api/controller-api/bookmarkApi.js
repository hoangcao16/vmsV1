import controllerApi from './api';
import { handleErrCode } from "./code";

const BOOKMARK_ENDPOINT = '/cctv-controller-svc/api/v1/bookmark';
const bookmarkApi = {
    async getAll(queryParams) {
        const response = await new Promise((resolve, reject) => {
            controllerApi.axiosIns
                .get(BOOKMARK_ENDPOINT, {
                    params: queryParams,
                })
                .then((response) => resolve(response))
                .catch((error) => reject(error));
        });
        if (response && response.data) {
            return handleErrCode(response.data);
        }
        return null;
    },
    async get(uuid) {
        const response = await new Promise((resolve, reject) => {
            controllerApi.axiosIns
                .get(`${BOOKMARK_ENDPOINT}/${uuid}`)
                .then((response) => resolve(response))
                .catch((error) => reject(error));
        });
        if (response && response.data) {
            return handleErrCode(response.data);
        }
        return null;
    },
    async update(cam, uuid) {
        const response = await new Promise((resolve, reject) => {
            controllerApi.axiosIns
                .put(`${BOOKMARK_ENDPOINT}/${uuid}`, cam)
                .then((response) => resolve(response))
                .catch((error) => reject(error));
        });
        if (response && response.data) {
            return handleErrCode(response.data);
        }
        return null;
    },
    async createNew(record) {
        const response = await new Promise((resolve, reject) => {
            controllerApi.axiosIns
                .post(BOOKMARK_ENDPOINT, record)
                .then((response) => resolve(response))
                .catch((error) => reject(error));
        });
        if (response && response.data) {
            return handleErrCode(response.data);
        }
        return null;
    },
    async delete(uuid) {
        const response = await new Promise((resolve, reject) => {
            controllerApi.axiosIns
                .delete(`${BOOKMARK_ENDPOINT}/${uuid}`)
                .then((response) => resolve(response))
                .catch((error) => reject(error));
        });
        if (response && response.data) {
            return handleErrCode(response.data);
        }
        return null;
    },
    async setDefault(uuid) {
        const response = await new Promise((resolve, reject) => {
            controllerApi.axiosIns
                .put(`${BOOKMARK_ENDPOINT}/${uuid}`, {
                    defaultBookmark: 1,
                })
                .then((response) => resolve(response))
                .catch((error) => reject(error));
        });
        if (response && response.data) {
            return handleErrCode(response.data);
        }
        return null;
    },
    async getDefault() {
        const response = await new Promise((resolve, reject) => {
            controllerApi.axiosIns
                .get(BOOKMARK_ENDPOINT, {
                    params: {
                        defaultBookmark: 1,
                    },
                })

                .then((response) => resolve(response))
                .catch((error) => reject(error));
        });
        if (response && response.data) {
            return handleErrCode(response.data);
        }
        return null;
    },
};

export default bookmarkApi;
