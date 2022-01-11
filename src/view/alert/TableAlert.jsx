import "antd/dist/antd.css";
import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import Breadcrumbs from "../../components/@vuexy/breadCrumbs/BreadCrumb";
import { useTranslation } from "react-i18next";
import { reactLocalStorage } from "reactjs-localstorage";

const TableAlert = () => {
  const { t } = useTranslation();
  const language = reactLocalStorage.get("language");

  useEffect(() => {
    if (
      language === "vn"
        ? (document.title = "CCTV | Quản lý cảnh báo")
        : (document.title = "CCTV | Alert Management")
    );
  },[t]);

  return (
    <>
      <Breadcrumbs
          breadCrumbTitle="Quản lý cảnh báo"
          breadCrumbParent="Sự kiện"
          breadCrumbActive="Báo cáo"  
      />
    </>
  );
}

export default withRouter(TableAlert);
