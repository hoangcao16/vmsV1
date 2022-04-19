import { handleErrCodeAI } from "../../function/MyUltil/ResponseChecker";
import AIService from "../ai-service";
import { reactLocalStorage } from "reactjs-localstorage";
import { NOTYFY_TYPE } from "../../../view/common/vms/Constant";
import FileService from "../exporteventfile/fileservice";
import MyService from "../service";

const AI_SOURCE = process.env.REACT_APP_AI_SOURCE;
const language = reactLocalStorage.get("language");

const AIEventsApi = {
  getEvents: async (params) => {
    let url = "/api/v1/ai-events";
    if (AI_SOURCE === "philong") {
      url = "/api/v1/integration-ai-events";
    }
    let result;
    try {
      result = await AIService.getRequestData(url, params);
    } catch (error) {
      console.log(JSON.stringify(error));
    }

    if (handleErrCodeAI(result) === null) {
      return [];
    }

    return result;
  },
  getTracingEvents: async (uuid, params) => {
    let url = "/api/v1/ai-events";
    if (AI_SOURCE === "philong") {
      url = `/api/v1/integration-ai-events/tracing-event/${uuid}`;
    }
    let result;
    try {
      result = await AIService.getRequestData(url, params);
    } catch (error) {
      console.log(JSON.stringify(error));
    }

    if (handleErrCodeAI(result) === null) {
      return [];
    }

    console.log(result);
    return result;
  },
  getEventsByTrackingId: async (trackingId) => {
    let result;

    try {
      result = await AIService.getRequestData(
        `/api/v1/ai-events/by-tracking/${trackingId}`
      );
    } catch (error) {
      console.log(JSON.stringify(error));
    }

    if (handleErrCodeAI(result) === null) {
      return [];
    }

    console.log(result);
    return result;
  },

  getDetailEvent: async (uuid) => {
    let result;

    try {
      result = await AIService.getRequestData(`/api/v1/ai-events/${uuid}`);
    } catch (error) {
      console.log(JSON.stringify(error));
    }

    if (handleErrCodeAI(result) === null) {
      return [];
    }

    console.log(result);
    return result;
  },

  editInforOfEvent: async (uuid, payload) => {
    let url = "/api/v1/ai-events/";
    // let url = '/api/v1/integration-ai-events'
    console.log(AI_SOURCE);
    if (AI_SOURCE === "philong") {
      url = "/api/v1/integration-ai-events/";
    }
    let result;
    try {
      result = await AIService.putRequestData(url + uuid, payload);
    } catch (error) {
      console.log(error);
    }

    if (handleErrCodeAI(result) === null) {
      return false;
    }
    return true;
  },

  delete: async (uuid) => {
    let result;
    let url = "/api/v1/ai-events/";
    // let url = '/api/v1/integration-ai-events'
    console.log(AI_SOURCE);
    if (AI_SOURCE === "philong") {
      url = "/api/v1/integration-ai-events/";
    }

    try {
      result = await AIService.deleteRequestData(`${url}${uuid}`);
    } catch (error) {
      console.log(error);
    }
    if (handleErrCodeAI(result) === null) {
      return false;
    }
    return true;
  },

  deleteFileData: async (id) => {
    let result;
    try {
      result = await AIService.deleteRequestData(
        "/api/v1/ai-events/image/" + id,
        {
          fileName: id,
        }
      );
    } catch (e) {
      return null;
    }
    return result;
  },

  getAiEvent: async (params) => {
    let result;
    try {
      result = await MyService.getRequestData(
        `/cctv-controller-svc/api/v1/events-ai?name=&type=${params}`
      );
    } catch (error) {
      console.log(error);
    }

    return result.payload;
  },
};

export default AIEventsApi;
