import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Cell, Pie, PieChart } from 'recharts';
import { loadDataChart } from '../../redux/actions';
import ExportReport from './ExportReport';
import './pieChart.scss';
import { useTranslation } from 'react-i18next';
import convertDataChartAndPieChart from '../../../../actions/function/MyUltil/ConvertDataChartAndPieChart';

var randomColor = require('randomcolor');

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const total = (data, key) => {
  const dataTotal = data.map((d) => {
    return {
      [key]: d[key]
    };
  });

  return dataTotal.reduce(function (prev, cur) {
    return prev + cur[key];
  }, 0);
};

const dataConvert = (dataPieChart) => {
  const dataNoName = dataPieChart[0];

  if (dataNoName.name) {
    delete dataNoName.name;
  }

  const keyArr = Object.keys(dataNoName);

  const dataFinal = keyArr.map((k) => {
    return {
      value: total(dataPieChart, k),
      name: k,
      color: randomColor()
    };
  });

  return dataFinal;
};

function PieChartComponents(props) {
  const [dataPieChart, setDataPieChart] = useState([]);
  const { t } = useTranslation()
  useEffect(() => {
    const dataPieChart = props.chartData;
    if (!isEmpty(dataPieChart)) {
      const dataPieChartConvert = dataConvert(dataPieChart);
      setDataPieChart(dataPieChartConvert);
    }
  }, [props.chartData]);

  if (isEmpty(dataPieChart)) {
    return null;
  }

  return (
    <>
      {props.isShowLineAndPieChart && props.changeCount.length > 1 && (
        <div className="PieChart">
          <div className="PieChart__title">
            <h3> {t('view.report.proportion_chart')} {props.title.toUpperCase()} </h3>
            <ExportReport currentDataSource={dataPieChart} />
          </div>
          <PieChart width={400} height={400}>
            <Pie
              data={dataPieChart}
              cx={200}
              cy={200}
              // innerRadius={60}
              // outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={renderCustomizedLabel}
              labelLine={false}
            >
              {dataPieChart.map((entry, index) => {
                return <Cell key={`cell-${index}`} fill={entry.color} />;
              })}
            </Pie>
          </PieChart>

          <div>
            {dataPieChart.map((p, index) => {
              return (
                <span style={{ color: `${p?.color}`, padding: 10 }}>
                  {p.name}
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
  chartData: convertDataChartAndPieChart(state.chart.chartData),
  error: state.chart.error,
  title: state.chart.title,
  isShowLineAndPieChart: state.chart.isShowLineAndPieChart,
  changeCount: state.chart.changeCount
});

const mapDispatchToProps = (dispatch) => {
  return {
    callData: (params) => {
      dispatch(loadDataChart(params));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PieChartComponents);
