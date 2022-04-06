import { ConfigProvider } from "antd";
import moment from "moment";
import "moment/locale/vi";
import "prismjs/themes/prism-tomorrow.css";
import React, { useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import "react-perfect-scrollbar/dist/css/styles.css";
import i18n from "./actions/i18n/i18n";
import "./components/@vuexy/rippleButton/RippleButton";
import Router from "./Router";
import "antd/dist/antd.css";
import { reactLocalStorage } from "reactjs-localstorage";
import vnVN from 'antd/lib/locale/vi_VN';
import enUS from 'antd/lib/locale/en_US';

moment.locale("vi-vn");

vnVN.Empty.description = "Không có dữ liệu";

const language = reactLocalStorage.get("language");

const App = (props) => {
  return <Router />;
};

export default () => (
  <I18nextProvider i18n={i18n}>
    <ConfigProvider locale={language === "vn" ? vnVN : enUS}>
      <App />
    </ConfigProvider>
  </I18nextProvider>
);
