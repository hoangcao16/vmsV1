import {
  Col,
  DatePicker,
  Divider,
  Dropdown,
  Form,
  Input,
  Row,
  Select,
  Table,
  Tooltip,
} from "antd";
import { isEmpty } from "lodash";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import AddressApi from "../../../../actions/api/address/AddressApi";
import EventApi from "../../../../actions/api/event/EventApi";
import FieldApi from "../../../../actions/api/field/FieldApi";
import clearData from "../../../../actions/function/MyUltil/CheckData";
import Notification from "../../../../components/vms/notification/Notification";
import "../../../../view/commonStyle/commonDatePicker.scss";
import { DATA_FAKE_CAMERA } from "../../../camera/ModalAddCamera";
import {
  filterOption,
  normalizeOptions,
} from "../../../common/select/CustomSelect";
import { loadDataChart, loadTableDataChart } from "../../redux/actions";
import { changeChart } from "../../redux/actions/changeChart";
import { changeTitle } from "../../redux/actions/changeTitle";
import "./../../../../view/commonStyle/commonInput.scss";
import "./../../../../view/commonStyle/commonSelect.scss";
import "./sidebar.scss";
import { useTranslation } from "react-i18next";
import { reactLocalStorage } from "reactjs-localstorage";
import AICameraApi from "../../../../actions/api/ai-camera/AICameraApi.js";
import WeekPicker from "./WeekPicker";
import { CloudLightning } from "react-feather";

moment.locale("en");

const { Option } = Select;
const formItemLayout = {
  wrapperCol: { span: 24 },
  labelCol: { span: 24 },
};
const SELECTED_TIME = {
  DAY: "day",
  MONTH: "month",
  WEEK: "week",
  YEAR: "year",
};

function Sidebar(props) {
  const { t } = useTranslation();

  const [filterOptions, setFilterOptions] = useState(DATA_FAKE_CAMERA);

  const [provinceId, setProvinceId] = useState(["2"]);

  const [districts, setDistrict] = useState([]);

  const [districtId, setDistrictId] = useState(null);

  const [wards, setWard] = useState([]);

  const [wardId, setWardId] = useState(null);

  const [form] = Form.useForm();

  const [dataTime, setDatatime] = useState(SELECTED_TIME.DAY);

  const [timeStartDay, setTimeStartDay] = useState(
    moment().subtract(7, "days")
  );

  const [timeEndDay, setTimeEndDay] = useState(moment());

  const [timeStartWeek, setTimeStartWeek] = useState(
    moment().subtract(4, "weeks")
  );

  const [timeEndWeek, setTimeEndWeek] = useState(moment());

  const [timeStartMonth, setTimeStartMonth] = useState(
    moment().subtract(11, "months")
  );
  const [timeEndMonth, setTimeEndMonth] = useState(moment());

  const [timeStartYear, setTimeStartYear] = useState(
    moment().subtract(4, "years")
  );
  const [timeEndYear, setTimeEndYear] = useState(moment());

  const [hiddenDistrictAndWard, setHiddenDistrictAndWard] = useState(true);

  const [hiddenWard, setHiddenWard] = useState(true);

  const [eventList, setEventList] = useState([]);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [feildIds, setFeildIds] = useState([]);

  const [cameraAI, setCameraAI] = useState([]);

  const [cameraAIUuid, setCameraAIUuid] = useState([]);

  useEffect(() => {
    fetchSelectOptions().then((data) => {
      setFilterOptions(data);

      if (!isEmpty(data) && !isEmpty(data?.fields)) {
        // setCheck(data?.)
        form.setFieldsValue({
          fieldId: data?.fields[0]?.uuid,
        });
        let arr = [];

        setFeildIds(data?.fields[0]?.uuid);
        if (isEmpty(data?.fields[0]?.eventList)) {
          setSelectedRowKeys(null);
          return;
        } else if (
          !isEmpty(data?.fields[0]?.eventList) &&
          !isEmpty(data?.fields[0]?.eventList[0]?.uuid)
        ) {
          setEventList(data?.fields[0]?.eventList);
          arr[0] = data?.fields[0]?.eventList[0]?.uuid;
          if (!isEmpty(data?.fields[0]?.eventList[1]?.uuid)) {
            arr[1] = data?.fields[0]?.eventList[1]?.uuid;
            if (!isEmpty(data?.fields[0]?.eventList[2]?.uuid)) {
              arr[2] = data?.fields[0]?.eventList[2]?.uuid;
            }
          }
          setSelectedRowKeys(arr);
        }
        props.changeTitle(data?.fields[0]?.name);

        const dataDefault = {
          pickTime: dataTime,
          timeStartDay: timeStartDay,
          timeEndDay: timeEndDay,
          timeStartWeek: "",
          timeEndWeek: "",
          timeStartMonth: "",
          timeEndMonth: "",
          timeStartYear: "",
          timeEndYear: "",
          provinceId: ["2"],
          districtId: "",
          wardId: "",
          fieldId: data?.fields[0]?.uuid,
          eventList: arr,
          cameraUuids: [],
        };
        props.callData(clearData(dataDefault));
      }
    });
  }, []);

  //==================================================================

  useEffect(() => {
    if (moment(timeEndDay).diff(timeStartDay, "d") >= 12) {
      form.setFieldsValue({
        timeEndDay: moment(timeStartDay).add(11, "days"),
      });
      setTimeEndDay(form.getFieldValue("timeEndDay"));
    }
    if (moment(timeStartDay).diff(timeEndDay, "d") >= 0) {
      form.setFieldsValue({
        timeStartDay: "",
      });
      const notifyMess = {
        type: "error",
        title: "",
        description: t("noti.start_greater_end"),
      };
      Notification(notifyMess);
      return;
    }
  }, [timeStartDay]);

  useEffect(() => {
    if (moment(timeEndDay).diff(timeStartDay, "d") >= 12) {
      form.setFieldsValue({
        timeStartDay: moment(timeEndDay).subtract(11, "days"),
      });
      setTimeStartDay(form.getFieldValue("timeStartDay"));
    }
    if (moment(timeStartDay).diff(timeEndDay, "d") >= 0) {
      form.setFieldsValue({
        timeEndDay: "",
      });
      const notifyMess = {
        type: "error",
        title: "",
        description: t("noti.end_smaller_start"),
      };
      Notification(notifyMess);
      return;
    }
  }, [timeEndDay]);

  //==================================================================

  useEffect(() => {
    if (moment(timeEndMonth).diff(timeStartMonth, "M") >= 12) {
      form.setFieldsValue({
        timeEndMonth: moment(timeStartMonth).add(11, "months"),
      });
      setTimeEndMonth(form.getFieldValue("timeEndMonth"));
    }
    if (moment(timeStartMonth).diff(timeEndMonth, "m") >= 0) {
      form.setFieldsValue({
        timeStartMonth: "",
      });
      const notifyMess = {
        type: "error",
        title: "",
        description: t("noti.start_greater_end"),
      };
      Notification(notifyMess);
      return;
    }
  }, [timeStartMonth]);

  useEffect(() => {
    if (moment(timeEndMonth).diff(timeStartMonth, "M") >= 12) {
      form.setFieldsValue({
        timeStartMonth: moment(timeEndMonth).subtract(11, "months"),
      });
      setTimeEndMonth(form.getFieldValue("timeEndMonth"));
    }
    if (moment(timeStartMonth).diff(timeEndMonth, "m") >= 0) {
      form.setFieldsValue({
        timeEndMonth: "",
      });
      const notifyMess = {
        type: "error",
        title: "",
        description: t("noti.end_smaller_start"),
      };
      Notification(notifyMess);
      return;
    }
  }, [timeEndMonth]);

  //==================================================================
  useEffect(() => {
    if (moment(timeEndYear).diff(timeStartYear, "y") >= 5) {
      form.setFieldsValue({
        timeEndYear: moment(timeStartYear).add(4, "years"),
      });
      setTimeEndYear(form.getFieldValue("timeEndYear"));
    }
    if (moment(timeStartYear).diff(timeEndYear, "y") >= 0) {
      form.setFieldsValue({
        timeStartYear: "",
      });
      const notifyMess = {
        type: "error",
        title: "",
        description: t("noti.start_greater_end"),
      };
      Notification(notifyMess);
      return;
    }
  }, [timeStartYear]);

  useEffect(() => {
    if (moment(timeEndYear).diff(timeStartYear, "y") >= 5) {
      form.setFieldsValue({
        timeStartYear: moment(timeEndYear).subtract(4, "years"),
      });
      setTimeStartYear(form.getFieldValue("timeStartYear"));
    }
    if (moment(timeStartYear).diff(timeEndYear, "y") >= 0) {
      form.setFieldsValue({
        timeEndYear: "",
      });
      const notifyMess = {
        type: "error",
        title: "",
        description: t("noti.end_smaller_start"),
      };
      Notification(notifyMess);
      return;
    }
  }, [timeEndYear]);

  //==================================================================

  useEffect(() => {
    setDistrict([]);
    if (provinceId.length === 1) {
      AddressApi.getDistrictByProvinceId(provinceId).then(setDistrict);
    }
  }, [provinceId]);

  useEffect(() => {
    setWard([]);
    if (isEmpty(districtId)) {
      return;
    } else if (districtId.length > 1) {
      return;
    } else if (districtId.length === 1 && provinceId.length === 1) {
      AddressApi.getWardByDistrictId(districtId).then(setWard);
    }
  }, [districtId]);

  //API AI
  useEffect(() => {
    let data = {
      provinceIds: provinceId.toString(),
      districtIds: "",
      wardIds: "",
      size: 100000,
      page: 1,
    };
    if (isEmpty(districtId)) {
      data.districtIds = "";
    } else {
      data.districtIds = districtId.toString();
    }
    if (isEmpty(wardId)) {
      data.wardId = "";
    } else {
      data.wardIds = wardId.toString();
    }
    AICameraApi.getAllCameraAI(data).then(setCameraAI);
  }, [provinceId, districtId, wardId]);

  const { provinces, fields } = filterOptions;

  useEffect(() => {
    const data = {
      pickTime: dataTime,
      timeStartDay: timeStartDay,
      timeEndDay: timeEndDay,
      timeStartWeek: timeStartWeek,
      timeEndWeek: timeEndWeek,
      timeStartMonth: timeStartMonth,
      timeEndMonth: timeEndMonth,
      timeStartYear: timeStartYear,
      timeEndYear: timeEndYear,
      provinceId: provinceId,
      districtId: districtId,
      wardId: wardId,
      fieldId: feildIds,
      eventList: selectedRowKeys,
      cameraUuids: cameraAIUuid,
    };
    props.callData(clearData(data));
    return;
  }, [
    selectedRowKeys,
    provinceId,
    districtId,
    wardId,
    dataTime,
    timeStartDay,
    timeEndDay,
    timeStartWeek,
    timeEndWeek,
    timeStartMonth,
    timeEndMonth,
    timeStartYear,
    timeEndYear,
    feildIds,
    cameraAIUuid,
  ]);

  const emptyField = () => {
    setSelectedRowKeys(null);
    return;
  };

  const onChangeField = (feildId) => {
    const dataFilter = fields.find((f) => f.uuid === feildId);
    props.changeTitle(dataFilter.name);
    setFeildIds(dataFilter.uuid);

    if (!isEmpty(dataFilter.eventList[0])) {
      setEventList(dataFilter.eventList);
    } else {
      setEventList(dataFilter.eventList);
      setSelectedRowKeys(null);
      return;
    }

    setSelectedRowKeys([dataFilter?.eventList[0]?.uuid]);
  };

  const onChangeCity = async (cityIdArr) => {
    if (cityIdArr.length < 1) {
      form.setFieldsValue({
        provinceId: provinceId,
      });
    }

    if (cityIdArr.length === 1) {
      setHiddenDistrictAndWard(true);
      setHiddenWard(true);
      setProvinceId(cityIdArr);
      if (isEmpty(eventList)) {
        emptyField();
      } else {
        setSelectedRowKeys(selectedRowKeys);
      }
      form.setFieldsValue({ districtId: undefined, wardId: undefined });

      return;
    } else if (cityIdArr.length > 1 && cityIdArr.length <= 5) {
      setHiddenDistrictAndWard(false);
      setHiddenWard(false);
      setDistrictId([]);
      setWardId([]);
      form.setFieldsValue({ districtId: undefined, wardId: undefined });
      setProvinceId(cityIdArr);
      if (isEmpty(eventList)) {
        emptyField();
      } else {
        setSelectedRowKeys(selectedRowKeys);
      }
      return;
    } else if (cityIdArr.length > 5) {
      const language = reactLocalStorage.get("language");
      if (language === "vn") {
        const notifyMess = {
          type: "error",
          title: "",
          description: "Số lượng tỉnh/thành phố không được vượt quá 5",
        };
        Notification(notifyMess);
      } else {
        const notifyMess = {
          type: "error",
          title: "",
          description: `The number of province must not exceed 5`,
        };
        Notification(notifyMess);
      }
      cityIdArr.pop();
      setProvinceId(cityIdArr);
      return;
    }

    form.setFieldsValue({ districtId: undefined, wardId: undefined });
  };

  const onChangeDistrict = async (districtIdArr) => {
    if (districtIdArr.length === 1) {
      setHiddenWard(true);
      setDistrictId(districtIdArr);
      if (isEmpty(eventList)) {
        emptyField();
      } else {
        setSelectedRowKeys(selectedRowKeys);
      }

      form.setFieldsValue({ wardId: undefined });

      return;
    } else if (districtIdArr.length > 1 && districtIdArr.length <= 5) {
      setHiddenWard(false);
      setDistrictId(districtIdArr);
      setWardId([]);
      if (isEmpty(eventList)) {
        emptyField();
      } else {
        setSelectedRowKeys(selectedRowKeys);
      }

      form.setFieldsValue({ wardId: undefined });

      return;
    } else if (districtIdArr.length > 5) {
      const language = reactLocalStorage.get("language");
      if (language === "vn") {
        const notifyMess = {
          type: "error",
          title: "",
          description: "Số lượng quận/huyện không được vượt quá 5",
        };
        Notification(notifyMess);
      } else {
        const notifyMess = {
          type: "error",
          title: "",
          description: `The number of district must not exceed 5`,
        };
        Notification(notifyMess);
      }
      districtIdArr.pop();
      setDistrictId(districtIdArr);
      return;
    } else {
      setHiddenDistrictAndWard(true);
      setHiddenWard(true);
      setDistrictId([]);
      if (isEmpty(eventList)) {
        emptyField();
      } else {
        setSelectedRowKeys(selectedRowKeys);
      }

      form.setFieldsValue({ districtId: undefined, wardId: undefined });
    }
    form.setFieldsValue({ wardId: undefined });
  };

  const onChangeWard = (wardIdArr) => {
    if (wardIdArr.length === 1) {
      setWardId(wardIdArr);
      if (isEmpty(eventList)) {
        emptyField();
      } else {
        setSelectedRowKeys(selectedRowKeys);
      }

      return;
    } else if (wardIdArr.length > 1 && wardIdArr.length <= 5) {
      setWardId(wardIdArr);
      if (isEmpty(eventList)) {
        emptyField();
      } else {
        setSelectedRowKeys(selectedRowKeys);
      }

      return;
    } else if (wardIdArr.length > 5) {
      const language = reactLocalStorage.get("language");
      if (language === "vn") {
        const notifyMess = {
          type: "error",
          title: "",
          description: "Số lượng phường/xã không được vượt quá 5",
        };
        Notification(notifyMess);
      } else {
        const notifyMess = {
          type: "error",
          title: "",
          description: `The number of ward must not exceed 5`,
        };
        Notification(notifyMess);
      }
      wardIdArr.pop();
      setWardId(wardIdArr);
      return;
    } else {
      setHiddenWard(true);
      setWardId([]);
      if (isEmpty(eventList)) {
        emptyField();
      } else {
        setSelectedRowKeys(selectedRowKeys);
      }

      form.setFieldsValue({ wardId: undefined });
    }
  };

  const onChangeCameraAI = async (cameraAiArr) => {
    if (cameraAiArr.length >= 1) {
      setCameraAIUuid(cameraAiArr);
      if (isEmpty(eventList)) {
        emptyField();
      } else {
        setSelectedRowKeys(selectedRowKeys);
      }
      return;
    } else {
      setCameraAIUuid([]);
      if (isEmpty(eventList)) {
        emptyField();
      } else {
        setSelectedRowKeys(selectedRowKeys);
      }
      form.setFieldsValue({ cameraAI: undefined });
    }
  };

  const eventColumns = [
    {
      key: "name",
      fixed: "left",
      dataIndex: "name",
      className: "headerColums",
      render: (text, record) => {
        if (record.name.length > 25) {
          return (
            <Tooltip placement="topLeft" title={record.name}>
              <div>{record.name.slice(0, 25) + "..."}</div>
            </Tooltip>
          );
        } else {
          return (
            <Tooltip placement="topLeft" title={record.name}>
              <div>{record.name}</div>
            </Tooltip>
          );
        }
      },
    },
  ];

  const onSelectChange = (selectedRowKeys) => {
    if (selectedRowKeys.length < 1) {
      const language = reactLocalStorage.get("language");
      if (language === "vn") {
        const notifyMess = {
          type: "error",
          title: "",
          description: `Số lượng sự kiện phải lớn hơn từ 1`,
        };
        Notification(notifyMess);
        return;
      } else {
        const notifyMess = {
          type: "error",
          title: "",
          description: `Number of events must be greater than 1`,
        };
        Notification(notifyMess);
        return;
      }
    }
    setSelectedRowKeys(selectedRowKeys);

    //Call API
    const data = {
      pickTime: dataTime,
      timeStartDay: timeStartDay,
      timeEndDay: timeEndDay,
      timeStartWeek: timeStartWeek,
      timeEndWeek: timeEndWeek,
      timeStartMonth: timeStartMonth,
      timeEndMonth: timeEndMonth,
      timeStartYear: timeStartYear,
      timeEndYear: timeEndYear,
      provinceId: provinceId,
      districtId: districtId,
      wardId: wardId,
      fieldId: feildIds,
      eventList: selectedRowKeys,
      cameraUuids: cameraAIUuid,
    };
    props.callData(clearData(data));
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const onChangeTypeChart = (typeChart) => {
    let controlTypeChart;
    if (typeChart == "bar") {
      controlTypeChart = "bar";
    } else if (typeChart == "line") {
      controlTypeChart = "line";
    } else if (typeChart == "pie") {
      controlTypeChart = "pie";
    } else if (typeChart == "table") {
      controlTypeChart = "table";
    }
    props.changeChart(controlTypeChart);
  };

  const onChangeDateTime = async (dateTime) => {
    setDatatime(dateTime);
    if (isEmpty(eventList)) {
      emptyField();
    } else {
      setSelectedRowKeys(selectedRowKeys);
    }
  };

  //==================================================================

  function onChangeTimeStartDay(value) {
    if (!value) {
      form.setFieldsValue({
        timeEndDay: timeEndDay,
      });
      return;
    }
    setTimeStartDay(value);
    if (isEmpty(eventList)) {
      emptyField();
    } else {
      setSelectedRowKeys(selectedRowKeys);
    }
  }

  function onChangeTimeEndDay(value) {
    setTimeStartDay(timeStartDay);
    setTimeEndDay(value);
    if (!value) {
      form.setFieldsValue({
        timeStartDay: timeStartDay,
      });
      return;
    }
    if (isEmpty(eventList)) {
      emptyField();
    } else {
      setSelectedRowKeys(selectedRowKeys);
    }
  }

  //==================================================================

  function onChangeTimeStartMonth(value) {
    if (!value) {
      form.setFieldsValue({
        timeEndMonth: timeEndMonth,
      });
      return;
    }
    setTimeStartMonth(value);
    if (isEmpty(eventList)) {
      emptyField();
    } else {
      setSelectedRowKeys(selectedRowKeys);
    }
  }

  function onChangeTimeEndMonth(value) {
    setTimeStartMonth(timeStartMonth);
    setTimeEndMonth(value);
    if (!value) {
      form.setFieldsValue({
        timeStartMonth: timeStartMonth,
      });
      return;
    }
    if (isEmpty(eventList)) {
      emptyField();
    } else {
      setSelectedRowKeys(selectedRowKeys);
    }
  }

  //==================================================================

  function onChangeTimeStartYear(value) {
    if (!value) {
      form.setFieldsValue({
        timeEndYear: timeEndYear,
      });
      return;
    }
    setTimeStartYear(value);
    if (isEmpty(eventList)) {
      emptyField();
    } else {
      setSelectedRowKeys(selectedRowKeys);
    }
  }

  function onChangeTimeEndYear(value) {
    setTimeStartYear(timeStartYear);
    setTimeEndYear(value);
    if (!value) {
      form.setFieldsValue({
        timeStartYear: timeStartYear,
      });
      return;
    }
    if (isEmpty(eventList)) {
      emptyField();
    } else {
      setSelectedRowKeys(selectedRowKeys);
    }
  }

  return (
    <div className="sidebar">
      <div className="sidebarOption">
        <Form
          className="mt-2 bg-grey"
          form={form}
          {...formItemLayout}
          onFieldsChange={() => {
            if (isEmpty(form.getFieldsValue().timeStartDay)) {
              form.setFieldsValue({
                timeStartDay: timeStartDay,
              });
            }
            if (isEmpty(form.getFieldsValue().timeEndDay)) {
              form.setFieldsValue({
                timeEndDay: timeEndDay,
              });
            }
            if (isEmpty(form.getFieldsValue()?.timeStartMonth)) {
              form.setFieldsValue({
                timeStartMonth: timeStartMonth,
              });
            }
            if (isEmpty(form.getFieldsValue()?.timeEndMonth)) {
              form.setFieldsValue({
                timeEndMonth: timeEndMonth,
              });
            }
            if (isEmpty(form.getFieldsValue()?.timeStartYear)) {
              form.setFieldsValue({
                timeStartYear: timeStartYear,
              });
            }
            if (isEmpty(form.getFieldsValue()?.timeEndYear)) {
              form.setFieldsValue({
                timeEndYear: timeEndYear,
              });
            }
            if (!isEmpty(form.getFieldsValue().timeStartWeek)) {
              setTimeStartWeek(form.getFieldsValue().timeStartWeek);
            }
            if (!isEmpty(form.getFieldsValue().timeEndWeek)) {
              setTimeEndWeek(form.getFieldsValue().timeEndWeek);
            }
          }}
          style={{ width: "100%", paddingBottom: "30px" }}
        >
          <label className="optionTitle">
            {t("view.report.choose_type_chart")}
          </label>
          <Row gutter={24} style={{ margin: "5px" }}>
            <Col span={24}>
              <Form.Item name={["pickTypeChart"]}>
                <Select
                  placeholder={t("view.report.please_choose_chart_type")}
                  onChange={(typeChart) => onChangeTypeChart(typeChart)}
                >
                  <Option value="bar">{t("view.report.column")}</Option>
                  <Option value="line">{t("view.report.line")}</Option>
                  <Option value="pie">{t("view.report.circle")}</Option>
                  <Option value="table">{t("view.report.table")}</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <label className="optionTitle">{t("view.report.view_by")}</label>
          <Row gutter={24} style={{ margin: "5px" }}>
            <Col span={24}>
              <Form.Item name={["pickTime"]}>
                <Select
                  defaultValue="day"
                  onChange={(dateTime) => onChangeDateTime(dateTime)}
                >
                  <Option value="day">{t("view.report.day")}</Option>
                  <Option value="week">{t("view.report.week")}</Option>
                  <Option value="month">{t("view.report.month")}</Option>
                  <Option value="year">{t("view.report.year")}</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Divider style={{ margin: 0, color: "red" }} />
          <label className="optionTitle">{t("view.report.date_range")}</label>

          {dataTime === SELECTED_TIME.DAY && (
            <Row gutter={24} style={{ margin: "5px" }}>
              <Col span={12}>
                <Form.Item name={["timeStartDay"]}>
                  <DatePicker
                    allowClear={false}
                    picker="date"
                    format="DD/MM/YYYY"
                    defaultValue={moment(timeEndDay).subtract(7, "days")}
                    dropdownClassName="dropdown__date-picker"
                    onChange={onChangeTimeStartDay}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name={["timeEndDay"]}>
                  <DatePicker
                    allowClear={false}
                    picker="date"
                    format="DD/MM/YYYY"
                    defaultValue={moment()}
                    dropdownClassName="dropdown__date-picker"
                    onChange={onChangeTimeEndDay}
                  />
                </Form.Item>
              </Col>
            </Row>
          )}

          {dataTime === SELECTED_TIME.WEEK && (
            <Row gutter={24} style={{ margin: "5px" }}>
              <Col span={12}>
                <Form.Item name={["timeStartWeek"]}>
                  <WeekPicker
                    // value={moment().subtract(4, "weeks")}
                    onChange={console.log}
                    typeWeek="StartWeek"
                    disableDate={(currentWeek) => {}}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name={["timeEndWeek"]}>
                  <WeekPicker
                    // value={moment().subtract(4, "weeks")}
                    onChange={console.log}
                    typeWeek="EndWeek"
                    disableDate={(currentWeek) => {}}
                  />
                </Form.Item>
              </Col>
            </Row>
          )}

          {dataTime === SELECTED_TIME.MONTH && (
            <Row gutter={24} style={{ margin: "5px" }}>
              <Col span={12}>
                <Form.Item name={["timeStartMonth"]}>
                  <DatePicker
                    allowClear={false}
                    picker="month"
                    format="MM/YYYY"
                    defaultValue={moment().subtract(11, "months")}
                    dropdownClassName="dropdown__date-picker"
                    onChange={onChangeTimeStartMonth}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name={["timeEndMonth"]}>
                  <DatePicker
                    allowClear={false}
                    picker="month"
                    format="MM/YYYY"
                    defaultValue={moment()}
                    dropdownClassName="dropdown__date-picker"
                    onChange={onChangeTimeEndMonth}
                  />
                </Form.Item>
              </Col>
            </Row>
          )}

          {dataTime === SELECTED_TIME.YEAR && (
            <Row gutter={24} style={{ margin: "5px" }}>
              <Col span={12}>
                <Form.Item name={["timeStartYear"]}>
                  <DatePicker
                    allowClear={false}
                    picker="year"
                    format="YYYY"
                    defaultValue={moment().subtract(4, "year")}
                    dropdownClassName="dropdown__date-picker"
                    onChange={onChangeTimeStartYear}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name={["timeEndYear"]}>
                  <DatePicker
                    allowClear={false}
                    picker="year"
                    format="YYYY"
                    defaultValue={moment()}
                    dropdownClassName="dropdown__date-picker"
                    onChange={onChangeTimeEndYear}
                  />
                </Form.Item>
              </Col>
            </Row>
          )}

          <Divider style={{ margin: 0, color: "red" }} />

          <label className="optionTitle">{t("view.map.zone")}</label>
          <Row gutter={24} style={{ margin: "5px" }}>
            <Col span={24}>
              <Form.Item name={["provinceId"]}>
                <Select
                  defaultValue={["2"]}
                  mode="multiple"
                  allowClear={false}
                  showSearch
                  dataSource={provinces}
                  onChange={(cityId) => onChangeCity(cityId)}
                  filterOption={filterOption}
                  options={normalizeOptions("name", "provinceId", provinces)}
                  placeholder={t("view.map.province_id")}
                  maxTagPlaceholder={5}
                />
              </Form.Item>
            </Col>
          </Row>

          {hiddenDistrictAndWard && (
            <>
              <Divider style={{ margin: 0, color: "red" }} />

              <Row gutter={24} style={{ margin: "5px" }}>
                <Col span={24}>
                  <Form.Item name={["districtId"]}>
                    <Select
                      mode="multiple"
                      allowClear={false}
                      showSearch
                      dataSource={districts}
                      onChange={(districtId) => onChangeDistrict(districtId)}
                      filterOption={filterOption}
                      options={normalizeOptions(
                        "name",
                        "districtId",
                        districts
                      )}
                      placeholder={t("view.map.district_id")}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}

          {hiddenWard && (
            <>
              <Divider style={{ margin: 0, color: "red" }} />

              <Row gutter={24} style={{ margin: "5px" }}>
                <Col span={24}>
                  <Form.Item name={["wardId"]}>
                    <Select
                      mode="multiple"
                      allowClear={false}
                      showSearch
                      dataSource={wards}
                      filterOption={filterOption}
                      options={normalizeOptions("name", "id", wards)}
                      placeholder={t("view.map.ward_id")}
                      onChange={(wardId) => onChangeWard(wardId)}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}
          <label className="optionTitle">Camera AI</label>
          <Row gutter={24} style={{ margin: "5px" }}>
            <Col span={24}>
              <Form.Item name={["cameraAI"]}>
                <Select
                  mode="multiple"
                  allowClear={false}
                  showSearch
                  dataSource={cameraAI}
                  onChange={(cameraAI) => onChangeCameraAI(cameraAI)}
                  filterOption={filterOption}
                  options={normalizeOptions("name", "uuid", cameraAI)}
                  placeholder="Camera AI"
                />
              </Form.Item>
            </Col>
          </Row>
          <label className="optionTitle">{t("view.category.field")}</label>
          <Row gutter={24} style={{ margin: "5px" }}>
            <Col span={24}>
              <Form.Item name={["fieldId"]}>
                <Select
                  allowClear={false}
                  showSearch
                  dataSource={fields}
                  onChange={(fieldId) => onChangeField(fieldId)}
                  filterOption={filterOption}
                  options={normalizeOptions("name", "uuid", fields)}
                  placeholder={t("view.category.field")}
                />
              </Form.Item>
            </Col>
          </Row>

          {isEmpty(setSelectedRowKeys) && (
            <>
              <Divider style={{ margin: 0, color: "red" }} />

              <label className="optionTitle">{t("view.storage.event")}</label>

              <Row gutter={24} style={{ margin: "5px" }}>
                <Col span={24}>
                  <Table
                    className="table__list--event mt-2 test"
                    rowKey="uuid"
                    columns={eventColumns}
                    // showHeader={false}
                    pagination={false}
                    dataSource={eventList}
                    rowSelection={rowSelection}
                  />
                </Col>
              </Row>
            </>
          )}
        </Form>
      </div>
    </div>
  );
}

async function fetchSelectOptions() {
  const data = {
    name: "",
  };
  const provinces = await AddressApi.getAllProvinces();
  const eventTypes = await EventApi.getAllEvent(data);
  const fields = await FieldApi.getAllFeild(data);

  return {
    provinces,
    eventTypes,
    fields,
  };
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => {
  return {
    changeTitle: (title) => {
      dispatch(changeTitle(title));
    },
    changeChart: (data) => {
      dispatch(changeChart(data));
    },
    callData: (params) => {
      dispatch(loadDataChart(params));
      dispatch(loadTableDataChart(params));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
