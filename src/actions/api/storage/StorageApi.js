import { responseCheckerErrors } from '../../function/MyUltil/ResponseChecker';
import MyService from '../service';

const StorageApi = {
  getFileStorageByTabActive: async (tabsActive, params) => {
    let result;

    if (tabsActive == 1) {
      try {
        result = await MyService.getRequestData(
          '/cctv-controller-svc/api/v1/event-files',
          {
            page: params.page,
            size: params.size,
          }
        );
      } catch (error) {
        console.log(error);
      }

      if (responseCheckerErrors(result)) {
        return [];
      }

      return result;
    } else if (tabsActive == 2) {
      try {
        result = await MyService.getRequestData(
          '/cctv-controller-svc/api/v1/event-files',
          {
            page: params.page,
            size: params.size,
            eventUuid: 'notnull'
          }
        );
      } catch (error) {
        console.log(error);
      }

      if (responseCheckerErrors(result)) {
        return [];
      }

      return result;
    } else {
      try {
        result = await MyService.getRequestData(
          '/cctv-controller-svc/api/v1/files',
          {
            fileType: tabsActive,
            page: params.page,
            size: params.size
          }
        );
      } catch (error) {
        console.log(error);
      }

      if (responseCheckerErrors(result)) {
        return [];
      }

      return result;
    }
  },

  delete: async (uuid) => {
    let result;
    try {
      result = await MyService.deleteRequestData(
        `/cctv-controller-svc/api/v1/files/${uuid}`
      );
    } catch (error) {
      console.log(error);
    }

    if (responseCheckerErrors(result)) {
      return false;
    }
    return true;
  },

  deleteMultifiles: async (payload) => {
    let result;
    try {
      result = await MyService.deleteRequestData(
        '/cctv-controller-svc/api/v1/files',
        {
          files: payload
        }
      );
    } catch (error) {
      console.log(error);
    }

    if (responseCheckerErrors(result)) {
      return false;
    }
    return true;
  },

  makeHighlightMultifiles: async (payload) => {
    let result;
    try {
      result = await MyService.putRequestData(
        '/cctv-controller-svc/api/v1/files',
        {
          files: payload
        }
      );
    } catch (error) {
      console.log(error);
    }

    if (responseCheckerErrors(result)) {
      return false;
    }
    return true;
  },

  makeUnhighlightMultifiles: async (payload) => {
    let result;
    try {
      result = await MyService.putRequestData(
        '/cctv-controller-svc/api/v1/files',
        {
          files: payload
        }
      );
    } catch (error) {
      console.log(error);
    }

    if (responseCheckerErrors(result)) {
      return false;
    }
    return true;
  }
};

export default StorageApi;
