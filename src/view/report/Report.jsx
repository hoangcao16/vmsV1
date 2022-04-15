import "antd/dist/antd.css";
import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { reactLocalStorage } from "reactjs-localstorage";
import Breadcrumds from "../breadcrumds/Breadcrumds";
import Loading from "../common/element/Loading";
import "./app.scss";
import BarChartComponent from "./components/chart/BarChart";
import Chart from "./components/chart/Chart";
import PieChartComponents from "./components/chart/PieChart";
import TableChart from "./components/chart/TableChart";
import FeatureInfo from "./components/featureInfo/FeatureInfo";
import Sidebar from "./components/sidebar/Sidebar";
import "./Report.scss";
import moment from "moment";

const TableReport = (props) => {
  const [sidebarData, setSidebarData] = useState([]);
  const { t } = useTranslation();
  const language = reactLocalStorage.get("language");

  useEffect(() => {
    if (
      language === "vn"
        ? (document.title = "CCTV | Quản lý báo cáo")
        : (document.title = "CCTV | Report Management")
    );
  }, [t]);

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
    format.start = moment(props.date.startDate, format.dateStringFormat).format(
      format.dateFormat
    );
  }

  if (!isEmpty(props.date.endDate)) {
    format.end = moment(props.date.endDate, format.dateStringFormat).format(
      format.dateFormat
    );
  }

  const startDate = moment(format.start, format.dateFormat);
  const endDate = moment(format.end, format.dateFormat);

  const rendered = () => {
    if (sidebarData.selectedRowKeys?.length == 0) {
      return <div className="body__noContent">{t("noti.field_no_data")}</div>;
    } else if (isEmpty(sidebarData.feildIds)) {
      return <div className="body__noContent">{t("noti.no_feild")}</div>;
    } else if (startDate >= endDate) {
      return (
        <div className="body__noContent">
          {t("view.report.check_range_time")}
        </div>
      );
    } else {
      return (
        <div className="body__content">
          {!isEmpty(props.chartData) ? (
            <>
              <BarChartComponent />
              <Chart />
              <PieChartComponents />
            </>
          ) : (
            ""
          )}
          {!isEmpty(props.tableDataChart) ? (
            <TableChart sidebarData={sidebarData} />
          ) : (
            ""
          )}
        </div>
      );
    }
  };

  return (
    <>
      <div className="containerReport">
        <div className="header">
          <Breadcrumds url="/app/report" nameParent={t("breadcrumd.report")} />

          {/* <Topbar /> */}
          <FeatureInfo />
        </div>
        <div className="body">
          {!props.isLoading ? rendered() : <Loading />}
          <div className="body__slidebar">
            <Sidebar setSidebarData={setSidebarData} />
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  isLoading: state.chart.isLoading,
  chartData: state.chart.chartData,
  tableDataChart: state.chart.dataTableChart,
  date: state.chart?.dataTableChart?.date,
});

export default connect(mapStateToProps)(withRouter(TableReport));
