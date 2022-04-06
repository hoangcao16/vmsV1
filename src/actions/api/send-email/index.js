import { handleErrCodeAI } from "../../function/MyUltil/ResponseChecker";
import AIService from "../ai-service";
const SendEmailApi = {
  sendEmail: async (payload) => {
    let result;

    try {
      result = await AIService.postRequestData("/api/v1/send-ticket", payload);
    } catch (error) {
      console.log(error);
    }

    if (handleErrCodeAI(result) === null) {
      return false;
    }
    return true;
  },
};
export default SendEmailApi;
