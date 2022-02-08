import { Button, Card, Image, Popconfirm, Select } from "antd";
import { isEmpty } from "lodash-es";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import SettingApi from "../../../actions/api/setting/SettingApi";
import recordLogo from "../../../assets/img/pages/store-setting/record-logo.png";
import "../../../assets/scss/pages/store-setting.scss";
import Notification from "../../../components/vms/notification/Notification";
import { NOTYFY_TYPE } from "../../common/vms/Constant";
import "./../../commonStyle/commonCard.scss";
import "./../../commonStyle/commonForm.scss";
import "./../../commonStyle/commonInput.scss";
import "./../../commonStyle/commonModal.scss";
import "./../../commonStyle/commonSelect.scss";
import { bodyStyleCard, headStyleCard } from "./variables";
const DEFAULT_DATA = {
  recordingVideoSizeSave: 0,
};

export default function RecordSetting(props) {
  const { t } = useTranslation();

  //for select
  const { Option } = Select;

  //convertData
  const convertRecordSetitngData = (data) => {
    if (isEmpty(data)) {
      return [];
    }
    let result;
    result = {
      recordingVideoSizeSave:
        data?.recordingVideoSizeSave || DEFAULT_DATA.recordingVideoSizeSave,
    };
    return result;
  };

  //for data
  const [recordingVideoData, setRecordingVideoData] = useState({});
  //get data
  useEffect(() => {
    SettingApi.getRecordingVideo().then(async (data) => {
      let convertData = await convertRecordSetitngData(data?.payload);
      setRecordingVideoData(convertData);
      return;
    });
  }, []);

  const onChangeSelect = (value) => {
    setRecordingVideoData({
      ...recordingVideoData,
      recordingVideoSizeSave: value,
    });
  };

  const handleSubmit = async () => {
    const payload = recordingVideoData;
    const payloadConverted = {
      recordingVideoFullTime: true,
      recordingVideoScheduleDto: {
        days: null,
        fromTime: null,
        toTime: null,
      },
      recordingVideoSizeSave: payload?.recordingVideoSizeSave,
      recordingVideosSchedule: false,
      domain: "edsolabs",
    };

    //post data
    try {
      const isPost = await SettingApi.postRecordingVideo(payloadConverted);
      if (isPost) {
        const noti = {
          type: NOTYFY_TYPE.success,
          title: `${t("noti.success")}`,
          description: `${t("noti.successful_setting")}`,
        };
        Notification(noti);
      } else {
        const noti = {
          type: NOTYFY_TYPE.warning,
          title: `${t("noti.faid")}`,
          description: `${t("noti.error_setting")}`,
        };
        Notification(noti);
      }
    } catch (error) {
      const noti = {
        type: NOTYFY_TYPE.warning,
        title: `${t("noti.faid")}`,
        description: `${t("noti.error_setting")}`,
      };
      Notification(noti);

      console.log(error);
    }
  };
  const secondOptions = [];
  for (let i = 30; i <= 120; i += 30) {
    secondOptions.push(
      <Option key={i} value={i}>
        {i}
      </Option>
    );
  }
  // if (isEmpty(recordingVideoData)) return <Spin />
  return (
    <>
      <Card
        title={t("view.storage.recording_setting")}
        extra={
          <Popconfirm
            cancelText={t("view.user.detail_list.cancel")}
            okText={t("view.user.detail_list.confirm")}
            title={t("noti.save_change")}
            placement="right"
            onConfirm={handleSubmit}
          >
            <Button className="btn--save">{t("view.map.button_save")}</Button>
          </Popconfirm>
        }
        headStyle={headStyleCard}
        bodyStyle={bodyStyleCard}
        className="setting__recording"
      >
        <div className="content">
          <div className="content--left">
            <Image width={150} src={recordLogo} preview={false} />
          </div>
          <div className="content--right">
            <p className="content__title">
              {t("view.storage.set_max_archive_file_length")}
            </p>
            <p className="content__description">
              {t("view.storage.set_max_archive_file_length_desc")}
            </p>
          </div>
        </div>
        <div className="setting--record">
          <div className="setting__title">
            {t("view.storage.maximum_length_video_archive")}
          </div>
          <div className="setting__content record--setting">
            <Select
              onChange={onChangeSelect}
              value={recordingVideoData?.recordingVideoSizeSave}
            >
              {secondOptions}
            </Select>
            <span className="seconds">{t("view.storage.seconds")}</span>
          </div>
        </div>
      </Card>
    </>
  );
}
