import { isEmpty } from "lodash";
import moment from "moment";
import { call, put, takeLatest } from "redux-saga/effects";
// import CameraApi from '../../../../actions/api/camera/CameraApi';
import ReportApi from "../../../../actions/api/report/ReportApi";
import { setDataChart, setError } from "../actions";
import { DATA_CHART } from "../constants";

export function* handleDataChartLoad(action) {
  const { params } = action;
  let timeStart;
  let timeEnd;

  switch (params.pickTime.toUpperCase()) {
    case "WEEK":
      timeStart = moment(params.timeStartWeek._d).format("WWYYYY");
      timeEnd = moment(params.timeEndWeek._d).format("WWYYYY");
      break;
    case "MONTH":
      timeStart = moment(params.timeStartMonth._d).format("MMYYYY");
      timeEnd = moment(params.timeEndMonth._d).format("MMYYYY");
      break;
    case "YEAR":
      timeStart = moment(params.timeStartYear._d).format("YYYY");
      timeEnd = moment(params.timeEndYear._d).format("YYYY");
      break;
    default:
      timeStart = moment(params.timeStartDay._d).format("DDMMYYYY");
      timeEnd = moment(params.timeEndDay._d).format("DDMMYYYY");
  }

  const payloadDataChart = {
    typeTime: params.pickTime.toUpperCase(),
    startDate: timeStart,
    endDate: timeEnd,
    provinceIds: params.provinceId.toString(),
    districtIds: !isEmpty(params.districtId)
      ? params?.districtId.toString()
      : "",
    wardIds: !isEmpty(params.wardId) ? params?.wardId.toString() : "",
    eventUuids: params?.eventList.toString(),
    cameraUuids: !isEmpty(params.cameraUuids)
      ? params?.cameraUuids.toString()
      : "",
  };

  localStorage.setItem("payloadDataChart", JSON.stringify(payloadDataChart));
  try {
    if (!isEmpty(payloadDataChart.eventUuids)) {
      let res;
      const date = {
        typeTime: params.pickTime.toUpperCase(),
        startDate: timeStart,
        endDate: timeEnd,
      };
      if (
        params.provinceId.length > 1 ||
        (params.districtId && params.districtId.length > 1) ||
        (params.wardId && params.wardId.length > 1)
      ) {
        res = yield call(() =>
          ReportApi.getCompareData(payloadDataChart).then((result) => {
            return result;
          })
        );
      } else {
        res = yield call(() =>
          ReportApi.getData(payloadDataChart).then((result) => {
            return result;
          })
        );
      }
      console.log("resNormal", res);
      yield put(setDataChart({ res, date }));
    } else {
      const fakeData = { data: [], percent: {} };
      yield put(setDataChart(fakeData));
    }
  } catch (error) {
    yield put(setError(error.toString()));
  }
}

export default function* dataChart() {
  yield takeLatest(DATA_CHART.LOAD, handleDataChartLoad);
}
