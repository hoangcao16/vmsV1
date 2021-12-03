import { handleErrCodeAI } from '../../function/MyUltil/ResponseChecker';
import AIService from '../ai-service';

const AIConfigRectApi = {
  getAllConfigRect: async (params) => {

    let result;

    try {
      result = await AIService.getRequestData(
        `/api/v1/config_rect/${params?.cameraUuid}?type=${params?.type}`
      );

    } catch (error) {
      console.log(JSON.stringify(error));
    }

    if (handleErrCodeAI(result) === null) {
      return [];
    }

    return result.payload;
  },
  addConfigRect: async (payload) => {
    let result;

    try {
      result = await AIService.postRequestData(
        "/api/v1/config_schedule",
        payload
      );
    } catch (error) {
      console.log(error);
    }
    if (handleErrCodeAI(result) === null) {
      return false;
    }
    return true;
  },
  editConfigRectByUuid: async (uuid, payload) => {
    let result;

    try {
      result = await AIService.putRequestData(
        `/api/v1/config_schedule/${uuid}`,
        payload
      );
    } catch (error) {
      console.log(error);
    }

    if (handleErrCodeAI(result) === null) {
      return false;
    }
    return true;
  },
  copyConfigRect: async (uuid, payload) => {
    let result;

    try {
      result = await AIService.postRequestData(
        `/api/v1/config_schedule/${uuid}/copy`,
        payload
      );
    } catch (error) {
      console.log(error);
    }
    if (handleErrCodeAI(result) === null) {
      return false;
    }
    return true;
  },
  deleteConfigSchedule: async (uuid) => {
    let result;
    try {
      result = await AIService.deleteRequestData(
        `/api/v1/config_schedule/${uuid}`
      );
    } catch (error) {
      console.log(error);
    }

    if (handleErrCodeAI(result) === null) {
      return false;
    }
    return true;
  },
};

export default AIConfigRectApi;
