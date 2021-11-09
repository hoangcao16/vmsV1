import { all, put, select } from '@redux-saga/core/effects';
import watchCameraSaga from './camera';
import watchAdminisUnitSaga from "./adminisUnit";
import watchTrackingPointSaga from "./trackingPoint";
import watchCamLiveSaga from './camLive';
import { FORM_MAP_ITEM } from '../../../view/common/vms/constans/map';
import { updateMapObject } from '../../actions/map/formMapActions';

export function* updateFormMapObject() {
  const formMapObject = {
    selectedPos: false,
    isOpenForm: false,  
    formEditting: null,
    actionType: '',
    isEditForm: false 
  }
  const formMapSelector = yield select(state => state.map.form);
  yield put(updateMapObject({
    ...formMapSelector,
    ...formMapObject
  }))
  sessionStorage.setItem(FORM_MAP_ITEM, JSON.stringify({...formMapSelector, ...formMapObject}));
  }

export default function* RootSaga() {
  yield all([watchCameraSaga(), watchAdminisUnitSaga(), watchTrackingPointSaga(), watchCamLiveSaga()]);
}
