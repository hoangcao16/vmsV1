import React, { useEffect, useRef, useState } from "react";
import { Table } from "antd";
import { connect } from "react-redux";
import { loadTableDataChart } from "../../redux/actions";
import "./TableChart.scss";
import moment from "moment";
import { useTranslation } from "react-i18next";
import permissionCheck from "../../../../actions/function/MyUltil/PermissionCheck";
import ExportReport from "./ExportReport";
import ExportReportToMail from "./ExportReportToMail";
import { isEmpty } from "lodash";

function TableChart(props) {
  const { t } = useTranslation();
  const dataSource = props.dataTableChart || [];
  const [parseData, setParseData] = useState([]);
  const nextIndex = {
    type: 0,
    location: 0,
  };

  useEffect(() => {
    processParseData();
  }, [props.dataTableChart]);

  const processParseData = () => {
    let newData = [];
    const uniqueEvent = Array.from(
      new Set(dataSource.map((item) => item.eventUuid))
    );

    uniqueEvent.forEach((eventId) => {
      const listEvents = dataSource.filter((obj) => obj.eventUuid === eventId);
      listEvents.sort((a, b) => (a.nameLocation > b.nameLocation ? -1 : 1));
      newData = [...newData, ...listEvents];
    });

    setParseData(newData);
  };

  const mergeColumn = (row, index) => {
    if (nextIndex.type >= dataSource.length) {
      nextIndex.type = 0;
    }

    const totalRows = dataSource.filter(
      (obj) => obj.eventUuid === row.eventUuid
    );

    if (index === 0 || index === nextIndex.type) {
      nextIndex.type += totalRows.length;
      return {
        rowSpan: totalRows.length,
      };
    } else {
      return {
        rowSpan: 0,
        colSpan: 0,
      };
    }
  };

  const mergeColumnLocation = (row, index) => {
    if (nextIndex.location >= dataSource.length) {
      nextIndex.location = 0;
    }

    const totalRows = dataSource.filter(
      (obj) =>
        obj.eventUuid === row.eventUuid && obj.nameLocation === row.nameLocation
    );

    if (index === 0 || index === nextIndex.location) {
      nextIndex.location += totalRows.length;
      return {
        rowSpan: totalRows.length,
      };
    } else {
      return {
        rowSpan: 0,
        colSpan: 0,
      };
    }
  };

  const generateColumn = () => {
    let format = {
      dateStringFormat: "DDMMYYYY",
      dateFormat: "DD/MM/YYYY",
      unit: "d",
      start: "01/01/2022",
      end: "10/01/2022",
    };

    switch (props.date.typeTime) {
      case "WEEK":
        format = {
          dateStringFormat: "WWYYYY",
          dateFormat: "WW-YYYY",
          unit: "w",
          start: "01-2022",
          end: "10-2022",
        };
        break;
      case "MONTH":
        format = {
          dateStringFormat: "MMYYYY",
          dateFormat: "MM/YYYY",
          unit: "M",
          start: "01/2022",
          end: "02/2022",
        };
        break;
      case "YEAR":
        format = {
          dateStringFormat: "YYYY",
          dateFormat: "YYYY",
          unit: "y",
          start: "2018",
          end: "2022",
        };
        break;
      default:
        format = {
          dateStringFormat: "DDMMYYYY",
          dateFormat: "DD/MM/YYYY",
          unit: "d",
          start: "01/01",
          end: "10/01",
        };
        break;
    }

    if (!isEmpty(props.date.startDate)) {
      format.start = moment(
        props.date.startDate,
        format.dateStringFormat
      ).format(format.dateFormat);
    }

    if (!isEmpty(props.date.endDate)) {
      format.end = moment(props.date.endDate, format.dateStringFormat).format(
        format.dateFormat
      );
    }

    const startDate = moment(format.start, format.dateFormat);
    const endDate = moment(format.end, format.dateFormat);

    let diff = moment(endDate).diff(startDate, format.unit);
    if (diff < 0) {
      diff = -1;
    }

    return Array.from(new Array(diff + 1)).map((val, key) => {
      const name = startDate.format(format.dateFormat);
      startDate.add(1, format.unit);
      if (props.date.typeTime == "DAY") {
        return {
          width: 100,
          align: "center",
          className: "p-0",
          title: moment(name, "DD/MM/YYYY").format("DD/MM"),
          dataIndex: name,
          key,
        };
      }
      return {
        width: 100,
        align: "center",
        className: "p-0",
        title: name,
        dataIndex: name,
        key,
      };
    });
  };

  var columns = [
    {
      title: `${t("view.report.type_violation")}`,
      dataIndex: "type",
      key: "type",
      fixed: "left",
      width: 150,
      onCell: (_, index) => mergeColumn(_, index),
    },
    {
      title: `${t("view.map.location")}`,
      dataIndex: "nameLocation",
      key: "nameLocation",
      fixed: "left",
      width: 150,
      onCell: (_, index) => mergeColumnLocation(_, index),
    },
    {
      title: `${t("view.camera.camera_name", { cam: t("camera") })}`,
      dataIndex: "nameCamera",
      key: "nameCamera",
      fixed: "left",
      width: 100,
    },
    ...generateColumn(),
  ];

  return (
    <>
      {
        <div className="table-chart">
          <div className="table-chart__title">
            <h3>
              {" "}
              {t(
                "view.report.situation_report"
              )} {props.title.toUpperCase()}{" "}
            </h3>
            {permissionCheck("export_report") && (
              <div className="export">
                <ExportReport type="tableReport" />
                <ExportReportToMail type="tableReport" />
              </div>
            )}
          </div>
          <Table
            dataSource={parseData}
            columns={columns}
            pagination={false}
            className="table-report"
            scroll={{ x: "max-content", y: 500 }}
          />
        </div>
      }
    </>
  );
}

const mapStateToProps = (state) => ({
  isLoading: state.chart.isLoading,
  error: state.chart.error,
  title: state.chart.title,
  typeChart: state.chart.typeChart,
  dataTableChart: state.chart?.dataTableChart?.data?.tableEvents,
  date: state.chart?.dataTableChart?.date,
});

const mapDispatchToProps = (dispatch) => {
  return {
    callData: (params) => {
      dispatch(loadTableDataChart(params));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableChart);
