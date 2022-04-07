import { isEmpty } from "lodash";
import moment from "moment";

export default function ConvertDataChart(data) {
  if (!isEmpty(data)) {
    let dataChart = data?.res?.DataChartEvent;

    if (data?.date?.typeTime == "DAY") {
      const start = moment(data?.date?.startDate, "DD/MM/YYYY");
      const end = moment(data?.date?.endDate, "DD/MM/YYYY");
      if (moment(start).diff(end, "d") < 0) {
        dataChart.map((i) => {
          i.time = moment(i.time, "DD/MM/YYYY").format("DD/MM");
        });
      } else {
        data.res.DataChartEvent = [];
        data.res.Percents = [];
      }
    } else if (data?.date?.typeTime == "MONTH") {
      const start = moment(data?.date?.startDate, "MM/YYYY");
      const end = moment(data?.date?.endDate, "MM/YYYY");
      if (!moment(end).diff(start, "M") > 0) {
        data.res.DataChartEvent = [];
        data.res.Percents = [];
      }
    }
     else if (data?.date?.typeTime == "YEAR") {
      const start = moment(data?.date?.startDate, "YYYY");
      const end = moment(data?.date?.endDate, "YYYY");
      if (!moment(end).diff(start, "y") > 0) {
        data.res.DataChartEvent = [];
        data.res.Percents = [];
      }
    }
  }
  return data;
}
