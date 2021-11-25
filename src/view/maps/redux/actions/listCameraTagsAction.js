import { CAMERA_TAGS } from '../constants';

const loadCameraTags = (params) => ({
  params: params,
  type: CAMERA_TAGS.LOAD
});

const setCameraTags = (cameraTagsData) => ({
  type: CAMERA_TAGS.LOAD_SUCCESS,
  cameraTagsData
});

const setError = (error) => ({
  type: CAMERA_TAGS.LOAD_FAIL,
  error
});

export { setCameraTags, loadCameraTags, setError };
