import {
    FETCH_ALL_CAMERA_ON_MAP,
    UPDATE_CAMERA_ON_MAP,
    FETCH_ALL_CAMERA_ON_MAP_SUCCESS,
    FETCH_ALL_CAMERA_ON_MAP_FAILED,
    UPDATE_CAMERA_ON_MAP_BY_FILTER,
    UPDATE_CAMERA_ON_MAP_BY_FILTER_SUCCESS,
    UPDATE_CAMERA_ON_MAP_BY_FILTER_FAILED,
    ADD_CAMERA_ON_MAP,
    ADD_CAMERA_ON_MAP_FAILED,
    ADD_CAMERA_ON_MAP_SUCCESS
} from "../../types/map";


const initialState = {
    listCamera: [],
    metadata: {},
    isLoading: false,
    errors: null,
};

const FilterSource = 2;

const cameraInMapReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_ALL_CAMERA_ON_MAP: {
            return {...state, listCamera: [], metadata: {}, isLoading: true};
        }

        case FETCH_ALL_CAMERA_ON_MAP_SUCCESS: {
            return {...state, ...action.payload, isLoading: false};
        }

        case FETCH_ALL_CAMERA_ON_MAP_FAILED: {
            return {...state, listCamera: [], metadata: {}, isLoading: false};
        }

        case UPDATE_CAMERA_ON_MAP: {
            action.payload.map((item, _) => {
                item.source = FilterSource; //
            });
            state.listCamera = [...state.listCamera, ...action.payload];
            return state;
        }

        case UPDATE_CAMERA_ON_MAP_BY_FILTER: {
            return {...state, isLoading: true};
        }

        case UPDATE_CAMERA_ON_MAP_BY_FILTER_SUCCESS: {
            const editedCam = action.payload;
            const {listCamera} = state;
            const index = listCamera.findIndex((item) => item.id === editedCam.id);
            if (index !== -1) {
                const newList = [
                    ...listCamera.slice(0, index),
                    editedCam,
                    ...listCamera.slice(index + 1),
                ];
                return {
                    ...state,
                    listCamera: [...newList],
                    isLoading: false,
                };
            }
            return {
                ...state,
            };
        }

        case UPDATE_CAMERA_ON_MAP_BY_FILTER_FAILED: {
            return {...state, isLoading: false};
        }

        case ADD_CAMERA_ON_MAP: {
            return {...state, isLoading: false};
        }

        case ADD_CAMERA_ON_MAP_SUCCESS: {
            const newCam = action.payload;
            return {
                ...state,
                listCamera: [newCam, ...state.listCamera],
                isLoading: false,
            };
        }
        case ADD_CAMERA_ON_MAP_FAILED: {
            return {...state, isLoading: false};
        }
        default:
            return state;
    }
};

export default cameraInMapReducer;
