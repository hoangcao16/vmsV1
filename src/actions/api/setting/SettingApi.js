import {
  handleErrCodeMonitorCtrl
} from '../../function/MyUltil/ResponseChecker';
import MyService from '../service';

const SettingApi = {
  getDataCleanFile: async () => {
    let result;

    try {
      result = await MyService.getRequestData(
        '/cctv-monitor-ctrl-svc/api/v1/config/clean-file'
      );
    } catch (error) {
      console.log('wrong log error: ' + JSON.stringify(error));
    }

    // if (handleErrCodeMonitorCtrl(result)) {
    //   return [];
    // }

    return handleErrCodeMonitorCtrl(result);
  },

  getDataWarningDisk: async () => {
    let result;

    try {
      result = await MyService.getRequestData(
        '/cctv-monitor-ctrl-svc/api/v1/config/warning-disk'
      );
    } catch (error) {
      console.log('wrong log error: ' + JSON.stringify(error));
    }

    return handleErrCodeMonitorCtrl(result);
  },
  getRecordingVideo: async () => {
    let result;

    try {
      result = await MyService.getRequestData(
        '/cctv-monitor-ctrl-svc/api/v1/config/recording-video'
      );
    } catch (error) {
      console.log('wrong log error: ' + JSON.stringify(error));
    }

    return handleErrCodeMonitorCtrl(result);
  },

  postDataCleanFile: async (dataCleanFile) => {
    let result;

    try {
      result = await MyService.postRequestData(
        '/cctv-monitor-ctrl-svc/api/v1/config/clean-file',
        dataCleanFile
      );
    } catch (error) {
      console.log(error);
    }

    if (!handleErrCodeMonitorCtrl(result)) {
      return false;
    }
    return true;
  },
  postDataWarningDisk: async (dataWarningDisk) => {
    let result;

    try {
      result = await MyService.postRequestData(
        '/cctv-monitor-ctrl-svc/api/v1/config/warning-disk',
        dataWarningDisk
      );
    } catch (error) {
      console.log(error);
    }

    if (!handleErrCodeMonitorCtrl(result)) {
      return false;
    }
    return true;
  },
  postRecordingVideo: async (dataWarningDisk) => {
    let result;

    try {
      result = await MyService.postRequestData(
        '/cctv-monitor-ctrl-svc/api/v1/config/recording-video',
        dataWarningDisk
      );
    } catch (error) {
      console.log(error);
    }

    if (!handleErrCodeMonitorCtrl(result)) {
      return false;
    }
    return true;
  }
};

export default SettingApi;
