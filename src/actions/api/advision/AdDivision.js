import { responseCheckerErrorsController } from '../../function/MyUltil/ResponseChecker';
import MyService from '../service';

const AdDivisionApi = {
  getAllAdDivision: async (data) => {
    let result;

    try {
      result = await MyService.getRequestData(
        `/cctv-controller-svc/api/v1/administrative_units?name=${data?.name}`
      );
    } catch (error) {
      console.log(error);
    }

    if (responseCheckerErrorsController(result) === null) {
      return [];
    }

    return result.payload;
  },
  getAdDivisionByUuid: async (uuid) => {
    let result;

    try {
      result = await MyService.getRequestData(
        `/cctv-controller-svc/api/v1/administrative_units/${uuid}`
      );
    } catch (error) {
      console.log(error);
    }

    if (responseCheckerErrorsController(result) === null) {
      return [];
    }

    return result.payload;
  },
  editAdDivision: async (uuid, advisionPayload) => {
    let result;

    try {
      result = await MyService.putRequestData(
        `/cctv-controller-svc/api/v1/administrative_units/${uuid}`,
        advisionPayload
      );
    } catch (error) {
      console.log(error);
    }

    if (responseCheckerErrorsController(result) === null) {
      return false;
    }
    return true;
  },

  addAdDivision: async (adDivisionPayload) => {
    let result;

    try {
      result = await MyService.postRequestData(
        '/cctv-controller-svc/api/v1/administrative_units',
        adDivisionPayload
      );
    } catch (error) {
      console.log(error);
    }
    if (responseCheckerErrorsController(result) === null) {
      return false;
    }
    return true;
  },
  delete: async (uuid) => {
    let result;

    try {
      result = await MyService.deleteRequestData(
        `/cctv-controller-svc/api/v1/administrative_units/${uuid}`
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

export default AdDivisionApi;
