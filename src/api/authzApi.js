import {
    axiosAuthzInstance,
} from '../boot/axios';

export const authzApi = {
    login: (data) => {
       return axiosAuthzInstance.request({
            url: `${process.env.REACT_APP_API_VMSGW}/authz/login`,
            method: 'POST',
            data
        })
    },

    logout: () =>
        axiosAuthzInstance.request({
            url: '/authz/logout',
            method: 'POST',
        }),
    me: () =>
        axiosAuthzInstance.request({
            url: `${process.env.REACT_APP_API_VMSGW}/authz/api/v0/me`,
            method: 'GET',
        }),
    getAllUsers: () =>
        axiosAuthzInstance.request({
            url: `${process.env.REACT_APP_API_VMSGW}/authz/api/v0/getAllUsers`,
            method: 'GET',
        }),

};
