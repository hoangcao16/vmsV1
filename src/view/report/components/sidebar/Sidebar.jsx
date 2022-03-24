import {
  Col,
  DatePicker,
  Divider,
  Form,
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
import { loadDataChart } from "../../redux/actions";
import { changeChart } from "../../redux/actions/changeChart";
import { changeTitle } from "../../redux/actions/changeTitle";
import { changeCount } from "../../redux/actions/changeCount";
import "./../../../../view/commonStyle/commonInput.scss";
import "./../../../../view/commonStyle/commonSelect.scss";
import "./sidebar.scss";
import { useTranslation } from "react-i18next";
import { reactLocalStorage } from "reactjs-localstorage";

const { Option } = Select;
const formItemLayout = {
  wrapperCol: { span: 24 },
  labelCol: { span: 24 },
};
const SELECTED_TIME = {
  DAY: "day",
  MONTH: "month",
  YEAR: "year",
};

function Sidebar(props) {
  const { t } = useTranslation();

  const [filterOptions, setFilterOptions] = useState(DATA_FAKE_CAMERA);

  const [provinceId, setProvinceId] = useState(["19"]);

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

  const [isShowLineAndPieChart, setisShowLineAndPieChart] = useState(true);

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
        setisShowLineAndPieChart(true);

        const dataDefault = {
          pickTime: dataTime,
          timeStartDay: timeStartDay,
          timeEndDay: timeEndDay,
          timeStartMonth: "",
          timeEndMonth: "",
          timeStartYear: "",
          timeEndYear: "",
          provinceId: ["19"],
          districtId: "",
          wardId: "",
          fieldId: data?.fields[0]?.uuid,
          eventList: arr,
        };
        props.callData(clearData(dataDefault));
        props.changeCount(arr);
      }
    });
  }, []);

  useEffect(() => {
    const isShowLineAndPieChart = hiddenDistrictAndWard && hiddenWard;
    props.changeChart(isShowLineAndPieChart);
  }, [hiddenDistrictAndWard, hiddenWard]);

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

  const { provinces, fields } = filterOptions;

  useEffect(() => {
    const data = {
      pickTime: dataTime,
      timeStartDay: timeStartDay,
      timeEndDay: timeEndDay,
      timeStartMonth: timeStartMonth,
      timeEndMonth: timeEndMonth,
      timeStartYear: timeStartYear,
      timeEndYear: timeEndYear,
      provinceId: provinceId,
      districtId: districtId,
      wardId: wardId,
      fieldId: feildIds,
      eventList: selectedRowKeys,
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
    timeStartMonth,
    timeEndMonth,
    timeStartYear,
    timeEndYear,
    feildIds,
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
      props.changeCount(dataFilter?.eventList[0]);
    } else {
      let arr = [];
      props.changeCount(arr);
      setEventList(dataFilter.eventList);
      setSelectedRowKeys(null);
      return;
    }

    // if (selectedRowKeys)
    setSelectedRowKeys([dataFilter?.eventList[0]?.uuid]);
  };

  //const blurCity = async (cityIdArr) => {

  // }

  const onChangeCity = async (cityIdArr) => {
    if (cityIdArr.length < 1) {
      form.setFieldsValue({
        provinceId: provinceId,
      });
    }

    if (cityIdArr.length === 1) {
      let arr = [];
      arr = selectedRowKeys;
      props.changeCount(arr);
      setHiddenDistrictAndWard(true);
      setHiddenWard(true);
      setisShowLineAndPieChart(true);
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
      setisShowLineAndPieChart(false);
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
      let arr = [];
      arr = selectedRowKeys;
      props.changeCount(arr);
      setHiddenWard(true);
      setisShowLineAndPieChart(true);
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
      setisShowLineAndPieChart(false);
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
      setisShowLineAndPieChart(true);
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
      let arr = [];
      arr = selectedRowKeys;
      props.changeCount(arr);
      setWardId(wardIdArr);
      setisShowLineAndPieChart(true);
      props.changeChart(true);
      if (isEmpty(eventList)) {
        emptyField();
      } else {
        setSelectedRowKeys(selectedRowKeys);
      }

      return;
    } else if (wardIdArr.length > 1 && wardIdArr.length <= 5) {
      setisShowLineAndPieChart(false);
      setWardId(wardIdArr);
      if (isEmpty(eventList)) {
        emptyField();
      } else {
        setSelectedRowKeys(selectedRowKeys);
      }

      props.changeChart(false);

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
      setisShowLineAndPieChart(true);
      setWardId([]);
      if (isEmpty(eventList)) {
        emptyField();
      } else {
        setSelectedRowKeys(selectedRowKeys);
      }

      form.setFieldsValue({ wardId: undefined });
    }
    props.changeChart(true);
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
    if (selectedRowKeys.length < 1 || selectedRowKeys.length > 3) {
      const language = reactLocalStorage.get("language");
      if (language === "vn") {
        const notifyMess = {
          type: "error",
          title: "",
          description: `Số lượng sự kiện phải trong khoảng từ 1 đến 3`,
        };
        Notification(notifyMess);
        return;
      } else {
        const notifyMess = {
          type: "error",
          title: "",
          description: "Number of events must be in range from 1 to 3",
        };
        Notification(notifyMess);
        return;
      }
    }
    setSelectedRowKeys(selectedRowKeys);
    props.changeCount(selectedRowKeys);

    //Call API
    const data = {
      pickTime: dataTime,
      timeStartDay: timeStartDay,
      timeEndDay: timeEndDay,
      timeStartMonth: timeStartMonth,
      timeEndMonth: timeEndMonth,
      timeStartYear: timeStartYear,
      timeEndYear: timeEndYear,
      provinceId: provinceId,
      districtId: districtId,
      wardId: wardId,
      fieldId: feildIds,
      eventList: selectedRowKeys,
    };
    props.callData(clearData(data));
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const onChangeDateTime = async (dateTime) => {
    setDatatime(dateTime);
    if (isEmpty(eventList)) {
      emptyField();
    } else {
      setSelectedRowKeys(selectedRowKeys);
    }
    let arr = [];
    arr = selectedRowKeys;
    props.changeCount(arr);
  };

  //==================================================================

  function onChangeTimeStartDay(value) {
    let arr = [];
    arr = selectedRowKeys;
    props.changeCount(arr);
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
    let arr = [];
    arr = selectedRowKeys;
    props.changeCount(arr);
    setTimeStartDay(timeStartDay);
    setTimeEndDay(value);
    const dk = moment(timeStartDay).add(1, "days");
    if (!value) {
      form.setFieldsValue({
        timeStartDay: timeStartDay,
      });
      return;
    }

    if (dk > value) {
      form.setFieldsValue({
        timeEndDay: "",
      });

      const language = reactLocalStorage.get("language");
      if (language === "vn") {
        const notifyMess = {
          type: "error",
          title: "",
          description:
            "Khoảng thời gian bạn chọn chưa đúng, vui lòng kiểm tra lại",
        };
        Notification(notifyMess);
        return;
      } else {
        const notifyMess = {
          type: "error",
          title: "",
          description:
            "Time range you choose is not correct, please check again",
        };
        Notification(notifyMess);
        return;
      }
    }
    if (isEmpty(eventList)) {
      emptyField();
    } else {
      setSelectedRowKeys(selectedRowKeys);
    }
  }

  function disabledDateTimeStartDay(current) {
    const start = moment(timeEndDay).subtract(11, "days");
    const end = moment(timeEndDay).subtract(1, "days");
    return current < start - 1 || current > end;
  }

  function disabledDateTimeEndDay(current) {
    const start = moment(timeStartDay).add(1, "days");
    const end = moment(timeStartDay).add(12, "days");
    return current > end || current > moment() + 1 || current < start;
  }

  //==================================================================

  function onChangeTimeStartMonth(value) {
    let arr = [];
    arr = selectedRowKeys;
    props.changeCount(arr);
    if (!value) {
      form.setFieldsValue({
        timeEndMonth: timeEndMonth,
      });
      return;
    }

    setTimeStartMonth(value);
  }

  function onChangeTimeEndMonth(value) {
    let arr = [];
    arr = selectedRowKeys;
    props.changeCount(arr);
    setTimeEndMonth(value);

    const dk = moment(timeStartMonth).add(1, "months");

    if (!value) {
      form.setFieldsValue({
        timeStartMonth: timeStartMonth,
      });
      return;
    }

    if (dk > value) {
      form.setFieldsValue({
        timeStartMonth: "",
      });

      const language = reactLocalStorage.get("language");
      if (language === "vn") {
        const notifyMess = {
          type: "error",
          title: "",
          description:
            "Khoảng thời gian bạn chọn chưa đúng, vui lòng kiểm tra lại",
        };
        Notification(notifyMess);
        return;
      } else {
        const notifyMess = {
          type: "error",
          title: "",
          description:
            "Time range you choose is not correct, please check again",
        };
        Notification(notifyMess);
        return;
      }
    }
  }

  function disabledDateTimeStartMonth(current) {
    const start = moment(timeEndMonth).subtract(11, "months");
    const end = moment(timeEndMonth).subtract(1, "months");
    return current < start || current > end + 1;
  }

  function disabledDateTimeEndMonth(current) {
    const start = moment(timeStartMonth).add(1, "months");
    const end = moment(timeStartMonth).add(11, "months");
    return current > moment() + 1 || current < start || current > end + 1;
  }

  //==================================================================

  function onChangeTimeStartYear(value) {
    let arr = [];
    arr = selectedRowKeys;
    props.changeCount(arr);
    if (!value) {
      form.setFieldsValue({
        timeEndYear: timeEndYear,
      });
      return;
    }

    setTimeStartYear(value);
  }

  function onChangeTimeEndYear(value) {
    let arr = [];
    arr = selectedRowKeys;
    props.changeCount(arr);
    setTimeEndYear(value);
    const dk = moment(timeStartYear).add(1, "years");

    if (!value) {
      form.setFieldsValue({
        timeStartYear: timeStartYear,
      });
      return;
    }

    if (dk > value) {
      form.setFieldsValue({
        timeStartYear: "",
      });

      const language = reactLocalStorage.get("language");
      if (language === "vn") {
        const notifyMess = {
          type: "error",
          title: "",
          description:
            "Khoảng thời gian bạn chọn chưa đúng, vui lòng kiểm tra lại",
        };
        Notification(notifyMess);
        return;
      } else {
        const notifyMess = {
          type: "error",
          title: "",
          description:
            "Time range you choose is not correct, please check again",
        };
        Notification(notifyMess);
        return;
      }
    }
  }

  function disabledDateTimeStartYear(current) {
    const start = moment(timeEndYear).subtract(4, "years");
    const end = moment(timeEndYear).subtract(1, "years");
    return current < start || current > end + 1;
  }

  function disabledDateTimeEndYear(current) {
    const start = moment(timeStartYear).add(1, "years");
    const end = moment(timeStartYear).add(4, "years");
    return current > end + 1 || current > moment() + 1 || current < start;
  }

  return (
    <div className="sidebar">
      <div className="sidebarOption">
        <Form
          className="mt-2 bg-grey"
          form={form}
          {...formItemLayout}
          style={{ width: "100%", paddingBottom: "30px" }}
        >
          <label className="optionTitle">{t("view.report.view_by")}</label>
          <Row gutter={24} style={{ margin: "5px" }}>
            <Col span={24}>
              <Form.Item name={["pickTime"]}>
                <Select
                  defaultValue="day"
                  onChange={(dateTime) => onChangeDateTime(dateTime)}
                >
                  <Option value="day">{t("view.report.day")}</Option>
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
                    disabledDate={disabledDateTimeStartDay}
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
                    disabledDate={disabledDateTimeEndDay}
                    dropdownClassName="dropdown__date-picker"
                    onChange={onChangeTimeEndDay}
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
                    disabledDate={disabledDateTimeStartMonth}
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
                    disabledDate={disabledDateTimeEndMonth}
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
                    disabledDate={disabledDateTimeStartYear}
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
                    disabledDate={disabledDateTimeEndYear}
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
                  defaultValue={["19"]}
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
    changeCount: (count) => {
      dispatch(changeCount(count));
    },
    callData: (params) => {
      dispatch(loadDataChart(params));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
