import CameraApi from "../../../actions/api/camera/CameraApi";

export const getCameras = (dataSearch) => {
  return (dispatch) => {
    CameraApi.getAllCamera(dataSearch).then(
      (response) => {
        dispatch({
          type: "GET_CAMERAS_SUCCESS",
          cameras: response,
        });
      },
      (error) => {
        dispatch({
          type: "GET_CAMERAS_FAILURE",
          error: error,
        });
      }
    );
  };
};

export const addCamera = () => {
  return (dispatch) => {
    CameraApi.addCamera().then(
      (response) => {
        dispatch({
          type: "ADD_CAMERAS_SUCCESS",
          camera: response,
        });
      },
      (error) => {
        dispatch({
          type: "ADD_CAMERAS_FAILURE",
          error: error,
        });
      }
    );
  };
};
