import { handleErrCodeAI } from '../../function/MyUltil/ResponseChecker';
import AIService from '../ai-service';

const AIConfigRectApi = {
  getAllConfigRect: async (params) => {

    let result;

    try {
      result = await AIService.getRequestData(
        `/api/v1/config_rects/${params?.cameraUuid}?type=${params?.type}`
      );

    } catch (error) {
      console.log(JSON.stringify(error));
    }

    if (handleErrCodeAI(result) === null) {
      return [];
    }

    return result.payload;
  },
  getConfigRect: async (uuid) => {

    let result;

    try {
      result = await AIService.getRequestData(
        `/api/v1/config_rect/${uuid}`
      );

    } catch (error) {
      console.log(JSON.stringify(error));
    }

    if (handleErrCodeAI(result) === null) {
      return null;
    }

    return result.payload;
  },
  addConfigRect: async (payload) => {
    let result;

    try {
      result = await AIService.postRequestData(
        "/api/v1/config_rect",
        payload
      );
    } catch (error) {
      console.log(error);
    }
    if (handleErrCodeAI(result) === null) {
      return null;
    }
    return result.payload;
  },
  
  deleteConfigRect: async (uuid) => {
    let result;
    try {
      result = await AIService.deleteRequestData(
        `/api/v1/config_rect/${uuid}`
      );
    } catch (error) {
      console.log(error);
    }

    if (handleErrCodeAI(result) === null) {
      return false;
    }
    return true;
  },

  updateStausConfigRect: async (payload) => {
    let result;
    try {
      result = await AIService.putRequestData(
        "/api/v1/config_rect/status",
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
  editConfigRectName: async (payload) => {
    let result;

    try {
      result = await AIService.putRequestData(
        `/api/v1/config_rect/name`,
        payload
      );
    } catch (error) {
      console.log(error);
    }

    if (handleErrCodeAI(result) === null) {
      return {};
    }
    return result.payload;
  },
};

export default AIConfigRectApi;
