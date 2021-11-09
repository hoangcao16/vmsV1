import 'antd/dist/antd.css';
import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import Breadcrumbs from "../../components/@vuexy/breadCrumbs/BreadCrumb";

const TableEvent = () => {
  useEffect(() => {
    document.title = 'CCTV | Quản lý sự kiện';
  }, []);

  return (
    <>
      <Breadcrumbs
          breadCrumbTitle="Quản lý Sự kiện"
          breadCrumbParent="Sự kiện"
          breadCrumbActive="Danh sách"
      />
    </>
  );
};

export default withRouter(TableEvent);
