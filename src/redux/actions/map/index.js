import * as cameraActions from "./cameraActions"
import * as adminisUnitActions from "./adminisUnitsAction"
import * as trackingPointActions from "./trackingPointActions"
import * as formMapActions from "./formMapActions"
import * as camLiveAction from  './camLiveAction';
export default {
    ...cameraActions,
    ...adminisUnitActions,
    ...trackingPointActions,
    ...formMapActions,
    ...camLiveAction
}
