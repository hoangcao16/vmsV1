import { isEmpty } from "lodash";

export default function convertDataBarChart(arrObj) {
    if(!isEmpty(arrObj)) {
    console.log("arrObj", arrObj)
    console.log("arrObj[0]", arrObj[0])
    const first = arrObj[0]
    console.log("first", first)
    console.log("first", Object.keys(first))
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

        a.name = d.time
        return a
      })
    }
}