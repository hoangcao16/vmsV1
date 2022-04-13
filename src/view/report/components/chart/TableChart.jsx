import React from "react";
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
  let dataSource = props.dataTableChart || [];
  dataSource.sort(function (a, b) {
    if (a.eventUuid < b.eventUuid) {
      return -1;
    }
    if (a.eventUuid > b.eventUuid) {
      return 1;
    }
    return 0;
  });

  const existedId = {};
  const mergeColumn = (eventUuid) => {
    const totalRows = dataSource.filter(
      (obj) => obj.eventUuid === eventUuid
    ).length;

    if (!existedId[eventUuid] || existedId[eventUuid] < 1) {
      existedId[eventUuid] = 1;

      return {
        rowSpan: totalRows,
        colSpan: 1,
      };
    }

    existedId[eventUuid]++;

    if (existedId[eventUuid] >= totalRows) {
      existedId[eventUuid] = 0;
    }

    return {
      rowSpan: 0,
      colSpan: 0,
    };
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
      case "DAY":
        format = {
          dateStringFormat: "DDMMYYYY",
          dateFormat: "DD/MM/YYYY",
          unit: "d",
          start: "01/01",
          end: "10/01",
        };
        break;
      case "WEEK":
        format = {
          dateStringFormat: "DDMMYYYY",
          dateFormat: "DD/MM/YYYY",
          unit: "w",
          start: "01/01/2022",
          end: "10/01/2022",
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
          title: moment(name, "DD/MM/YYYY").format("DD/MM"),
          dataIndex: name,
          key,
        };
      }
      return {
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
      width: 120,
      render: (val, row) => {
        return {
          props: {
            ...mergeColumn(row.eventUuid),
          },
          children: <b>{val}</b>,
        };
      },
    },
    {
      title: `${t("view.camera.camera_name", { cam: t("camera") })}`,
      dataIndex: "nameCamera",
      key: "nameCamera",
      fixed: "left",
      width: 220,
    },
    ...generateColumn(),
  ];

  return (
    <>
      {(props?.typeChart == "all" || props?.typeChart == "table") && (
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
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            className="table-report"
            scroll={{ x: 1400, y: 500 }}
          />
        </div>
      )}
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
