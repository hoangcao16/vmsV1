import { put, takeLatest, call } from 'redux-saga/effects';
import { setDataChart, setError } from '../actions';
import { DATA_CHART} from '../constants';
// import CameraApi from '../../../../actions/api/camera/CameraApi';
import ReportApi from '../../../../actions/api/report/ReportApi';
import moment from 'moment';
import { isEmpty } from 'lodash';
import clearData from '../../../../actions/function/MyUltil/CheckData';

// const data = [
//   {
//     name: 'Jan',
//     no_helmet: 4000,
//     go_to_the_sidewalk: 2400,
//     run_red_light: 2400
//   },
//   {
//     name: 'Feb',
//     no_helmet: 3000,
//     go_to_the_sidewalk: 1398,
//     run_red_light: 2210
//   },
//   {
//     name: 'Mar',
//     no_helmet: 2000,
//     go_to_the_sidewalk: 9800,
//     run_red_light: 2290
//   },
//   {
//     name: 'Apr',
//     no_helmet: 2780,
//     go_to_the_sidewalk: 3908,
//     run_red_light: 2000
//   },
//   {
//     name: 'May',
//     no_helmet: 1890,
//     go_to_the_sidewalk: 4800,
//     run_red_light: 2181
//   },
//   {
//     name: 'Jun',
//     no_helmet: 2390,
//     go_to_the_sidewalk: 3800,
//     run_red_light: 2500
//   },
//   {
//     name: 'Jul',
//     no_helmet: 3490,
//     go_to_the_sidewalk: 4300,
//     run_red_light: 2100
//   },

//   {
//     name: 'Aug',
//     no_helmet: 3490,
//     go_to_the_sidewalk: 4300,
//     run_red_light: 2100
//   },
//   {
//     name: 'Sep',
//     no_helmet: 2390,
//     go_to_the_sidewalk: 3800,
//     run_red_light: 2500
//   },
//   {
//     name: 'Oct',
//     no_helmet: 3490,
//     go_to_the_sidewalk: 4300,
//     run_red_light: 2100
//   },
//   {
//     name: 'Nov',
//     no_helmet: 3490,
//     go_to_the_sidewalk: 4300,
//     run_red_light: 2100
//   },
//   {
//     name: 'Dec',
//     no_helmet: 3490,
//     go_to_the_sidewalk: 4300,
//     run_red_light: 2100
//   }
// ];

export function* handleDataChartLoad(action) {
  const {params} = action;
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
    const data = yield call(() => ReportApi.getChartData(payloadDataChart));
    const dataConvert = data.map((d) => {

      let a = {}

      if (!isEmpty(d.event1)) {
        a[d.event1] =  d.totalEvent1 + 300
      }

      if (!isEmpty(d.event2)) {
        a[d.event2] =  d.totalEvent2 + 200
      }

      if (!isEmpty(d.event3)) {
        a[d.event3] =  d.totalEvent3 + 100
      }

      return {
        name: d.time,
        [d.event1]: d.totalEvent1 + 300,
        ...a
      }
    })

    yield put(setDataChart(dataConvert));
  } catch (error) {
    yield put(setError(error.toString()));
  }
}

export default function* watchTreeCamGroupLoad() {
  yield takeLatest(DATA_CHART.LOAD, handleDataChartLoad);
}
