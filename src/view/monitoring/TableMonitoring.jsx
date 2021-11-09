import 'antd/dist/antd.css';
import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import Breadcrumbs from "../../components/@vuexy/breadCrumbs/BreadCrumb";

const TableMonitoring = () => {
  useEffect(() => {
    document.title = 'CCTV | Quản lý Giám sát';
  }, []);

  return (
    <>
      <Breadcrumbs
          breadCrumbTitle="Quản lý giám sát"
          breadCrumbParent="Giám sát"
          breadCrumbActive="Danh sách"
      />
      <h1>Quản lý giám sát</h1>
    </>
  );
};

export default withRouter(TableMonitoring);
