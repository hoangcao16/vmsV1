import 'antd/dist/antd.css';
import React, { useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { withRouter } from 'react-router-dom';
import { reactLocalStorage } from "reactjs-localstorage";
import Breadcrumds from '../breadcrumds/Breadcrumds';
import './app.scss';
import BarChartComponent from './components/chart/BarChart';
import Chart from './components/chart/Chart';
import PieChartComponents from './components/chart/PieChart';
import FeatureInfo from './components/featureInfo/FeatureInfo';
import Sidebar from './components/sidebar/Sidebar';
import './Report.scss';

const TableReport = () => {
  const { t } = useTranslation();
  const language = reactLocalStorage.get("language");

  useEffect(() => {
    if (
      language === "vn"
        ? (document.title = "CCTV | Quản lý báo cáo")
        : (document.title = "CCTV | Report Management")
    );
  }, [t]);

  return (
    <>
      <div className="containerReport">
        <div className="header">
          <Breadcrumds url="/app/report" nameParent={t('breadcrumd.report')} />

          {/* <Topbar /> */}
          <FeatureInfo />
        </div>
        <div className="body">
          <div className="body__content">
            <Chart />
            <PieChartComponents />
            <BarChartComponent />
          </div>
          <div className="body__slidebar">
            <Sidebar />
          </div>
        </div>
      </div>
    </>
  );
};

export default withRouter(TableReport);
