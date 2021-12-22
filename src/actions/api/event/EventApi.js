import { responseCheckerErrorsController } from '../../function/MyUltil/ResponseChecker';
import MyService from '../service';

const EventApi = {
  getAllEvent: async (data) => {
    let result;
    try {
      result = await MyService.getRequestData(
        `/cctv-controller-svc/api/v1/events?name=${data?.name}`
      );
    } catch (error) {
      console.log(error);
    }

    if (responseCheckerErrorsController(result, 'noMessage') === null) {
      return [];
    }
    return result.payload;
  },
  getEventByUuid: async (uuid) => {
    let result;
    try {
      result = await MyService.getRequestData(
        `/cctv-controller-svc/api/v1/events/${uuid}`
      );
    } catch (error) {
      console.log(error);
    }

    if (responseCheckerErrorsController(result) === null) {
      return [];
    }

    return result.payload;
  },
  postNewEvent: async (EventPayload) => {
    let result;
    try {
      result = await MyService.postRequestData(
        `/cctv-controller-svc/api/v1/events/`,
        EventPayload
      );
    } catch (error) {
      console.log(error);
    }
    if (responseCheckerErrorsController(result) === null) {
      return false;
    }
    return true;
  },
  putEditEvent: async (uuid, EventPayload) => {
    let result;
    try {
      result = await MyService.putRequestData(
        `/cctv-controller-svc/api/v1/events/${uuid}`,
        EventPayload
      );
    } catch (error) {
      console.log(error);
    }
    if (responseCheckerErrorsController(result) === null) {
      return false;
    }
    return true;
  },
  deleteEvent: async (uuid) => {
    let result;
    try {
      result = await MyService.deleteRequestData(
        `/cctv-controller-svc/api/v1/events/${uuid}`
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

export default EventApi;
