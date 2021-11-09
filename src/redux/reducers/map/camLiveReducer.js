
import cloneDeep from "lodash/cloneDeep"
import {
    REMOVE_CAM_LIVE,
    UPDATE_CAM_LIVE,
    NOT_PERMISSION_VIEW_CAM,
    REMOVE_ALL_CAM_LIVE,
    SELECT_OR_DESELECT_CAMERA_LIVE,
    DESELECT_CAMERA_LIVE,
    PLAYBACK_SEEK_TIME,
    NOT_OPERATION_VIEW_CAM,
    SET_PLAYBACK_HLS,
    GET_LIST_CAM_LIVE,
    GET_LIST_CAM_LIVE_SUCCESS,
    GET_LIST_CAM_LIVE_ERROR,
    SAVE_LIST_CAM_LIVE,
    SAVE_LIST_CAM_LIVE_SUCCESS,
    SAVE_LIST_CAM_LIVE_ERROR,
    UPDATE_LIST_CAM_LIVE,
    UPDATE_LIST_CAM_LIVE_SUCCESS,
    UPDATE_LIST_CAM_LIVE_ERROR,
    SET_CAMS_LIVE,
    DELETE_LIST_CAM_LIVE,
    DELETE_LIST_CAM_LIVE_SUCCESS,
    DELETE_LIST_CAM_LIVE_ERROR
} from "../../types/map";
import { setCamLiveStorage } from "../../../utility/vms/map";

const initialState = {
    loading: false,
    errors: null,
    camLiveObject: {},
    listCamLive:[],
    selectedIds: [],
    playbackSeekTime: null,
};


const camLiveReducer = (state = initialState, action) => {
    switch (action.type) {
        
        case SET_CAMS_LIVE: {
            const newListCamLive = [...state.listCamLive];
            const camLeakIndex = newListCamLive.findIndex(
                (cam) => cam === "" || cam.messError
            );
            if (camLeakIndex > -1) {
                newListCamLive[camLeakIndex] = action.payload;
            } else {
                if (newListCamLive.length > 3) {
                    newListCamLive[0] = action.payload;
                } else {
                    newListCamLive.push(action.payload);
                }
            }
            setCamLiveStorage(cloneDeep(newListCamLive));
            return {...state, listCamLive: [...newListCamLive]};
        }

        case UPDATE_CAM_LIVE: {
            const newListCamLive = [...state.listCamLive];
            const camUpdateIndex = newListCamLive.findIndex(
                (cam) => cam.uuid === action.payload
            );
            if (camUpdateIndex > -1) {
                newListCamLive[camUpdateIndex].isPlay = true;
            }
            setCamLiveStorage(cloneDeep(newListCamLive));
            return {...state, listCamLive: [...newListCamLive]};
        }

        case REMOVE_CAM_LIVE: {
            const camRemove = action.payload;
            const newListCamLive = [...state.listCamLive];
            const camRemoveIndex = [...newListCamLive].findIndex(
                (cam) => cam.uuid === camRemove.uuid
            );

            let newSelectedIds = state.selectedIds
            if (camRemoveIndex > -1) {
                newListCamLive[camRemoveIndex] = "";
                const fIdx = newSelectedIds.findIndex((it, idx) => it == camRemoveIndex)
                if (fIdx > -1) {
                    newSelectedIds.splice(fIdx, 1);
                }

            }
            setCamLiveStorage(cloneDeep(newListCamLive));
            return {...state, listCamLive: [...newListCamLive], selectedIds: [...newSelectedIds]};
        }

        case REMOVE_ALL_CAM_LIVE: {
            // const newListCamLive = [...state.listCamLive];
            // newListCamLive.forEach((cam) => {
            //     if(cam){
            //         cam.isPlay = false;
            //     }
            // });
           
            setCamLiveStorage(cloneDeep([]));
            return {...state, listCamLive: []};
        }

        case NOT_PERMISSION_VIEW_CAM: {
            const camNoPermis = action.payload;
            const newListCamLive = [...state.listCamLive];
            const camRemoveIndex = [...newListCamLive].findIndex(
                (cam) => cam.uuid === camNoPermis.uuid
            );
            if (camRemoveIndex > -1) {
                newListCamLive[camRemoveIndex] = {
                    name: newListCamLive[camRemoveIndex].name,
                };
                newListCamLive[camRemoveIndex].messError = `bạn không có quyền xem`;
                const listCamMessErrUnique = newListCamLive.map((cam, index) => {
                    if (cam.messError && camRemoveIndex !== index) {
                        cam = null;
                    }
                    return cam;
                });
                setCamLiveStorage(cloneDeep(listCamMessErrUnique));
                return {...state, listCamLive: [...listCamMessErrUnique]};
            }
            setCamLiveStorage(cloneDeep(newListCamLive));
            return {...state, listCamLive: [...newListCamLive]};
        }
        case NOT_OPERATION_VIEW_CAM: {
            const camNoPermis = action.payload;
            const newListCamLive = [...state.listCamLive];
            const camRemoveIndex = [...newListCamLive].findIndex(
                (cam) => cam.uuid === camNoPermis.uuid
            );
            if (camRemoveIndex > -1) {
                newListCamLive[camRemoveIndex] = {
                    name: newListCamLive[camRemoveIndex].name,
                };
                newListCamLive[camRemoveIndex].messError = `Camera không hoạt động`;
                const listCamMessErrUnique = newListCamLive.map((cam, index) => {
                    if (cam.messError && camRemoveIndex !== index) {
                        cam = "";
                    }
                    return cam;
                });
                setCamLiveStorage(cloneDeep(listCamMessErrUnique));
                return {...state, listCamLive: [...listCamMessErrUnique]};
            }
            setCamLiveStorage(cloneDeep(newListCamLive));
            return {...state, listCamLive: [...newListCamLive]};
        }

        case SELECT_OR_DESELECT_CAMERA_LIVE: {
            let newSelectedIds = state.selectedIds
            if (newSelectedIds.includes(action.payload)) {
                const fIdx = newSelectedIds.findIndex((it, idx) => it == action.payload)
                newSelectedIds.splice(fIdx, 1);
            } else {
                newSelectedIds.push(action.payload)
            }

            return {...state, selectedIds: [...newSelectedIds]}
        }

        case DESELECT_CAMERA_LIVE: {
            let newSelectedIds = state.selectedIds
            const fIdx = newSelectedIds.findIndex((it, idx) => it == action.payload)
            newSelectedIds.splice(fIdx, 1);

            return {...state, selectedIds: [...newSelectedIds]}
        }

        case SET_PLAYBACK_HLS: {
            const newListCamLive = [...state.listCamLive];
            const camUpdateIndex = newListCamLive.findIndex(
                (cam) => cam.uuid === action.payload.uuid
            );
            if (camUpdateIndex > -1) {
                newListCamLive[camUpdateIndex] = action.payload;
            }
            return {...state, listCamLive: [...newListCamLive]};
        }

        case PLAYBACK_SEEK_TIME: {
            return {...state, playbackSeekTime: action.payload}
        }
        case GET_LIST_CAM_LIVE: {
            return {...state, loading: true}
        }
        case GET_LIST_CAM_LIVE_SUCCESS: {
            return {...state, loading: false, ...action.payload}
        }
        case GET_LIST_CAM_LIVE_ERROR: {
            return {...state, loading: false, ...action.payload }
        }
        case SAVE_LIST_CAM_LIVE: 
        case UPDATE_LIST_CAM_LIVE:
        case DELETE_LIST_CAM_LIVE:
        {
            return {...state, loading: true}
        }
        case SAVE_LIST_CAM_LIVE_SUCCESS: 
        case UPDATE_LIST_CAM_LIVE_SUCCESS:
        case DELETE_LIST_CAM_LIVE_SUCCESS:
        {
            return {...state, loading: false}
        }
        case SAVE_LIST_CAM_LIVE_ERROR:
        case UPDATE_LIST_CAM_LIVE_ERROR:
        case DELETE_LIST_CAM_LIVE_ERROR:
         {
            return {...state, loading: false, ...action.payload }
        }
        default: {
            return state;
        }
    }
};

export default camLiveReducer;
