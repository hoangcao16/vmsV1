import { handleErrCodeAI } from '../../function/MyUltil/ResponseChecker';
import AIService from '../ai-service';

const AIConfigScheduleApi = {
  getAllConfigSchedule: async (params) => {

    let result;

    try {
      result = await AIService.getRequestData(
        `/api/v1/config_schedule/${params?.cameraUuid}?type=${params?.type}`
      );

    } catch (error) {
      console.log(JSON.stringify(error));
    }

    if (handleErrCodeAI(result) === null) {
      return [];
    }

    return result.payload;
  },
  addConfigSchedule: async (payload) => {
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
  editConfigScheduleByUuid: async (uuid, payload) => {
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
  copyConfigSchedule: async (uuid, payload) => {
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

export default AIConfigScheduleApi;
