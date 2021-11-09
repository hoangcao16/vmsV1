import { isEmpty } from 'lodash-es';
import { responseCheckerErrorsController } from '../../function/MyUltil/ResponseChecker';
import MyService from '../service';

const PlaybackApi = {
  getAllPlayback: async (data) => {
    let result;

    try {
      if (isEmpty(data)) {
        result = await MyService.getRequestData(
          `/cctv-controller-svc/api/v1/playback`
        );
      } else {
        result = await MyService.getRequestData(
          `/cctv-controller-svc/api/v1/playback?name=${data?.name}&page=${data?.page}&size=${data?.size}`
        );
      }
    } catch (error) {
      console.log(error);
    }

    if (responseCheckerErrorsController(result) === null) {
      return [];
    }

    return result.payload;
  },
  getPlaybackByUuid: async (uuid) => {
    let result;

    try {
      result = await MyService.getRequestData(
        `/cctv-controller-svc/api/v1/playback/${uuid}`
      );
    } catch (error) {
      console.log(error);
    }

    if (responseCheckerErrorsController(result) === null) {
      return [];
    }

    return result.payload;
  },

  editPlayback: async (playbackId, playbackPayload) => {
    let result;

    try {
      result = await MyService.putRequestData(
        `/cctv-controller-svc/api/v1/playback/${playbackId}`,
        playbackPayload
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

export default PlaybackApi;
