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
    case "MONTH":
      timeStart = moment(params.timeStartMonth._d).format("MM/YYYY");
      timeEnd = moment(params.timeEndMonth._d).format("MM/YYYY");
      break;
    case "YEAR":
      timeStart = moment(params.timeStartYear._d).format("YYYY");
      timeEnd = moment(params.timeEndYear._d).format("YYYY");
      break;
    default:
      timeStart = moment(params.timeStartDay._d).format("DD/MM/YYYY");
      timeEnd = moment(params.timeEndDay._d).format("DD/MM/YYYY");
  }

  const payloadDataChart = {
    dateType: params.pickTime.toUpperCase(),
    startDate: timeStart,
    endDate: timeEnd,
    provinceId: params.provinceId,
    districtId: !isEmpty(params.districtId) ? params?.districtId : [],
    wardId: !isEmpty(params.wardId) ? params?.wardId : [],
    eventId: params?.eventList,
  };

  localStorage.setItem("payloadDataChart", JSON.stringify(payloadDataChart));
  try {
    if (!isEmpty(payloadDataChart.eventId)) {
      const res = yield call(() =>
        ReportApi.getChartData(payloadDataChart).then((result) => {
          return result;
        })
      );
      yield put(setDataChart(res));
    } else {
      const fakeData = {chartEvents: [], percents: []}
      yield put(setDataChart(fakeData));
    }
  } catch (error) {
    yield put(setError(error.toString()));
  }
}

export default function* watchTreeCamGroupLoad() {
  yield takeLatest(DATA_CHART.LOAD, handleDataChartLoad);
}
