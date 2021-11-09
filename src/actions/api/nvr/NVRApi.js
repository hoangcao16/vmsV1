import { isEmpty } from 'lodash-es';
import { responseCheckerErrorsController } from '../../function/MyUltil/ResponseChecker';
import MyService from '../service';

const NVRApi = {
  getAllNVR: async (data) => {
    let result;

    try {
      if (isEmpty(data)) {
        result = await MyService.getRequestData(
          `/cctv-controller-svc/api/v1/nvr`
        );
      } else {
        result = await MyService.getRequestData(
          `/cctv-controller-svc/api/v1/nvr?name=${data?.name}&page=${data?.page}&size=${data?.size}`
        );
      }
    } catch (error) {
      console.log('nvr error: ' + JSON.stringify(error));
    }

    if (responseCheckerErrorsController(result) === null) {
      return [];
    }

    return result.payload;
  },
  getNVRByUuid: async (uuid) => {
    let result;

    try {
      result = await MyService.getRequestData(
        `/cctv-controller-svc/api/v1/nvr/${uuid}`
      );
    } catch (error) {
      console.log('nvr error: ' + JSON.stringify(error));
    }

    if (responseCheckerErrorsController(result) === null) {
      return [];
    }

    return result.payload;
  },

  editNVR: async (nvrId, nvrPayload) => {
    let result;

    try {
      result = await MyService.putRequestData(
        `/cctv-controller-svc/api/v1/nvr/${nvrId}`,
        nvrPayload
      );
    } catch (error) {
      console.log(error);
    }

    if (responseCheckerErrorsController(result) === null) {
      return false;
    }
    return true;
  }
};

export default NVRApi;
