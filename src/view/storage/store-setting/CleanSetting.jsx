import {
  Button,
  Card,
  Checkbox,
  Image,
  Input,
  Popconfirm,
  Select,
  Tooltip,
} from "antd";
import "antd/dist/antd.css";
import { isEmpty } from "lodash-es";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import SettingApi from "../../../actions/api/setting/SettingApi";
import cautionLogo from "../../../assets/img/pages/store-setting/caution-logo.png";
import cleanImportantLogo from "../../../assets/img/pages/store-setting/clean-important-logo.png";
import cleanLogo from "../../../assets/img/pages/store-setting/clean-logo.png";
import "../../../assets/scss/pages/store-setting.scss";
import Notification from "../../../components/vms/notification/Notification";
import { NOTYFY_TYPE } from "../../common/vms/Constant";
import "./../../commonStyle/commonCard.scss";
import "./../../commonStyle/commonForm.scss";
import "./../../commonStyle/commonInput.scss";
import "./../../commonStyle/commonModal.scss";
import "./../../commonStyle/commonSelect.scss";
import { bodyStyleCard, errorColor, headStyleCard } from "./variables";

const DEFAULT_VALUE = {
  autoRemoveFileImportant: false,
  configCleanFile: [
    {
      time: 0,
      timeType: "HOUR",
    },
    {
      time: 0,
      timeType: "HOUR",
    },
    {
      time: 0,
      timeType: "HOUR",
    },
  ],
};

//convert data
const convertCleanSettingData = (data) => {
  if (isEmpty(data))
    return {
      autoRemoveFileImportant: DEFAULT_VALUE.autoRemoveFileImportant,
      configCleanFile: DEFAULT_VALUE.configCleanFile,
    };
  else if (data && !data.configCleanFile) {
    return {
      autoRemoveFileImportant:
        data?.autoRemoveFileImportant || DEFAULT_VALUE.autoRemoveFileImportant,
      configCleanFile: DEFAULT_VALUE.configCleanFile,
    };
  } else {
    let result;
    result = {
      autoRemoveFileImportant:
        data?.autoRemoveFileImportant || DEFAULT_VALUE.autoRemoveFileImportant,
      configCleanFile: [
        {
          time:
            data?.configCleanFile[0]?.time ||
            DEFAULT_VALUE.configCleanFile[0].time,
          timeType:
            data?.configCleanFile[0]?.timeType ||
            DEFAULT_VALUE.configCleanFile[0].timeType,
        },
        {
          time:
            data?.configCleanFile[1]?.time ||
            DEFAULT_VALUE.configCleanFile[1].time,
          timeType:
            data?.configCleanFile[1]?.timeType ||
            DEFAULT_VALUE.configCleanFile[1].timeType,
        },
        {
          time:
            data?.configCleanFile[2]?.time ||
            DEFAULT_VALUE.configCleanFile[2].time,
          timeType:
            data?.configCleanFile[2]?.timeType ||
            DEFAULT_VALUE.configCleanFile[2].timeType,
        },
      ],
    };
    return result;
  }
};

export default function CleanSetting(props) {
  const { t } = useTranslation();
  //for data
  const [cleanSettingData, setCleanSettingData] = useState({});

  // for validate input
  const [isCorrectFormatValueOne, setIsCorrectFormatValueOne] = useState(true);
  const [isCorrectFormatValueTwo, setIsCorrectFormatValueTwo] = useState(true);
  const [isCorrectFormatValueThree, setIsCorrectFormatValueThree] =
    useState(true);
  const [checkHandleSubmit, setHandleSubmit] = useState(true);

  //for select
  const { Option } = Select;

  //call data
  useEffect(() => {
    SettingApi.getDataCleanFile().then(async (data) => {
      let convertedData = await convertCleanSettingData(data?.payload);
      setCleanSettingData(convertedData);
      return;
    });
  }, []);

  const onChangeTimeOne = (e) => {
    let value = e.target.value;
    let configCleanFileNew = cleanSettingData.configCleanFile;
    configCleanFileNew[0].time = value === "" ? "" : parseInt(value);
    setCleanSettingData({
      ...cleanSettingData,
      configCleanFile: configCleanFileNew,
    });
    if (!isEmpty(value)) {
      setIsCorrectFormatValueOne(true);
      setHandleSubmit(true);
    } else {
      setIsCorrectFormatValueOne(false);
      setHandleSubmit(false);
    }
  };

  const onChangeTimeTypeOne = (value) => {
    //create data
    let configCleanFileNew = cleanSettingData.configCleanFile;
    configCleanFileNew[0].timeType = value;

    //set clean setting data
    setCleanSettingData({
      ...cleanSettingData,
      configCleanFile: configCleanFileNew,
    });
  };

  const onChangeTimeTwo = (e) => {
    let value = e.target.value;
    let configCleanFileNew = cleanSettingData.configCleanFile;
    configCleanFileNew[2].time = value === "" ? "" : parseInt(value);
    setCleanSettingData({
      ...cleanSettingData,
      configCleanFile: configCleanFileNew,
    });
    if (!isEmpty(value)) {
      setIsCorrectFormatValueTwo(true);
      setHandleSubmit(true);
    } else {
      setIsCorrectFormatValueTwo(false);
      setHandleSubmit(false);
    }
  };

  const onChangeTimeTypeTwo = (value) => {
    //create data
    let configCleanFileNew = cleanSettingData.configCleanFile;
    configCleanFileNew[2].timeType = value;

    //set clean setting data
    setCleanSettingData({
      ...cleanSettingData,
      configCleanFile: configCleanFileNew,
    });
  };

  const onChangeTimeThree = (e) => {
    let value = e.target.value;
    let configCleanFileNew = cleanSettingData.configCleanFile;
    configCleanFileNew[1].time = value === "" ? "" : parseInt(value);
    setCleanSettingData({
      ...cleanSettingData,
      configCleanFile: configCleanFileNew,
    });
    if (!isEmpty(value)) {
      setIsCorrectFormatValueThree(true);
      setHandleSubmit(true);
    } else {
      setIsCorrectFormatValueThree(false);
      setHandleSubmit(false);
    }
  };

  const onChangeTimeTypeThree = (value) => {
    //create new data
    let configCleanFileNew = cleanSettingData.configCleanFile;
    configCleanFileNew[1].timeType = value;

    //set clean setting data
    setCleanSettingData({
      ...cleanSettingData,
      configCleanFile: configCleanFileNew,
    });
  };

  const onChangeCheckbox = (e) => {
    setCleanSettingData({
      ...cleanSettingData,
      autoRemoveFileImportant: e.target.checked,
    });
  };

  const handleSubmit = async () => {
    const payload = cleanSettingData;
    const payloadConverted = {
      autoRemoveFileImportant: payload?.autoRemoveFileImportant,
      configCleanFile: [
        {
          fileType: "CAPTURE",
          time: payload?.configCleanFile[0]?.time,
          timeType: payload?.configCleanFile[0]?.timeType,
        },
        {
          fileType: "EVENT",
          time: payload?.configCleanFile[1]?.time,
          timeType: payload?.configCleanFile[1]?.timeType,
        },
        {
          fileType: "DAILY_RECORD",
          time: payload?.configCleanFile[2]?.time,
          timeType: payload?.configCleanFile[2]?.timeType,
        },
      ],
    };

    try {
      const isPost = await SettingApi.postDataCleanFile(payloadConverted);
      if (isPost) {
        const noti = {
          type: NOTYFY_TYPE.success,
          title: `${t("noti.success")}`,
          description: `${t("noti.successful_setting")}`,
        };
        Notification(noti);
      }
    } catch (error) {
      const noti = {
        type: NOTYFY_TYPE.warning,
        title: `${t("noti.faid")}`,
        description: `${t("noti.suerror_settingccess")}`,
      };
      Notification(noti);
      console.log(error);
    }
  };

  return (
    <>
      <Card
        title={t("view.storage.cleanup_setting")}
        extra={
          <Popconfirm
            cancelText={t("view.user.detail_list.cancel")}
            okText={t("view.user.detail_list.confirm")}
            title={t("noti.save_change")}
            placement="right"
            disabled={!checkHandleSubmit}
            onConfirm={handleSubmit}
            className="popconfirm--warning"

            // onConfirm={handleSubmit}
          >
            <Button
              className="btn--save"
              // onClick={handleSubmit}
              disabled={!checkHandleSubmit}
            >
              {t("view.map.button_save")}
            </Button>
          </Popconfirm>
          // <Button
          //   className='btn--save'
          //   onClick={handleSubmit}
          //   disabled={!checkHandleSubmit}
          // >
          //   Lưu
          // </Button>
        }
        headStyle={headStyleCard}
        bodyStyle={bodyStyleCard}
        className="setting__clean"
      >
        <div className="content">
          <div className="content--left">
            <Image width={160} src={cleanLogo} preview={false} />
          </div>
          <div className="content--right">
            <p className="content__title">{t("view.storage.what_is_cs")}</p>
            <p className="content__description">{t("view.storage.cs_desc")}</p>
          </div>
        </div>
        <div className="setting--clean">
          <div className="setting__title">
            {t("view.storage.maximum_storage_time")}
          </div>
          <div className="setting__content">
            <div className="setting__file--all">
              <div className="section">
                <div className="title">{t("view.storage.file_capture")}</div>
                <div className="file--setting">
                  <Tooltip
                    title={t("view.storage.invalid_format")}
                    visible={isCorrectFormatValueOne ? false : true}
                    color={errorColor}
                  >
                    <Input
                      onChange={onChangeTimeOne}
                      type="number"
                      onKeyDown={(evt) =>
                        ["e", "E", "+", "-"].includes(evt.key) &&
                        evt.preventDefault()
                      }
                      value={
                        cleanSettingData?.configCleanFile
                          ? cleanSettingData?.configCleanFile[0]?.time
                          : ""
                      }
                    />
                  </Tooltip>
                  <Select
                    onChange={onChangeTimeTypeOne}
                    value={
                      cleanSettingData?.configCleanFile
                        ? cleanSettingData?.configCleanFile[0]?.timeType
                        : ""
                    }
                  >
                    <Option value="HOUR">{t("view.storage.hour")}</Option>
                    <Option value="DAY">{t("view.storage.day")}</Option>
                    <Option value="MONTH">{t("view.storage.month")}</Option>
                    <Option value="YEAR">{t("view.storage.year")}</Option>
                  </Select>
                </div>
              </div>
              <div className="section">
                <div className="title">{t("view.storage.autosave_file")}</div>
                <div className="file--setting">
                  <Tooltip
                    title={t("view.storage.invalid_format")}
                    visible={isCorrectFormatValueTwo ? false : true}
                    color={errorColor}
                  >
                    <Input
                      onChange={onChangeTimeTwo}
                      type="number"
                      onKeyDown={(evt) =>
                        ["e", "E", "+", "-"].includes(evt.key) &&
                        evt.preventDefault()
                      }
                      value={
                        cleanSettingData?.configCleanFile
                          ? cleanSettingData?.configCleanFile[2]?.time
                          : ""
                      }
                    />
                  </Tooltip>
                  <Select
                    onChange={onChangeTimeTypeTwo}
                    value={
                      cleanSettingData?.configCleanFile
                        ? cleanSettingData?.configCleanFile[2]?.timeType
                        : ""
                    }
                  >
                    <Option value="HOUR">{t("view.storage.hour")}</Option>
                    <Option value="DAY">{t("view.storage.day")}</Option>
                    <Option value="MONTH">{t("view.storage.month")}</Option>
                    <Option value="YEAR">{t("view.storage.year")}</Option>
                  </Select>
                </div>
              </div>
              <div className="section">
                <div className="title">{t("view.storage.event_file")}</div>
                <div className="file--setting">
                  <Tooltip
                    title={t("view.storage.invalid_format")}
                    visible={isCorrectFormatValueThree ? false : true}
                    color={errorColor}
                  >
                    <Input
                      onChange={onChangeTimeThree}
                      type="number"
                      onKeyDown={(evt) =>
                        ["e", "E", "+", "-"].includes(evt.key) &&
                        evt.preventDefault()
                      }
                      value={
                        cleanSettingData?.configCleanFile
                          ? cleanSettingData?.configCleanFile[1]?.time
                          : ""
                      }
                    />
                  </Tooltip>
                  <Select
                    onChange={onChangeTimeTypeThree}
                    value={
                      cleanSettingData?.configCleanFile
                        ? cleanSettingData?.configCleanFile[1]?.timeType
                        : ""
                    }
                  >
                    <Option value="HOUR">{t("view.storage.hour")}</Option>
                    <Option value="DAY">{t("view.storage.day")}</Option>
                    <Option value="MONTH">{t("view.storage.month")}</Option>
                    <Option value="YEAR">{t("view.storage.year")}</Option>
                  </Select>
                </div>
              </div>
            </div>
            <div className="setting__file--important">
              <div className="clean-important-img">
                <Image
                  width={135}
                  src={cleanImportantLogo}
                  preview={false}
                  className="clean-important-logo"
                />
                <Image
                  width={17.5}
                  preview={false}
                  src={cautionLogo}
                  className="caution-logo"
                />
              </div>
              <Checkbox
                onChange={onChangeCheckbox}
                checked={cleanSettingData?.autoRemoveFileImportant}
              >
                {t("view.storage.clean_important_file")}
              </Checkbox>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}
