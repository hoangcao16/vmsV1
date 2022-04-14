import { Tooltip as TooltipAnt } from "antd";
import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { Cell, Pie, PieChart } from "recharts";
import permissionCheck from "../../../../actions/function/MyUltil/PermissionCheck";
import { loadDataChart } from "../../redux/actions";
import ExportReport from "./ExportReport";
import "./pieChart.scss";
import { COLOR } from "./BarChart";
import ExportReportToMail from "./ExportReportToMail";
import moment from "moment";
import ConvertDataChart from "../../../../actions/function/MyUltil/ConvertDataChart";

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="insideTopLeft"
      fontSize={12}
    >
      {percent < 0.01 ? "" : `${(percent * 100).toFixed(2)}%`}
    </text>
  );
};

function PieChartComponents(props) {
  let dataPieChart = props.chartData?.res?.Percents;
  let dataConvert = [];
  if (!isEmpty(dataPieChart)) {
    for (let key in dataPieChart) {
      let dataItem = {};
      dataItem.name = key;
      dataItem.value = Number(dataPieChart[key]);
      dataConvert.push(dataItem);
    }
  }
  const { t } = useTranslation();

  if (props.isLoading) {
    return null;
  }

  return (
    <>
      {props?.typeChart.includes("circle") && (
        <div className="PieChart">
          <div className="PieChart__title">
            <h3>
              {" "}
              {t(
                "view.report.situation_chart"
              )} {props.title.toUpperCase()}{" "}
            </h3>
            {/* {permissionCheck("export_report") && (
              <div className="export">
                <ExportReport type="rateReport" />
                <ExportReportToMail type="tableReport" />
              </div>
            )} */}
          </div>
          <PieChart width={400} height={400}>
            <Pie
              data={dataConvert}
              cx={200}
              cy={200}
              labelLine={false}
              label={renderCustomizedLabel}
              fill="#8884d8"
              dataKey="value"
            >
              {dataConvert.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLOR[index]} />
              ))}
            </Pie>
          </PieChart>

          <div>
            {dataConvert.map((p, index) => {
              return (
                <span style={{ color: COLOR[index], padding: 10 }}>
                  {p.name.length > 25 ? (
                    <TooltipAnt placement="top" title={p.name}>
                      {`${p.name.slice(0, 25)}: ${p.value}%`}
                    </TooltipAnt>
                  ) : (
                    `${p.name}: ${p.value}%`
                  )}
                </span>
              );
            })}
          </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(PieChartComponents);
