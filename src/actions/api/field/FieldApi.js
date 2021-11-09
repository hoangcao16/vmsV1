import { responseCheckerErrorsController } from '../../function/MyUltil/ResponseChecker';
import MyService from '../service';

const FieldApi = {
  getAllFeild: async (data) => {
    let result;
    try {
      result = await MyService.getRequestData(
        `/cctv-controller-svc/api/v1/event_fields?name=${data?.name}`
      );
    } catch (error) {
      console.log(error);
    }

    if (responseCheckerErrorsController(result) === null) {
      return [];
    }
    return result.payload;
  },
  getFieldByUuid: async (uuid) => {
    let result;
    try {
      result = await MyService.getRequestData(
        `/cctv-controller-svc/api/v1/event_fields/${uuid}`
      );
    } catch (error) {
      console.log(error);
    }

    if (responseCheckerErrorsController(result) === null) {
      return [];
    }

    return result.payload;
  },
  postNewField: async (fieldPayload) => {
    let result;
    try {
      result = await MyService.postRequestData(
        `/cctv-controller-svc/api/v1/event_fields/`,
        fieldPayload
      );
    } catch (error) {
      console.log(error);
    }
    if (responseCheckerErrorsController(result) === null) {
      return false;
    }
    return true;
  },
  putEditField: async (uuid, fieldPayload) => {
    let result;
    try {
      result = await MyService.putRequestData(
        `/cctv-controller-svc/api/v1/event_fields/${uuid}`,
        fieldPayload
      );
    } catch (error) {
      console.log(error);
    }
    if (responseCheckerErrorsController(result) === null) {
      return false;
    }
    return true;
  },
  deleteField: async (uuid) => {
    let result;
    try {
      result = await MyService.deleteRequestData(
        `/cctv-controller-svc/api/v1/event_fields/${uuid}`
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

export default FieldApi;
