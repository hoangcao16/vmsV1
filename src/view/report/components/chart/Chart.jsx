import { Tooltip as TooltipAnt } from "antd";
import { isEmpty } from "lodash";
import React from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import permissionCheck from "../../../../actions/function/MyUltil/PermissionCheck";
import { loadDataChart } from "../../redux/actions";
import "./chart.scss";
import ExportReport from "./ExportReport";
import { COLOR } from "./BarChart";
import ExportReportToMail from "./ExportReportToMail";
import moment from "moment";
import ConvertDataChart from "../../../../actions/function/MyUltil/ConvertDataChart";

function Chart(props) {
  const data =
    props.chartData?.res?.DataChartEvent ||
    props.chartData?.res?.CompareChartEvent;

  const { t } = useTranslation();

  if (props.isLoading) {
    return null;
  }
  const dataConvert = (dataMap) => {
    if (isEmpty(data)) {
      return;
    }
    let arr = [];
    arr = Object.fromEntries(
      Object.entries(data[0]).filter(([key]) => key !== "time")
    );
    const keyArr = Object.keys(arr);
    return keyArr.map((k, index) => {
      return (
        <Line
          key={k}
          type="monotone"
          dataKey={
            k.length > 25 ? (
              <TooltipAnt placement="bottomRight" title={k}>
                {k.slice(0, 25) + "..."}
              </TooltipAnt>
            ) : (
              k
            )
          }
          stroke={COLOR[index]}
          activeDot={{ r: 8 }}
        />
      );
    });
  };

  return (
    <>
      {(props?.typeChart == "all" || props?.typeChart == "line") && (
        <div className="Chart">
          <div className="Chart__title">
            <h3>
              {" "}
              {t(
                "view.report.situation_chart"
              )} {props.title.toUpperCase()}{" "}
            </h3>

            {/* {permissionCheck("export_report") && (
              <div className="export">
                <ExportReport type="trendReport" />
                <ExportReportToMail type="trendReport" />
              </div>
            )} */}
          </div>

          <LineChart
            width={870}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            {dataConvert(data)}
          </LineChart>
        </div>
      )}
    </>
  );
}

const mapStateToProps = (state) => ({
  isLoading: state.chart.isLoading,
  chartData: ConvertDataChart(state.chart.chartData.data),
  error: state.chart.error,
  title: state.chart.title,
  typeChart: state.chart.typeChart,
});

const mapDispatchToProps = (dispatch) => {
  return {
    callData: (params) => {
      dispatch(loadDataChart(params));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chart);
