import { Card, Checkbox, Tabs } from "antd";
import React, { useState, useEffect } from "react";
import "react-calendar-timeline/lib/Timeline.css";
import { useTranslation } from "react-i18next";
import AIConfigApi from "../../actions/api/ai-config/AIConfigApi";
import "./TabType.scss";
import { bodyStyleCard, headStyleCard } from "./variables";
import _ from "lodash";
import { MemoizedTabSchedule } from "./TabSchedule";
import { MemoizedTabRect } from "./TabRect";

const { TabPane } = Tabs;
const TabType = (props) => {
  const { cameraUuid, type } = props;
  const { t } = useTranslation();
  const [checkStatus, setCheckStatus] = useState(false);
  const [activeCheckBox, setActiveCheckBox] = useState(false);

  useEffect(() => {
    if (cameraUuid !== null && cameraUuid !== "") {
      const data = {
        type: type,
        cameraUuid: cameraUuid,
      };
      setCheckStatus(false);

      AIConfigApi.getConfig(data).then((result) => {
        if (result.status === "1") {
          setCheckStatus(true);
        }
      });
      setActiveCheckBox(true);
    } else {
      setActiveCheckBox(false);
    }
  }, [cameraUuid, type]);

  const onChangeCheckBox = async (val) => {
    let status = "0";
    if (val.target.checked) {
      status = "1";
    }
    const body = {
      cameraUuid: cameraUuid,
      type: type,
      status: status,
    };

    try {
      let isPost = await AIConfigApi.editConfigStatus(body);

      if (isPost) {
        setCheckStatus(val.target.checked);
        const notifyMess = {
          type: "success",
          title: `${t("noti.success")}`,
          description: `${t("noti.successfully_config")}`,
        };
        Notification(notifyMess);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="tabs__container--tab_type">
      <div className="activate tab_type_checkbox">
        <Checkbox
          disabled={!activeCheckBox}
          onChange={onChangeCheckBox}
          checked={checkStatus}
        >
          {t("view.ai_config.activate_" + type)}
        </Checkbox>
      </div>

      <Card
        bodyStyle={bodyStyleCard}
        headStyle={headStyleCard}
        className="card--category"
        // headStyle={{ padding: 30 }}
      >
        <div className="">
          <Tabs type="card">
            {type !== "attendance" ? (
              <TabPane tab={t("view.ai_config.area_config")} key="2">
                <MemoizedTabRect
                  cameraUuid={cameraUuid}
                  type={type}
                ></MemoizedTabRect>
              </TabPane>
            ) : null}
            <TabPane tab={t("view.ai_config.schedule_config")} key="1">
              <MemoizedTabSchedule
                cameraUuid={cameraUuid}
                type={type}
                status={checkStatus}
              ></MemoizedTabSchedule>
            </TabPane>
          </Tabs>
        </div>
      </Card>
    </div>
  );
};

function tabSchedulePropsAreEqual(prevTabType, nextTabType) {
  return (
    _.isEqual(prevTabType.cameraUuid, nextTabType.cameraUuid) &&
    _.isEqual(prevTabType.type, prevTabType.type)
  );
}

export const MemoizedTabType = React.memo(TabType, tabSchedulePropsAreEqual);
