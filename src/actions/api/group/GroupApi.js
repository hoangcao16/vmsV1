import {
  handleErrCodeAuthZ
} from '../../function/MyUltil/ResponseChecker';
import MyService from '../service';

const GroupApi = {

  getAllGroup: async (params) => {
    let result;
    const queryParams = {

      filter: params?.filter,
      page: params?.page,
      size: params?.size

    }

    try {
      result = await MyService.getRequestData(
        `/authz/api/v0/groups`, queryParams
      );
    } catch (error) {
      console.log(error);
    }

    console.log('result: ', result);
    if (handleErrCodeAuthZ(result) === null) {
      return [];
    }

    return result;
  },

  getGroupByUuid: async (uuid) => {
    let result;

    try {
      result = await MyService.getRequestData(`/authz/api/v0/groups/${uuid}`);
    } catch (error) {
      console.log('nvr error: ' + JSON.stringify(error));
    }

    if (handleErrCodeAuthZ(result) === null) {
      return [];
    }

    return result.payload;
  }
};

export default GroupApi;
