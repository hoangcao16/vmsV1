import { isEmpty } from 'lodash';
import moment from 'moment';
import { call, put, takeLatest } from 'redux-saga/effects';
// import CameraApi from '../../../../actions/api/camera/CameraApi';
import ReportApi from '../../../../actions/api/report/ReportApi';
import { setDataChart, setError } from '../actions';
import { DATA_CHART } from '../constants';

export function* handleDataChartLoad(action) {
  const { params } = action;
  let timeStart = moment(params.timeStartDay._d).format("DD/MM/YYYY")
  let timeEnd = moment(params.timeEndDay._d).format("DD/MM/YYYY")

  switch (params.pickTime.toUpperCase()) {
    case "DAY":
      timeStart = moment(params.timeStartDay._d).format("DD/MM/YYYY");
      timeEnd = moment(params.timeEndDay._d).format("DD/MM/YYYY");
      break;
    case "MONTH":
      timeStart = moment(params.timeStartDay._d).format("MM/YYYY");
      timeEnd = moment(params.timeEndDay._d).format("MM/YYYY");
      break;
    case "YEAR":
      timeStart = moment(params.timeStartDay._d).format("YYYY");
      timeEnd = moment(params.timeEndDay._d).format("YYYY");
      break;
    default:
      timeStart = moment(params.timeStartDay._d).format("DD/MM/YYYY");
      timeEnd = moment(params.timeEndDay._d).format("DD/MM/YYYY");
  }
  console.log("actionaction", action)
  
  const payloadDataChart = {
    dateType: params.pickTime.toUpperCase(),
    startDate: timeStart,
    endDate: timeEnd,
    provinceId: params.provinceId,
    districtId: !isEmpty(params.districtId) ? params?.districtId : [],
    wardId: !isEmpty(params.wardId) ? params?.wardId : [],
    eventId: params.eventList
  }

  localStorage.setItem('payloadDataChart', JSON.stringify(payloadDataChart));
  // "time": "30/10/2021",
  // "location": "Hà Nội",
  // "event1": "Lấn làn ",
  // "totalEvent1": 0,
  // "nameNoAccent1": "lanlan",
  // "event2": null,
  // "totalEvent2": 0,
  // "nameNoAccent2": null,
  // "event3": null,
  // "totalEvent3": 0,
  // "nameNoAccent3": null
  
  try {
    const data = yield call(() => ReportApi.getChartData(payloadDataChart).then((data)=>{
      return data.map((d) => {
        let a = {}
        if (!isEmpty(d.event1)) {
          a[d.event1] = d.totalEvent1;
        }
  
        if (!isEmpty(d.event2)) {
          a[d.event2] = d.totalEvent2
        }
  
        if (!isEmpty(d.event3)) {
          a[d.event3] = d.totalEvent3
        }

        const test =  {
          name: d.time,
          ...a
        }
        return test
      })
    }));
    yield put(setDataChart(data));
  } catch (error) {
    yield put(setError(error.toString()));
  }
}

export default function* watchTreeCamGroupLoad() {
  yield takeLatest(DATA_CHART.LOAD, handleDataChartLoad);
}