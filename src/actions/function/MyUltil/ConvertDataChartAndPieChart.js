import { isEmpty } from "lodash";

export default function convertDataChartAndPieChart(arrObj) {
  return arrObj.map((d) => {
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

    if (d.time.length > 7) {
      a.name = d.time.slice(0, 5)
    } else {
      a.name = d.time
    }
    return a
  })
}
