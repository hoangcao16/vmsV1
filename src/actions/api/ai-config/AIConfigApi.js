import { handleErrCodeAI } from '../../function/MyUltil/ResponseChecker';
import AIService from '../ai-service';

const AIConfigApi = {
  getConfig: async (params) => {

    let result;

    try {
      result = await AIService.getRequestData(
        `/api/v1/config/${params?.cameraUuid}?type=${params?.type}`
      );

    } catch (error) {
      console.log(JSON.stringify(error));
    }

    if (handleErrCodeAI(result) === null) {
      return {};
    }

    return result.payload;
  },

  editConfigStatus: async (payload) => {
    let result;

    try {
      result = await AIService.postRequestData(
        `/api/v1/config`,
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
  
  

};

export default AIConfigApi;
