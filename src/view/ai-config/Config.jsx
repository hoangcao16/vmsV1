import { Select, Tabs } from "antd";
import "antd/dist/antd.css";
import React, { useEffect, useState } from "react";
import "react-calendar-timeline/lib/Timeline.css";
import { useTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import { reactLocalStorage } from "reactjs-localstorage";
import CameraApi from "../../actions/api/camera/CameraApi";
import Breadcrumds from "../breadcrumds/Breadcrumds";
import "./../commonStyle/commonInput.scss";
import "./../commonStyle/commonSelect.scss";
import "./../commonStyle/commonTable.scss";
import "./Config.scss";
import { MemoizedTabType } from "./TabType";

const { TabPane } = Tabs;

export const CATEGORY_NAME = {
  EVENT_TYPE: "EVENT_TYPE",
  VENDOR: "VENDOR",
  CAMERA_TYPE: "CAMERA_TYPE",
  AD_DIVISIONS: "AD_DIVISIONS",
  FIELD: "FIELD",
};

const { Option } = Select;
const Config = () => {
  const { t } = useTranslation();
  const language = reactLocalStorage.get("language");
  const [selectedHumansId, setSelectedHumansId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [total, setTotal] = useState(0);
  const [checkStatus, setCheckStatus] = useState(false);
  const [listCameras, setListCameras] = useState([]);
  const [cameraUuid, setCameraUuid] = useState("");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(100);
  const [data, setData] = useState(false);

  useEffect(() => {
    if (
      language === "vn"
        ? (document.title = "CCTV | Quản lý sự kiện thông minh")
        : (document.title = "CCTV | AI Config Management")
    );

    const data = {
      page: page,
      size: size,
    };
    CameraApi.getAllCamera(data).then((result) => {
      setListCameras(result);
    });
  }, []);

  function onSearch(val) {
    console.log("search:", val);
  }

  function onChangeSelect(selected) {
    setCameraUuid(selected);
  }

  return (
    <div className="tabs__container--ai_config">
      <Breadcrumds
        url="/app/setting"
        nameParent={t("breadcrumd.setting")}
        nameChild={t("view.ai_config.config")}
      />

      <div className="search mt-12 ">
        <Select
          showSearch
          style={{ width: "50%", marginBottom: "40px" }}
          placeholder={t("view.ai_config.choose_camera")}
          optionFilterProp="children"
          onSearch={onSearch}
          onChange={onChangeSelect}
          // filterOption={(input, option) =>
          //   option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          // }
        >
          {listCameras.map((x) => (
            <Option key={x.uuid} value={x.uuid}>
              {x.name}
            </Option>
          ))}
        </Select>
      </div>
      <div className="tabs__container--store">
        <Tabs type="card">
          <TabPane tab={t("view.ai_config.hurdles_events")} key="1">
            <MemoizedTabType cameraUuid={cameraUuid} type="hurdles" />
          </TabPane>
          <TabPane
            tab={t("view.ai_config.intrusion_detection_events")}
            key="2"
            width="480px"
          >
            <MemoizedTabType
              cameraUuid={cameraUuid}
              type="intrusion_detection"
            />
          </TabPane>
          <TabPane tab={t("view.ai_config.attendance_events")} key="3">
            <MemoizedTabType cameraUuid={cameraUuid} type="attendance" />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default withRouter(Config);
