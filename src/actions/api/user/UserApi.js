import { reactLocalStorage } from 'reactjs-localstorage';
import { handleErrCodeAuthZ, responseCheckerErrors } from '../../function/MyUltil/ResponseChecker';
import MyService from '../service';

const UserApi = {
  getAllUser: async (params) => {
    let result;

    try {
      result = await MyService.getRequestData(
        `/authz/api/v0/users`, params
      );
    } catch (error) {
      console.log(error);
    }
    if (handleErrCodeAuthZ(result) === null) {
      return [];
    }

    return result;
  },

  getAllPermission: async (data) => {
    let result;

    try {
      result = await MyService.getRequestData(
        `/authz/api/v0/permissions`, data
      );
    } catch (error) {
      console.log(error);
    }
    if (handleErrCodeAuthZ(result) === null) {
      return [];
    }

    return result;
  },
  getAllPermissionGroup: async () => {
    let result;

    try {
      result = await MyService.getRequestData(
        `/authz/api/v0/permission_groups`
      );
    } catch (error) {
      console.log(error);
    }
    if (handleErrCodeAuthZ(result) === null) {
      return [];
    }

    return result;
  },

  getDetailUser: async (params) => {
    let result;

    try {
      result = await MyService.getRequestData(
        `/authz/api/v0/users/${params?.uuid}`
      );
    } catch (error) {
      console.log(error);
    }
    if (handleErrCodeAuthZ(result) === null) {
      return [];
    }

    return result.payload;
  },

  getAllRole: async (params) => {
    let result;

    try {
      result = await MyService.getRequestData(
        `/authz/api/v0/roles?filter=${params?.filter}&page=${params?.page}&size=${params?.size}`
      );
    } catch (error) {
      console.log(error);
    }
    if (handleErrCodeAuthZ(result) === null) {
      return [];
    }

    return result;
  },
  getRoleByUuid: async (uuid) => {
    let result;

    try {
      result = await MyService.getRequestData(`/authz/api/v0/roles/${uuid}`);
    } catch (error) {
      console.log(error);
    }
    if (handleErrCodeAuthZ(result) === null) {
      return [];
    }

    return result.payload;
  },
  getAllGroup: async () => {
    let result;

    try {
      result = await MyService.getRequestData(`/authz/api/v0/groups`);
    } catch (error) {
      console.log(error);
    }
    if (handleErrCodeAuthZ(result) === null) {
      return [];
    }

    return result.payload;
  },

  getRoleByUser: async (params) => {
    let result;

    try {
      result = await MyService.getRequestData(
        `/authz/api/v0/authorization/get_permission?subject=user@${params?.uuid}`
      );
    } catch (error) {
      console.log(error);
    }
    if (handleErrCodeAuthZ(result) === null) {
      return [];
    }

    return result.payload;
  },

  getPermissionForUserLogin: async () => {
    let result;
    try {
      result = await MyService.getRequestData(
        `/authz/api/v0/authorization/get_permission`
      );
    } catch (error) {
      console.log(error);
    }
    if (handleErrCodeAuthZ(result) === null) {
      return [];
    }
    return result.payload;
  },
  getRoleByRoleCode: async (params) => {
    let result;

    try {
      result = await MyService.getRequestData(
        `/authz/api/v0/authorization/get_permission?subject=role@${params?.code}`
      );
    } catch (error) {
      console.log(error);
    }
    if (handleErrCodeAuthZ(result) === null) {
      return [];
    }

    return result.payload;
  },

  getGroupByUser: async (params) => {
    let result;

    try {
      result = await MyService.getRequestData(
        `/authz/api/v0/authorization/get_permission?subject=user@${params?.uuid}`
      );
    } catch (error) {
      console.log(error);
    }
    if (handleErrCodeAuthZ(result) === null) {
      return [];
    }

    return result.payload;
  },

  getUserByGroupUuid: async (params) => {
    let result;

    try {
      result = await MyService.getRequestData(
        `/authz/api/v0/authorization/get_permission?subject=user_g@${params}`
      );
    } catch (error) {
      console.log(error);
    }
    if (handleErrCodeAuthZ(result) === null) {
      return [];
    }

    return result?.payload;
  },

  register: async (data) => {
    let result = await MyService.postRequestData('/authz/register', data).catch(
      (err) => console.log(err)
    );
    if (result) {
      reactLocalStorage.setObject('accountLogin', result);
    }

    return result;
  },

  refreshToken: async (refreshToken) => {
    let result = await MyService.postRequestData('/authz/refresh', {
      token: refreshToken
    }).catch((err) => console.log(err));
    return result;
  },

  // refreshToken: async (data) => {
  //   let result = await MyService.postRequestData('/authz/login', data).catch(
  //     (err) => console.log(err)
  //   );
  //   if (result) {
  //     reactLocalStorage.setObject('user.info', result);
  //   }
  //   return result;
  // },

  getUserByToken: async (token) => {
    let result = await MyService.getRequestData(
      '/auth/getUserByToken',
      token
    ).catch((err) => console.log(err));

    return result;
  },

  update: async (data) => {
    let result;

    try {
      result = await MyService.putRequestData(
        `/authz/api/v0/users/${data?.uuid}`,
        { status: data?.status }
      );
    } catch (error) {
      console.log(error);
    }

    if (handleErrCodeAuthZ(result) === null) {
      return false;
    }
    return true;
  },

  logout: async () => {
    let result;

    try {
      result = await MyService.postRequestData(`/authz/logout`);
    } catch (error) {
      console.log(error);
    }

    if (!handleErrCodeAuthZ(result)) {
      return false;
    }
    return true;
  },

  resetPassword: async (params) => {
    let result;

    try {
      result = await MyService.postRequestData(`/authz/reset_password`, params);
    } catch (error) {
      console.log(error);
    }

    if (!handleErrCodeAuthZ(result)) {
      return false;
    }
    return true;
  },

  updatePassword: async (params) => {
    let result;

    try {
      result = await MyService.postRequestData(
        `/authz/update_password`,
        params
      );
    } catch (error) {
      console.log(error);
    }

    if (!handleErrCodeAuthZ(result)) {
      return false;
    }
    return true;
  },
  changePassword: async (params) => {
    let result;

    try {
      result = await MyService.getRequestData(`/authz/change_password`, params);
    } catch (error) {
      console.log(error);
    }

    if (!handleErrCodeAuthZ(result)) {
      return false;
    }
    return true;
  },

  deleteGroup: async (groupUuid) => {
    let result;

    try {
      result = await MyService.deleteRequestData(
        `/authz/api/v0/groups/${groupUuid}`
      );
    } catch (error) {
      console.log(error);
    }

    if (handleErrCodeAuthZ(result) === null) {

      return false;
    }
    return true;
  },
  deleteRoles: async (rolesUuid) => {
    let result;

    try {
      result = await MyService.deleteRequestData(
        `/authz/api/v0/roles/${rolesUuid}`
      );
    } catch (error) {
      console.log(error);
    }

    if (handleErrCodeAuthZ(result) === null) {
      return false;
    }
    return true;
  },

  updateUser: async (uuid, payload) => {
    let result;

    try {
      result = await MyService.putRequestData(
        `/authz/api/v0/users/${uuid}`,
        payload
      );
    } catch (error) {
      console.log(error);
    }

    if (handleErrCodeAuthZ(result) === null) {
      return false;
    }
    return true;
  },

  deleteUser: async (uuid) => {
    let result;
    try {
      result = await MyService.deleteRequestData(`/authz/api/v0/users/${uuid}`);
    } catch (error) {
      console.log(error);
    }

    if (handleErrCodeAuthZ(result) === null) {
      return false;
    }
    return true;
  },

  createdUser: async (payload) => {
    let result;

    try {
      result = await MyService.postRequestData('/authz/api/v0/users', payload);
    } catch (error) {
      console.log(error);
    }

    if (handleErrCodeAuthZ(result) === null) {
      return [];
    }
    return result?.payload;
  },
  createdGroup: async (payload) => {
    let result;

    try {
      result = await MyService.postRequestData('/authz/api/v0/groups', payload);
    } catch (error) {
      console.log(error);
    }

    if (handleErrCodeAuthZ(result) === null) {
      return [];
    }
    return result?.payload;
  },
  createdRoles: async (payload) => {
    let result;

    try {
      result = await MyService.postRequestData('/authz/api/v0/roles', payload);
    } catch (error) {
      console.log(error);
    }

    if (handleErrCodeAuthZ(result) === null) {
      return [];
    }
    return result?.payload;
  },

  setRole: async (payload) => {
    let result;

    try {
      result = await MyService.postRequestData(
        '/authz/api/v0/roles/set',
        payload
      );
    } catch (error) {
      console.log(error);
    }

    if (handleErrCodeAuthZ(result) === null) {
      return [];
    }
    return result?.payload;
  },
  addMemberInGroups: async (payload) => {
    let result;

    try {
      result = await MyService.postRequestData(
        '/authz/api/v0/groups/set',
        payload
      );
    } catch (error) {
      console.log(error);
    }
    if (handleErrCodeAuthZ(result) === null) {
      return false;
    }
    return true;
  },

  removeRole: async (payload) => {
    let result;

    try {
      result = await MyService.postRequestData(
        '/authz/api/v0/roles/remove',
        payload
      );
    } catch (error) {
      console.log(error);
    }

    if (handleErrCodeAuthZ(result) === null) {
      return [];
    }
    return result?.payload;
  },
  setGroup: async (payload) => {
    let result;

    try {
      result = await MyService.postRequestData(
        '/authz/api/v0/groups/set',
        payload
      );
    } catch (error) {
      console.log(error);
    }

    if (handleErrCodeAuthZ(result) === null) {
      return [];
    }
    return result?.payload;
  },

  setGroupForUser: async (payload) => {
    let result;

    try {
      result = await MyService.postRequestData(
        '/authz/api/v0/users/set_groups',
        payload
      );
    } catch (error) {
      console.log(error);
    }

    if (handleErrCodeAuthZ(result) === null) {
      return [];
    }

    return result.payload;
  },
  setRoleForUser: async (payload) => {
    let result;

    try {
      result = await MyService.postRequestData(
        '/authz/api/v0/users/set_roles',
        payload
      );
    } catch (error) {
      console.log(error);
    }

    if (handleErrCodeAuthZ(result) === null) {
      return [];
    }

    return result.payload;
  },

  removeGroup: async (payload) => {
    let result;

    try {
      result = await MyService.postRequestData(
        '/authz/api/v0/groups/remove',
        payload
      );
    } catch (error) {
      console.log(error);
    }

    if (handleErrCodeAuthZ(result) === null) {
      return [];
    }
    return result?.payload;
  },

  removeUserInGroup: async (data) => {
    let result;

    try {
      result = await MyService.postRequestData(`/authz/api/v0/groups/remove`, {
        user_uuid: data?.user_uuid,
        group_uuid: data?.group_uuid
      });
    } catch (error) {
      console.log(error);
    }

    if (handleErrCodeAuthZ(result) === null) {
      return false;
    }
    return true;
  }
};

export default UserApi;
