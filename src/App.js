import { ConfigProvider } from "antd";
import moment from "moment";
import "moment/locale/vi";
import "prismjs/themes/prism-tomorrow.css";
import React from "react";
import { I18nextProvider } from "react-i18next";
import "react-perfect-scrollbar/dist/css/styles.css";
import i18n from "./actions/i18n/i18n";
import "./components/@vuexy/rippleButton/RippleButton";
import Router from "./Router";
import "antd/dist/antd.css";

moment.locale("vi-vn");

const App = (props) => {
  return <Router />;
};

export default () => (
  <I18nextProvider i18n={i18n}>
    <ConfigProvider>
      <App />
    </ConfigProvider>
  </I18nextProvider>
);
