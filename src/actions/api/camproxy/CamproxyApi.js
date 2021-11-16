import { isEmpty } from 'lodash-es';
import { responseCheckerErrorsController } from '../../function/MyUltil/ResponseChecker';
import MyService from '../service';

const CamproxyApi = {
  getAllCamproxy: async (data) => {
    let result;

    try {
      if (isEmpty(data)) {
        result = await MyService.getRequestData(
          `/cctv-controller-svc/api/v1/camproxy`
        );
      } else {
        result = await MyService.getRequestData(
          `/cctv-controller-svc/api/v1/camproxy?name=${data?.name}&page=${data?.page}&size=${data?.size}`
        );
      }
    } catch (error) {
      console.log(error);
    }

    if (responseCheckerErrorsController(result) === null) {
      return [];
    }

    return result.payload;
  },
  getCamproxyByUuid: async (uuid) => {
    let result;

    try {
      result = await MyService.getRequestData(
        `/cctv-controller-svc/api/v1/camproxy/${uuid}`
      );
    } catch (error) {
      console.log(error);
    }

    if (responseCheckerErrorsController(result) === null) {
      return [];
    }

    return result.payload;
  },

  editCamproxy: async (camproxyId, camproxyPayload) => {
    let result;

    try {
      result = await MyService.putRequestData(
        `/cctv-controller-svc/api/v1/camproxy/${camproxyId}`,
        camproxyPayload
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

export default CamproxyApi;
