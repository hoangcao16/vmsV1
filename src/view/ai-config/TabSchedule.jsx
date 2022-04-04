import { EditOutlined } from "@ant-design/icons";
import { Button, Card, Table, Space, Popconfirm, Tooltip } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import moment from "moment";
import React, { useEffect, useState } from "react";
import Timeline from "react-calendar-timeline/lib";
import "react-calendar-timeline/lib/Timeline.css";
import { useTranslation } from "react-i18next";
import AIConfigScheduleApi from "../../actions/api/ai-config/AIConfigScheduleApi";
import ModalEditScheduleConfig from "./ModalEditScheduleConfig";
import ModalScheduleConfigCopy from "./ModalScheduleConfigCopy";
import "./TabSchedule.scss";
import { bodyStyleCard, headStyleCard } from "./variables";
import Notification from "../../components/vms/notification/Notification";
import _ from "lodash";
import TimelineHeaders from "react-calendar-timeline/lib/lib/headers/TimelineHeaders";
import SidebarHeader from "react-calendar-timeline/lib/lib/headers/SidebarHeader";
import DateHeader from "react-calendar-timeline/lib/lib/headers/DateHeader";

const TabSchedule = (props) => {
  const { cameraUuid, type, status } = props;
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [showModalCopy, setShowModalCopy] = useState(false);
  const [checkStatus, setCheckStatus] = useState(false);
  const [listDetail, setListDetail] = useState([]);
  const [listTimes, setListTimes] = useState([]);
  const [listTimesCN, setListTimesCN] = useState([]);
  const [listTimes2, setListTimes2] = useState([]);
  const [listTimes3, setListTimes3] = useState([]);
  const [listTimes4, setListTimes4] = useState([]);
  const [listTimes5, setListTimes5] = useState([]);
  const [listTimes6, setListTimes6] = useState([]);
  const [listTimes7, setListTimes7] = useState([]);
  const [data, setData] = useState({});
  const [selectDay, setSelectDay] = useState("");
  const [dataScheduleList, setDataScheduleList] = React.useState([]);

  useEffect(() => {
    if (cameraUuid != null && cameraUuid !== "") {
      const data = {
        type: type,
        cameraUuid: cameraUuid,
      };

      AIConfigScheduleApi.getAllConfigSchedule(data).then((result) => {
        setData(result);
        setDefaultData(result);
      });
    }
  }, [cameraUuid, type, status]);

  function setDefaultData(data) {
    const itemList = [];
    let i = 1;
    setListTimesCN(data?.sunday);
    data?.sunday &&
      data.sunday.map((item) => {
        const start = item.startTime * 1000;
        const end = item.endTime * 1000;
        itemList.push({
          id: i,
          group: 1,
          title: "",
          canMove: true,
          canResize: false,
          canChangeGroup: false,
          start_time: moment([
            2021,
            1,
            1,
            moment(start).get("hour"),
            moment(start).get("minute"),
            moment(start).get("second"),
            moment(start).get("millisecond"),
          ]),
          end_time: moment([
            2021,
            1,
            1,
            moment(end).get("hour"),
            moment(end).get("minute"),
            moment(end).get("second"),
            moment(end).get("millisecond"),
          ]),
        });
        i++;
      });
    setListTimes2(data?.monday);
    data?.monday &&
      data.monday.map((item) => {
        const start = item.startTime * 1000;
        const end = item.endTime * 1000;
        itemList.push({
          id: i,
          group: 2,
          title: "",
          canMove: true,
          canResize: false,
          canChangeGroup: false,
          start_time: moment([
            2021,
            1,
            1,
            moment(start).get("hour"),
            moment(start).get("minute"),
            moment(start).get("second"),
            moment(start).get("millisecond"),
          ]),
          end_time: moment([
            2021,
            1,
            1,
            moment(end).get("hour"),
            moment(end).get("minute"),
            moment(end).get("second"),
            moment(end).get("millisecond"),
          ]),
        });
        i++;
      });
    setListTimes3(data?.tuesday);
    data?.tuesday &&
      data.tuesday.map((item) => {
        const start = item.startTime * 1000;
        const end = item.endTime * 1000;
        itemList.push({
          id: i,
          group: 3,
          title: "",
          canMove: true,
          canResize: false,
          canChangeGroup: false,
          start_time: moment([
            2021,
            1,
            1,
            moment(start).get("hour"),
            moment(start).get("minute"),
            moment(start).get("second"),
            moment(start).get("millisecond"),
          ]),
          end_time: moment([
            2021,
            1,
            1,
            moment(end).get("hour"),
            moment(end).get("minute"),
            moment(end).get("second"),
            moment(end).get("millisecond"),
          ]),
        });
        i++;
      });
    setListTimes4(data?.wednesday);
    data?.wednesday &&
      data.wednesday.map((item) => {
        const start = item.startTime * 1000;
        const end = item.endTime * 1000;
        itemList.push({
          id: i,
          group: 4,
          title: "",
          canMove: true,
          canResize: false,
          canChangeGroup: false,
          start_time: moment([
            2021,
            1,
            1,
            moment(start).get("hour"),
            moment(start).get("minute"),
            moment(start).get("second"),
            moment(start).get("millisecond"),
          ]),
          end_time: moment([
            2021,
            1,
            1,
            moment(end).get("hour"),
            moment(end).get("minute"),
            moment(end).get("second"),
            moment(end).get("millisecond"),
          ]),
        });
        i++;
      });
    setListTimes5(data?.thursday);
    data?.thursday &&
      data.thursday.map((item) => {
        const start = item.startTime * 1000;
        const end = item.endTime * 1000;
        itemList.push({
          id: i,
          group: 5,
          title: "",
          canMove: true,
          canResize: false,
          canChangeGroup: false,
          start_time: moment([
            2021,
            1,
            1,
            moment(start).get("hour"),
            moment(start).get("minute"),
            moment(start).get("second"),
            moment(start).get("millisecond"),
          ]),
          end_time: moment([
            2021,
            1,
            1,
            moment(end).get("hour"),
            moment(end).get("minute"),
            moment(end).get("second"),
            moment(end).get("millisecond"),
          ]),
        });
        i++;
      });
    setListTimes6(data?.friday);
    data?.friday &&
      data.friday.map((item) => {
        const start = item.startTime * 1000;
        const end = item.endTime * 1000;
        itemList.push({
          id: i,
          group: 6,
          title: "",
          canMove: true,
          canResize: false,
          canChangeGroup: false,
          start_time: moment([
            2021,
            1,
            1,
            moment(start).get("hour"),
            moment(start).get("minute"),
            moment(start).get("second"),
            moment(start).get("millisecond"),
          ]),
          end_time: moment([
            2021,
            1,
            1,
            moment(end).get("hour"),
            moment(end).get("minute"),
            moment(end).get("second"),
            moment(end).get("millisecond"),
          ]),
        });
        i++;
      });
    setListTimes7(data?.saturday);
    data?.saturday &&
      data.saturday.map((item) => {
        const start = item.startTime * 1000;
        const end = item.endTime * 1000;
        itemList.push({
          id: i,
          group: 7,
          title: "",
          canMove: true,
          canResize: false,
          canChangeGroup: false,
          start_time: moment([
            2021,
            1,
            1,
            moment(start).get("hour"),
            moment(start).get("minute"),
            moment(start).get("second"),
            moment(start).get("millisecond"),
          ]),
          end_time: moment([
            2021,
            1,
            1,
            moment(end).get("hour"),
            moment(end).get("minute"),
            moment(end).get("second"),
            moment(end).get("millisecond"),
          ]),
        });
        i++;
      });
    setListDetail(itemList);
  }

  const getTimeLong = (start_m, end_m) => {
    if (start_m && end_m) {
      const start = moment([
        2021,
        1,
        1,
        start_m.get("hour"),
        start_m.get("minute"),
        start_m.get("second"),
        start_m.get("millisecond"),
      ]);
      const end = moment([
        2021,
        1,
        1,
        end_m.get("hour"),
        end_m.get("minute"),
        end_m.get("second"),
        end_m.get("millisecond"),
      ]);
      return {
        startTime: start.unix(),
        endTime: end.unix(),
      };
    }
  };

  const handleSubmit = async () => {
    // const status = "off"
    // if (checkStatus) {
    //   status = "on"
    // }
    const payload = {
      ...data,
      type: type,
      cameraUuid: cameraUuid,
      // status: status
    };
    try {
      let isPost = await AIConfigScheduleApi.addConfigSchedule(payload);

      if (isPost) {
        const notifyMess = {
          type: "success",
          title: `${t("noti.success")}`,
          description: `${t("noti.successfully_config")}`,
        };
        Notification(notifyMess);
        setShowModal(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateTimeConfig = (values) => {
    let data2 = data;
    const itemList = [];

    if (values.start_1 && values.end_1) {
      itemList.push(getTimeLong(values.start_1, values.end_1));
    }
    if (values.start_2 && values.end_2) {
      itemList.push(getTimeLong(values.start_2, values.end_2));
    }
    if (values.start_3 && values.end_3) {
      itemList.push(getTimeLong(values.start_3, values.end_3));
    }
    if (values.start_4 && values.end_4) {
      itemList.push(getTimeLong(values.start_4, values.end_4));
    }
    if (values.start_5 && values.end_5) {
      itemList.push(getTimeLong(values.start_5, values.end_5));
    }

    if (values.checkAll) {
      data2.sunday =
        data2.saturday =
        data2.monday =
        data2.tuesday =
        data2.wednesday =
        data2.thursday =
        data2.friday =
        data2.saturday =
          itemList;
    } else {
      switch (selectDay) {
        case "CN":
          data2.sunday = itemList;
          break;
        case "2":
          data2.monday = itemList;
          break;
        case "3":
          data2.tuesday = itemList;
          break;
        case "4":
          data2.wednesday = itemList;
          break;
        case "5":
          data2.thursday = itemList;
          break;
        case "6":
          data2.friday = itemList;
          break;
        case "7":
          data2.saturday = itemList;
          break;
        default:
      }
    }
    setShowModal(false);
    setData(data2);
    setDefaultData(data2);
  };

  const groups = [
    {
      id: 1,
      title: t("view.ai_config.time_week.CN"),
      bgColor: "white",
      rightTitle: (
        <Tooltip
          placement="bottomLeft"
          title={t("view.ai_config.edit_time.CN")}
        >
          <EditOutlined
            style={{ fontSize: "16px", color: "#6E6B7B" }}
            onClick={() => {
              setSelectDay("CN");
              if (!listTimesCN) {
                const defaultList = [];
                defaultList.push({
                  startTime: 1609434000,
                  endTime: 1609434000,
                });
                setListTimes(defaultList);
              } else {
                setListTimes(listTimesCN);
              }
              setShowModal(true);
            }}
          />
        </Tooltip>
      ),
    },
    {
      id: 2,
      title: t("view.ai_config.time_week.2"),
      bgColor: "white",
      rightTitle: (
        <Tooltip placement="bottomLeft" title={t("view.ai_config.edit_time.2")}>
          <EditOutlined
            style={{ fontSize: "16px", color: "#6E6B7B" }}
            onClick={() => {
              setSelectDay("2");
              if (!listTimes2) {
                const defaultList = [];
                defaultList.push({
                  startTime: 1609434000,
                  endTime: 1609434000,
                });
                setListTimes(defaultList);
              } else {
                setListTimes(listTimes2);
              }
              setShowModal(true);
            }}
          />
        </Tooltip>
      ),
    },
    {
      id: 3,
      title: t("view.ai_config.time_week.3"),
      bgColor: "white",
      rightTitle: (
        <Tooltip placement="bottomLeft" title={t("view.ai_config.edit_time.3")}>
          <EditOutlined
            style={{ fontSize: "16px", color: "#6E6B7B" }}
            onClick={() => {
              setSelectDay("3");
              if (!listTimes3) {
                const defaultList = [];
                defaultList.push({
                  startTime: 1609434000,
                  endTime: 1609434000,
                });
                setListTimes(defaultList);
              } else {
                setListTimes(listTimes3);
              }
              setShowModal(true);
            }}
          />
        </Tooltip>
      ),
    },
    {
      id: 4,
      title: t("view.ai_config.time_week.4"),
      bgColor: "white",
      rightTitle: (
        <Tooltip placement="bottomLeft" title={t("view.ai_config.edit_time.4")}>
          <EditOutlined
            style={{ fontSize: "16px", color: "#6E6B7B" }}
            onClick={() => {
              setSelectDay("4");
              if (!listTimes4) {
                const defaultList = [];
                defaultList.push({
                  startTime: 1609434000,
                  endTime: 1609434000,
                });
                setListTimes(defaultList);
              } else {
                setListTimes(listTimes4);
              }
              setShowModal(true);
            }}
          />
        </Tooltip>
      ),
    },
    {
      id: 5,
      title: t("view.ai_config.time_week.5"),
      bgColor: "white",
      rightTitle: (
        <Tooltip placement="bottomLeft" title={t("view.ai_config.edit_time.5")}>
          <EditOutlined
            style={{ fontSize: "16px", color: "#6E6B7B" }}
            onClick={() => {
              setSelectDay("5");
              if (!listTimes5) {
                const defaultList = [];
                defaultList.push({
                  startTime: 1609434000,
                  endTime: 1609434000,
                });
                setListTimes(defaultList);
              } else {
                setListTimes(listTimes5);
              }
              setShowModal(true);
            }}
          />
        </Tooltip>
      ),
    },
    {
      id: 6,
      title: t("view.ai_config.time_week.6"),
      bgColor: "white",
      rightTitle: (
        <Tooltip placement="bottomLeft" title={t("view.ai_config.edit_time.6")}>
          <EditOutlined
            style={{ fontSize: "16px", color: "#6E6B7B" }}
            onClick={() => {
              setSelectDay("6");
              if (!listTimes6) {
                const defaultList = [];
                defaultList.push({
                  startTime: 1609434000,
                  endTime: 1609434000,
                });
                setListTimes(defaultList);
              } else {
                setListTimes(listTimes6);
              }
              setShowModal(true);
            }}
          />
        </Tooltip>
      ),
    },
    {
      id: 7,
      title: t("view.ai_config.time_week.7"),
      bgColor: "white",
      rightTitle: (
        <Tooltip placement="bottomLeft" title={t("view.ai_config.edit_time.7")}>
          <EditOutlined
            style={{ fontSize: "16px", color: "#6E6B7B" }}
            onClick={() => {
              setSelectDay("7");
              if (!listTimes7) {
                const defaultList = [];
                defaultList.push({
                  startTime: 1609434000,
                  endTime: 1609434000,
                });
                setListTimes(defaultList);
              } else {
                setListTimes(listTimes7);
              }

              setShowModal(true);
            }}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <div className="tabs__container--config_schedule">
      <Card
        bodyStyle={bodyStyleCard}
        headStyle={headStyleCard}
        className="card--category"
        // headStyle={{ padding: 30 }}
      >
        <div className="timeline_table">
          <Timeline
            style={{ color: "white", marginTop: "20px", marginBottom: "20px" }}
            groups={groups}
            items={listDetail}
            defaultTimeStart={moment([2021, 1, 1, 0, 0, 0, 0])}
            defaultTimeEnd={moment([2021, 1, 1, 23, 59, 59, 999])}
            rightSidebarWidth={30}
            sidebarWidth={80}
            useResizeHandle={false}
            minZoom={60 * 60 * 1000}
            minResizeWidth={10}
          >
            <TimelineHeaders>
              <DateHeader labelFormat="HH" />
            </TimelineHeaders>
          </Timeline>
          {/* <Timeline
            
          /> */}
        </div>

        {cameraUuid ? (
          <div className="footer__modal">
            <Button
              type="primary"
              onClick={() => {
                setShowModalCopy(true);
              }}
            >
              {t("view.ai_config.config_copy")}
            </Button>
            <Button
              onClick={() => {
                handleSubmit();
              }}
              type="primary"
              htmlType="submit "
            >
              {t("view.ai_config.apply")}
            </Button>
          </div>
        ) : null}
      </Card>
      {showModal && (
        <ModalEditScheduleConfig
          listTimes={listTimes}
          setShowModal={setShowModal}
          handleCreateTimeConfig={handleCreateTimeConfig}
        />
      )}
      {showModalCopy && (
        <ModalScheduleConfigCopy
          type={type}
          cameraUuid={cameraUuid}
          setShowModalCopy={setShowModalCopy}
          handleCreateTimeConfig={handleCreateTimeConfig}
        />
      )}
    </div>
  );
};

function tabSchedulePropsAreEqual(prevTabSchedule, nextTabSchedule) {
  return (
    _.isEqual(prevTabSchedule.cameraUuid, nextTabSchedule.cameraUuid) &&
    _.isEqual(prevTabSchedule.type, nextTabSchedule.type) &&
    _.isEqual(prevTabSchedule.status, nextTabSchedule.status)
  );
}

export const MemoizedTabSchedule = React.memo(
  TabSchedule,
  tabSchedulePropsAreEqual
);
