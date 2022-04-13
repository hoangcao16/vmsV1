import { Tooltip as TooltipAnt } from "antd";
import { isEmpty } from "lodash";
import React from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import permissionCheck from "../../../../actions/function/MyUltil/PermissionCheck";
import { loadDataChart } from "../../redux/actions";
import "./barChart.scss";
import ExportReport from "./ExportReport";
import ExportReportToMail from "./ExportReportToMail";
import moment from "moment";
import ConvertDataChart from "../../../../actions/function/MyUltil/ConvertDataChart";

export const COLOR = [
  "#eb4034",
  "#7ccc47",
  "#425fd4",
  "#FCFC74",
  "#FFA45E",
  "#FB5EFF",
  "#E8618E",
  "#3AFFD8",
  "#973AFF",
  "#5BFF3A",
];

function BarChartComponent(props) {
  const data =
    props.chartData?.res?.DataChartEvent ||
    props.chartData?.res?.CompareChartEvent;
  const { t } = useTranslation();

  if (props.isLoading) {
    return null;
  }
  const dataConvert = (data) => {
    if (isEmpty(data)) {
      return;
    }
    let arr = [];
    arr = Object.fromEntries(
      Object.entries(data[0]).filter(([key]) => key !== "time")
    );
    const keyArr = Object.keys(arr);
    return keyArr.map((k, index) => {
      if (k.length > 25) {
        k = k.slice(0, 26) + "...";
      }
      return <Bar key={k} dataKey={k} fill={COLOR[index]} />;
    });
  };

  return (
    <>
      {props?.typeChart == "bar" && (
        <div className="BarChart">
          <>
            <div className="Chart__title">
              <h3>
                {" "}
                {t(
                  "view.report.situation_chart"
                )} {props.title.toUpperCase()}{" "}
              </h3>

              {/* {permissionCheck("export_report") && (
                <div className="export">
                  <ExportReport type="comparativeReport" />
                  <ExportReportToMail type="comparativeReport" />
                </div>
              )} */}
            </div>
            <BarChart
              width={870}
              height={450}
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
            </BarChart>
          </>
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

export default connect(mapStateToProps, mapDispatchToProps)(BarChartComponent);
