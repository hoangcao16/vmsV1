const initialState = {
  cameras: []
}

const cameraReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_CAMERAS_SUCCESS": {
      return { ...state, cameras: action.cameras }
    }

    case "GET_CAMERAS_FAILURE": {
      return { ...state, error: action.error }
    }

    case "ADD_CAMERA_SUCCESS": {
      state.cameras.push(action.camera);
      const cameras = state.cameras;
      return {...state, cameras: cameras};
    }
  
    default: {
      return state;
    }
  }
}

export default cameraReducer;