import {combineReducers} from "redux"
import cameraInMapReducer from "./cameraInMapReducer";
import adminisUnitsReducer from "./adminsUnitsReducer";
import trackingPointsReducer from "./trackingPointReducer"
import formMapReducer from "./formMapReducer";
import camLiveReducer from './camLiveReducer'


const mapReducers = combineReducers({
    camera:cameraInMapReducer,
    trackingPoint: trackingPointsReducer,
    adminisUnit: adminisUnitsReducer,
    form: formMapReducer,
    camsLive: camLiveReducer
})

export default mapReducers
