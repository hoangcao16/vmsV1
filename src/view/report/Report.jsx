import "antd/dist/antd.css";
import { isEmpty } from "lodash";
import React, { useEffect } from "react";
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
import FeatureInfo from "./components/featureInfo/FeatureInfo";
import Sidebar from "./components/sidebar/Sidebar";
import "./Report.scss";

const TableReport = (props) => {
  const { t } = useTranslation();
  const language = reactLocalStorage.get("language");

  useEffect(() => {
    if (
      language === "vn"
        ? (document.title = "CCTV | Quản lý báo cáo")
        : (document.title = "CCTV | Report Management")
    );
  }, [t]);

  const rendered = ()=>{

    if(!isEmpty(props.chartData)){
      return (
        <div className="body__content">
        <Chart />
        <PieChartComponents />
        <BarChartComponent />
      </div>
      )
    }
    return (<div className="body__noContent">
      {t('noti.field_no_data').toUpperCase()}
    </div>)
  }

  return (
    <>
      <div className="containerReport">
        <div className="header">
          <Breadcrumds url="/app/report" nameParent={t("breadcrumd.report")} />

          {/* <Topbar /> */}
          <FeatureInfo />
        </div>
        <div className="body">
          {!props.isLoading ? rendered() : (
            <Loading />
          )}
          <div className="body__slidebar">
            <Sidebar />
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  isLoading: state.chart.isLoading,
  chartData: state.chart.chartData.data,
});

export default connect(mapStateToProps)(withRouter(TableReport));
