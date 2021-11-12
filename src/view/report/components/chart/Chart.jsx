import { isEmpty } from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { loadDataChart } from '../../redux/actions';
import './chart.scss';
import ExportReport from './ExportReport';

var randomColor = require('randomcolor');

function Chart(props) {
  const data = props.chartData;

  const dataConvert = (data) => {
    const dataNoName = data[0];

    delete dataNoName.name;

    const keyArr = Object.keys(dataNoName);

    return keyArr.map((k) => {
      return (
        <Line
          type="monotone"
          dataKey={k}
          stroke={randomColor()}
          activeDot={{ r: 8 }}
        />
      );
    });
  };

  if (isEmpty(data)) {
    return null;
  }

  return (
    <>
      {props.isShowLineAndPieChart && (
        <div className="Chart">
          <div className="Chart__title">
            <h3> BIỂU ĐỒ XU THẾ TÌNH HÌNH {props.title.toUpperCase()} </h3>

            <ExportReport type="rateReport"/>
          </div>

          <ResponsiveContainer
            width="95%"
            aspect={3 / 1}
            className="ResponsiveContainer"
          >
            <LineChart
              width={500}
              height={300}
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />

              {dataConvert(data)}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </>
  );
}

const mapStateToProps = (state) => ({
  isLoading: state.chart.isLoading,
  chartData: state.chart.chartData,
  error: state.chart.error,
  title: state.chart.title,
  isShowLineAndPieChart: state.chart.isShowLineAndPieChart
});

const mapDispatchToProps = (dispatch) => {
  return {
    callData: (params) => {
      dispatch(loadDataChart(params));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chart);
