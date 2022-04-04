import { Tabs } from "antd";
import React from "react";
import { withRouter } from "react-router-dom";
import TableCamproxy from "./camproxy/TableCamproxy";
import "./DeviceManage.scss";
import TableNVR from "./nvr/TableNVR";
import TablePlayback from "./playback/TablePlayback";
import TableZone from "./zone/TableZone";

import Breadcrumds from "./../breadcrumds/Breadcrumds";
import { useTranslation } from "react-i18next";

const { TabPane } = Tabs;

const DeviceManage = () => {
  const { t } = useTranslation();
  return (
    <>
      <Breadcrumds
        url="/app/setting"
        nameParent={t("breadcrumd.setting")}
        nameChild={t("view.user.device")}
      />

      <div className="tabs__container--store">
        <Tabs type="card">
          <TabPane tab="NVR" key="1">
            <TableNVR />
          </TabPane>
          <TabPane tab="Playback" key="2">
            <TablePlayback />
          </TabPane>
          <TabPane tab="Zone" key="3">
            <TableZone />
          </TabPane>
          <TabPane tab="Camproxy" key="4">
            <TableCamproxy />
          </TabPane>
        </Tabs>
      </div>
    </>
  );
};

export default withRouter(DeviceManage);
