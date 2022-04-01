import { isEmpty } from "lodash";
import moment from "moment";
import { call, put, takeLatest } from "redux-saga/effects";
// import CameraApi from '../../../../actions/api/camera/CameraApi';
import ReportApi from "../../../../actions/api/report/ReportApi";
import { setTableDataChart, setTableDataError } from "../actions";
import { TABLE_DATA_CHART } from "../constants";

export function* handleTableDataChartLoad(action) {
  const { params } = action;
  let timeStart;
  let timeEnd;

  switch (params.pickTime.toUpperCase()) {
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
    wardIds: !isEmpty(params.wardId) ? params?.wardId.toString() : [],
    eventUuids: params?.eventList.toString(),
    cameraUuids: !isEmpty(params.cameraUuids)
      ? params?.cameraUuids.toString()
      : "",
  };

  localStorage.setItem("payloadDataChart", JSON.stringify(payloadDataChart));
  try {
    if (!isEmpty(payloadDataChart.eventUuids)) {
      const res = yield call(() =>
        ReportApi.getTableData(payloadDataChart).then((result) => {
          return result;
        })
      );
      const date = {
        typeTime: params.pickTime.toUpperCase(),
        startDate: timeStart,
        endDate: timeEnd,
      };
      yield put(setTableDataChart({res, date}));
    } else {
      const fakeData = { tableChartEvents: [], dateType: {} };
      yield put(setTableDataChart(fakeData));
    }
  } catch (error) {
    yield put(setTableDataError(error.toString()));
  }
}

export default function* dataTableChart() {
  yield takeLatest(TABLE_DATA_CHART.LOAD, handleTableDataChartLoad);
}
