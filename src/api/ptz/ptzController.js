import controllerApi from "./api";
import { handleDeleteErrCode, handleErrCode } from "./code";

const PTZCONTROLLER_ENDPOINT = "ptz-ctrl/api/v1";
const ptzControllerApi = {
    async postPan(body) {
        const response = await new Promise((resolve, reject) => {
            try {
                controllerApi.axiosIns
                    .post(`${PTZCONTROLLER_ENDPOINT}/pan`, body)
                    .then((response) => resolve(response))
                    .catch((error) => reject(error));

            } catch (e) {
                return null
            }
        });
        if (response && response.data) {
            const payload = handleErrCode(response.data)
            if (payload) {
                return payload
            }
        }
        return null
    },
    async postTilt(body) {
        const response = await new Promise((resolve, reject) => {
            try {
                controllerApi.axiosIns
                    .post(`${PTZCONTROLLER_ENDPOINT}/tilt`, body)
                    .then((response) => resolve(response))
                    .catch((error) => reject(error));

            } catch (e) {
                return null
            }
        });

        if (response && response.data) {
            const payload = handleErrCode(response.data)
            if (payload) {
                return payload
            }
        }
        return null
    },
    async postZoom(body) {
        const response = await new Promise((resolve, reject) => {
            try {
                controllerApi.axiosIns
                    .post(`${PTZCONTROLLER_ENDPOINT}/zoom`, body)
                    .then((response) => resolve(response))
                    .catch((error) => reject(error));
            } catch (e) {
                return null
            }
        });
        if (response && response.data) {
            const payload = handleErrCode(response.data)
            if (payload) {
                return payload
            }
        }
        return null
    },
    async postCallPreset(body) {
        const response = await new Promise((resolve, reject) => {
            try {
                controllerApi.axiosIns
                    .post(`${PTZCONTROLLER_ENDPOINT}/call-preset`, body)
                    .then((response) => resolve(response))
                    .catch((error) => reject(error));

            } catch (e) {
                return null
            }
        });

        if (response && response.data) {
            const payload = handleErrCode(response.data)
            if (payload) {
                return payload
            }
        }
        return null
    },
    async postSetPreset(body) {
        const response = await new Promise((resolve, reject) => {
            try {
                controllerApi.axiosIns
                    .post(`${PTZCONTROLLER_ENDPOINT}/set-preset`, body)
                    .then((response) => resolve(response))
                    .catch((error) => reject(error));
            } catch (e) {
                return null
            }
        });
        if (response && response.data) {
            const payload = handleErrCode(response.data)
            if (payload) {
                return payload
            }
        }
        return null;
    },
    async postDeletePreset(body) {
        const response = await new Promise((resolve, reject) => {
            try {
                controllerApi.axiosIns
                    .post(`${PTZCONTROLLER_ENDPOINT}/delete-preset`, body)
                    .then((response) => resolve(response))
                    .catch((error) => reject(error));
            } catch (e) {
                return null
            }
        });
        if (response && response.data) {
            const data = handleDeleteErrCode(response.data)
            if (data) {
                return data
            }
        }
        return null;
    },
    async postRenamePreset(body) {
        const response = await new Promise((resolve, reject) => {
            try {
                controllerApi.axiosIns
                    .post(`${PTZCONTROLLER_ENDPOINT}/rename-preset`, body)
                    .then((response) => resolve(response))
                    .catch((error) => reject(error));

            } catch (e) {
                return null
            }
        });
        if (response && response.data) {
            const payload = handleErrCode(response.data)
            if (payload) {
                return payload
            }
        }
        return null
    },
    async getAllPreset(queryParams) {
        const response = await new Promise((resolve, reject) => {
            try {
                controllerApi.axiosIns
                    .get(`${PTZCONTROLLER_ENDPOINT}/get-all-preset`, {
                        params: queryParams,
                    })
                    .then((response) => resolve(response))
                    .catch((error) => reject(error));

            } catch (e) {
                return reject(e)
            }
        });
        if (response && response.data) {
            const payload = handleErrCode(response.data)
            if (payload) {
                return payload
            }
        }
        return null
    },
    async postCallPresetTour(body) {
        const response = await new Promise((resolve, reject) => {
            try {
                controllerApi.axiosIns
                    .post(`${PTZCONTROLLER_ENDPOINT}/call-preset-tour`, body)
                    .then((response) => resolve(response))
                    .catch((error) => reject(error));

            } catch (e) {
                return null
            }
        });
        if (response && response.data) {
            const payload = handleErrCode(response.data)
            if (payload) {
                return payload
            }
        }
        return null
    },
    async postSetPresetTour(body) {
        const response = await new Promise((resolve, reject) => {
            try {
                controllerApi.axiosIns
                    .post(`${PTZCONTROLLER_ENDPOINT}/set-preset-tour`, body)
                    .then((response) => resolve(response))
                    .catch((error) => reject(error));

            } catch (e) {
                return null
            }
        });
        if (response && response.data) {
            const payload = handleErrCode(response.data)
            if (payload) {
                return payload
            }
        }
        return null
    },
    async postDeletePresetTour(body) {
        const response = await new Promise((resolve, reject) => {
            try {
                controllerApi.axiosIns
                    .post(`${PTZCONTROLLER_ENDPOINT}/delete-preset-tour`, body)
                    .then((response) => resolve(response))
                    .catch((error) => reject(error));

            } catch (e) {
                return null
            }
        });
        if (response && response.data) {
            const payload = handleErrCode(response.data)
            if (payload) {
                return payload
            }
        }
        return null
    },
    async postRenamePresetTour(body) {
        const response = await new Promise((resolve, reject) => {
            try {
                controllerApi.axiosIns
                    .post(`${PTZCONTROLLER_ENDPOINT}/rename-preset-tour`, body)
                    .then((response) => resolve(response))
                    .catch((error) => reject(error));

            } catch (e) {
                return null
            }
        });
        if (response && response.data) {
            const payload = handleErrCode(response.data)
            if (payload) {
                return payload
            }
        }
        return null
    },
    async getAllPresetTour(queryParams) {
        const response = await new Promise((resolve, reject) => {
            try {
                controllerApi.axiosIns
                    .get(`${PTZCONTROLLER_ENDPOINT}/get-all-preset-tour`, {
                        params: queryParams,
                    })
                    .then((response) => resolve(response))
                    .catch((error) => reject(error));

            } catch (e) {
                return null
            }
        });
        if (response && response.data) {
            const payload = handleErrCode(response.data)
            if (payload) {
                return payload
            }
        }
        return null
    },
};

export default ptzControllerApi;
