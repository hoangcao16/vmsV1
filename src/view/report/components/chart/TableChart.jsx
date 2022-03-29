import React from "react";
import { Table } from "antd";
import { connect } from "react-redux";
import { loadDataChart } from "../../redux/actions";
import "./TableChart.scss";
import moment from 'moment'

function TableChart(props) {

  const dataSource = [
    {
      key: "1",
      type: "Vượt đèn đỏ",
      id: "123abc",
      nameCamera: "Cam1",
      "20/01": 10,
      "21/01": 10,
      "22/01": 10,
      "23/01": 10,
      "24/01": 10,
      "25/01": 10,
      "26/01": 10,
      "27/01": 10,
      "28/01": 10,
      "29/01": 10,
      "30/01": 100,
    },
    {
      key: "2",
      type: "Vượt đèn đỏ",
      id: "123abc",
      nameCamera: "Cam2",
      "20/01": 10,
      "21/01": 10,
      "22/01": 10,
      "23/01": 10,
      "24/01": 10,
      "25/01": 10,
      "26/01": 10,
      "27/01": 10,
      "28/01": 10,
      "29/01": 10,
      "30/01": 100,
    },
    {
      key: "3",
      type: "Vượt đèn đỏ",
      id: "123abc",
      nameCamera: "Cam3",
      "20/01": 10,
      "21/01": 10,
      "22/01": 10,
      "23/01": 10,
      "24/01": 10,
      "25/01": 10,
      "26/01": 10,
      "27/01": 10,
      "28/01": 10,
      "29/01": 10,
    },
    {
      key: "4",
      type: "Không đội mũ",
      id: "asdfgh",
      nameCamera: "Cam1",
      "20/01": 10,
      "21/01": 10,
      "22/01": 10,
      "23/01": 10,
      "24/01": 10,
      "25/01": 10,
      "26/01": 10,
      "27/01": 10,
      "28/01": 10,
      "29/01": 10,
    },
    {
      key: "5",
      type: "Không đội mũ",
      id: "asdfgh",
      nameCamera: "Cam2",
      "20/01": 10,
      "21/01": 10,
      "22/01": 10,
      "23/01": 10,
      "24/01": 10,
      "25/01": 10,
      "26/01": 10,
      "27/01": 10,
      "28/01": 10,
      "29/01": 10,
    },
    {
      key: "6",
      type: "Không đội mũ",
      id: "asdfgh",
      nameCamera: "Cam3",
      "20/01": 10,
      "21/01": 10,
      "22/01": 10,
      "23/01": 10,
      "24/01": 10,
      "25/01": 10,
      "26/01": 10,
      "27/01": 10,
      "28/01": 10,
      "29/01": 10,
    },
  ];

  const existedId = {}
  const mergeColumn = (id) => {
    const totalRows = dataSource.filter(obj => obj.id === id).length;

    if(!existedId[id] || existedId[id] < 1){
      existedId[id] = 1;

      return {
        rowSpan: totalRows,
        colSpan: 1
      };
    }

    existedId[id]++;

    if(existedId[id] >= totalRows){
      existedId[id] = 0
    }
    
    return {
      rowSpan: 0,
      colSpan: 0,
    };
  }

  const generateColumn = () => {
    const startDate = moment('20/01/2022', 'DD/MM/YYYY')
    const endDate = moment('25/01/2022', 'DD/MM/YYYY')

    const diff = moment(endDate).diff(startDate, 'd');

    return Array.from(new Array(diff)).map((val, key) => {
      const name = startDate.format('DD/MM')
      startDate.add(1, 'd');
      return {
          title: name,
          dataIndex: name,
          key,
      }
    })
  }

  var columns = [
    {
      title: "Loại vi phạm",
      dataIndex: "type",
      key: "type",
      render: (val, row) => {
        return {
          props: {
            ...mergeColumn(row.id)
          },
          children: <b>{val}</b>
        };
      }
    },
    {
      title: "Tên Camera",
      dataIndex: "nameCamera",
      key: "nameCamera",
    },
    ...generateColumn()
  ];

  return (
    <>
      {(props?.typeChart == "all" || props?.typeChart == "table") && (
        <div className="table-chart">
          <Table dataSource={dataSource} columns={columns} pagination={false} />
        </div>
      )}
    </>
  );
}

const mapStateToProps = (state) => ({
  isLoading: state.chart.isLoading,
  chartData: state.chart.chartData.data,
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

export default connect(mapStateToProps, mapDispatchToProps)(TableChart);
