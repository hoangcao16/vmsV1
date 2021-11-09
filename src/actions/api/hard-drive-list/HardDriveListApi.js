import { handleErrCodeMonitorCtrl } from '../../function/MyUltil/ResponseChecker';
import MyService from '../service';

const HardDriveListApi = {
  getAllHardDrive: async (params) => {
    console.log('params:', params);
    let result;

    try {
      result = await MyService.getRequestData(
        `/cctv-monitor-ctrl-svc/api/v1/config/disk-info?page=${params?.page}&pageSize=${params?.pageSize}`
      );
    } catch (error) {
      console.log(JSON.stringify(error));
    }

    if (handleErrCodeMonitorCtrl(result) === null) {
      return [];
    }
    return result.payload;
  },
  getAllMessageWarning: async (params) => {
    let result;

    try {
      result = await MyService.getRequestData(
        '/cctv-monitor-ctrl-svc/api/v1/message/notification',
        params
      );
    } catch (error) {
      console.log(JSON.stringify(error));
    }

    if (handleErrCodeMonitorCtrl(result) === null) {
      return [];
    }

    return result.payload;
  },
  getBadge: async () => {
    let result;

    try {
      result = await MyService.getRequestData(
        '/cctv-monitor-ctrl-svc/api/v1/message/get-badge'
      );
    } catch (error) {
      console.log(JSON.stringify(error));
    }

    if (handleErrCodeMonitorCtrl(result) === null) {
      return [];
    }

    console.log(result.payload);
    console.log(result);

    return result.payload;
  },
  getAllMail: async () => {
    let result;

    try {
      result = await MyService.getRequestData(
        '/cctv-monitor-ctrl-svc/api/v1/email/get-email'
      );
    } catch (error) {
      console.log(JSON.stringify(error));
    }
    // console.log('resule all email', result)

    if (
      handleErrCodeMonitorCtrl(result) === null ||
      result.payload === undefined
    ) {
      return [];
    }

    return result.payload;
  },
  updateEmail: async (data) => {
    let result;

    try {
      result = await MyService.postRequestData(
        `/cctv-monitor-ctrl-svc/api/v1/email/update-email`,
        data
      );
    } catch (error) {
      console.log(error);
    }

    if (handleErrCodeMonitorCtrl(result) === null) {
      return false;
    }
    return true;
  }
};

export default HardDriveListApi;
