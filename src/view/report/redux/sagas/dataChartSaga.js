import { put, takeLatest } from 'redux-saga/effects';
import { setDataChart, setError } from '../actions';
import { DATA_CHART} from '../constants';

const data = [
  {
    name: 'Jan',
    no_helmet: 4000,
    go_to_the_sidewalk: 2400,
    run_red_light: 2400
  },
  {
    name: 'Feb',
    no_helmet: 3000,
    go_to_the_sidewalk: 1398,
    run_red_light: 2210
  },
  {
    name: 'Mar',
    no_helmet: 2000,
    go_to_the_sidewalk: 9800,
    run_red_light: 2290
  },
  {
    name: 'Apr',
    no_helmet: 2780,
    go_to_the_sidewalk: 3908,
    run_red_light: 2000
  },
  {
    name: 'May',
    no_helmet: 1890,
    go_to_the_sidewalk: 4800,
    run_red_light: 2181
  },
  {
    name: 'Jun',
    no_helmet: 2390,
    go_to_the_sidewalk: 3800,
    run_red_light: 2500
  },
  {
    name: 'Jul',
    no_helmet: 3490,
    go_to_the_sidewalk: 4300,
    run_red_light: 2100
  },

  {
    name: 'Aug',
    no_helmet: 3490,
    go_to_the_sidewalk: 4300,
    run_red_light: 2100
  },
  {
    name: 'Sep',
    no_helmet: 2390,
    go_to_the_sidewalk: 3800,
    run_red_light: 2500
  },
  {
    name: 'Oct',
    no_helmet: 3490,
    go_to_the_sidewalk: 4300,
    run_red_light: 2100
  },
  {
    name: 'Nov',
    no_helmet: 3490,
    go_to_the_sidewalk: 4300,
    run_red_light: 2100
  },
  {
    name: 'Dec',
    no_helmet: 3490,
    go_to_the_sidewalk: 4300,
    run_red_light: 2100
  }
];

export function* handleDataChartLoad(action) {
  try {
    yield put(setDataChart(data));
  } catch (error) {
    yield put(setError(error.toString()));
  }
}

export default function* watchTreeCamGroupLoad() {
  yield takeLatest(DATA_CHART.LOAD, handleDataChartLoad);
}
