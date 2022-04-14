import { SearchOutlined } from "@ant-design/icons";
import {
  AutoComplete,
  Col,
  DatePicker,
  Form,
  Input,
  Pagination,
  Popover,
  Row,
  Select,
  Table,
  Tooltip,
} from "antd";
import _ from "lodash";
import { findIndex } from "lodash-es";
import debounce from "lodash/debounce";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  BsThreeDotsVertical,
  IoChevronDownOutline,
  IoChevronUpOutline,
  MdClear,
} from "react-icons/all";
import { FiBookmark, FiFilm, FiImage, FiSearch } from "react-icons/fi";
import AddressApi from "../../../actions/api/address/AddressApi";
import adDivisionApi from "../../../api/controller-api/adDivisionApi";
import cameraApi from "../../../api/controller-api/cameraApi";
import cameraGroupApi from "../../../api/controller-api/cameraGroupApi";
import {
  filterOption,
  normalizeOptions,
} from "../../common/select/CustomSelect";
import locale from "antd/lib/date-picker/locale/vi_VN";
const AI_SOURCE = process.env.REACT_APP_AI_SOURCE;

const TableFile = (props) => {
  const { t } = useTranslation();
  const typeList = [
    {
      id: 0,
      name: "Video",
    },
    {
      id: 1,
      name: `${t("view.user.detail_list.image")}`,
    },
  ];

  const searchCaptureFileParamDefault = {
    page: 1,
    size: 15,
    startRecordTime: -1,
    endRecordTime: -1,
    address: "",
    provinceId: "",
    districtId: "",
    wardId: "",
    administrativeUnitUuid: "",
    fileType: 0,
    cameraGroupUuid: "",
    cameraUuid: "",
    type: -1,
    eventUuid: "",
    searchType: "",
    searchValue: "",
  };

  const formItemLayout = {
    wrapperCol: { span: 24 },
    labelCol: { span: 24 },
  };

  const listFiles = props.listFiles;
  const eventList = props.eventList || [];
  const eventListAI = props.eventListAI || [];
  const total = props.total;

  const renderType = (value) => {
    return !value || value === 0 ? (
      <FiFilm className="iconType" />
    ) : (
      <FiImage className="iconType" />
    );
  };

  const renderTime = (value) => {
    if (value <= 9999999999) {
      return moment(value * 1000).format("HH:mm DD/MM/YYYY");
    } else {
      return moment(value).format("HH:mm DD/MM/YYYY");
    }
  };

  const renderName = (value) => {
    if (value && value.length > 30) {
      return (
        <Tooltip title={value}>
          <span>
            {value.substr(0, 15) +
              "..." +
              value.substr(value.length - 15, value.length - 1)}
          </span>
        </Tooltip>
      );
    } else {
      return value;
    }
  };

  const renderSubtype = (value) => {
    return (
      <Tooltip title={value}>
        <span>{t("view.ai_events." + value)}</span>
      </Tooltip>
    );
  };

  const renderSetImportantAction = (row) => {
    return (
      <div className="actionEventFile">
        {!row.isImportant && (
          <Tooltip placement="bottomLeft" title={t("view.storage.tick")}>
            <FiBookmark
              className="icon"
              onClick={(e) => {
                e.stopPropagation();
                onSetImportantFileHandler(row?.uuid, true);
              }}
            />
          </Tooltip>
        )}
        {row.isImportant && (
          <Tooltip placement="bottomLeft" title={t("view.storage.untick")}>
            <FiBookmark
              className="icon-active"
              onClick={(e) => {
                e.stopPropagation();
                onSetImportantFileHandler(row?.uuid, false);
              }}
            />
          </Tooltip>
        )}
      </div>
    );
  };

  const renderSelectContent = (name, fieldName) => {
    return (
      <div className="event-select">
        <span className="event-name">{name}</span>&nbsp;
        <span className="field-name">{fieldName}</span>
      </div>
    );
  };

  const renderPopoverContent = (row) => {
    return (
      <Select
        allowClear
        showSearch
        onChange={(uuid) => onSetEventFileHandler(uuid, row?.uuid)}
        onClick={(e) => {
          e.stopPropagation();
        }}
        filterOption={filterOption}
        // options={normalizeOptions("name", "uuid", eventList)}
        placeholder={t("view.category.event_type")}
        defaultValue={row?.eventUuid ? row?.eventUuid : null}
        options={eventList.map((e) => ({
          value: e.uuid,
          label: renderSelectContent(e.name, e.fieldName),
        }))}
      />
    );
  };

  const renderSetEventAction = (row) => {
    return (
      <div className="actionEventFileInActive">
        <Tooltip placement="bottomLeft" title={t("view.storage.set_event")}>
          <Popover
            overlayClassName="actionEventFilePopover"
            placement="right"
            title=""
            content={() => renderPopoverContent(row)}
            trigger="click"
          >
            <BsThreeDotsVertical
              className="icon"
              onClick={(e) => {
                e.stopPropagation();
              }}
            />
          </Popover>
        </Tooltip>
      </div>
    );
  };

  const createFileColumns = () => {
    if (props.viewFileType === 0) {
      return [
        {
          title: `${t("view.storage.type")}`,
          dataIndex: "type",
          key: "type",
          width: 60,
          fixed: "left",
          render: renderType,
        },
        {
          title: `${t("view.storage.file_name")}`,
          dataIndex: "name",
          key: "name",
          width: 200,
          render: renderName,
        },
        {
          title: "Camera",
          dataIndex: "cameraName",
          key: "cameraName",
          width: 240,
          render: renderName,
        },
        {
          title: `${t("view.storage.created_time")}`,
          width: 160,
          dataIndex: "startRecordTime",
          render: renderTime,
        },
      ];
    } else if (props.viewFileType === 1) {
      return [
        {
          title: `${t("view.storage.type")}`,
          dataIndex: "type",
          key: "type",
          width: 60,
          fixed: "left",
          render: renderType,
        },
        {
          title: `${t("view.storage.file_name")}`,
          dataIndex: "name",
          key: "name",
          width: 240,
          render: renderName,
        },
        {
          title: "Camera",
          dataIndex: "cameraName",
          key: "cameraName",
          width: 240,
          render: renderName,
        },
        {
          title: `${t("view.storage.created_time")}`,
          width: 160,
          dataIndex: "createdTime",
          render: renderTime,
        },
        {
          title: "",
          dataIndex: "",
          key: "action",
          align: "right",
          width: 50,
          fixed: "right",
          render: renderSetEventAction,
        },
      ];
    } else if (props.viewFileType === 2) {
      return [
        {
          title: `${t("view.storage.type")}`,
          dataIndex: "type",
          key: "type",
          width: 60,
          fixed: "left",
          render: renderType,
        },
        {
          title: `${t("view.storage.event")}`,
          width: 240,
          dataIndex: "eventName",
          render: renderName,
        },
        {
          title: `${t("view.storage.file_name")}`,
          dataIndex: "name",
          key: "name",
          width: 240,
          render: renderName,
        },
        {
          title: "Camera",
          dataIndex: "cameraName",
          key: "cameraName",
          width: 240,
          render: renderName,
        },
        {
          title: `${t("view.storage.created_time")}`,
          width: 160,
          dataIndex: "createdTime",
          render: renderTime,
        },
        {
          title: "",
          dataIndex: "",
          key: "action",
          align: "right",
          width: 50,
          fixed: "right",
          render: renderSetImportantAction,
        },
      ];
    } else if (props.viewFileType === 4) {
      return [
        {
          title: `${t("view.storage.type")}`,
          dataIndex: "type",
          key: "type",
          width: 60,
          fixed: "left",
          render: () => {
            return <FiImage className="iconType" />;
          },
        },

        {
          title: `${t("view.storage.event")}`,
          width: 120,
          dataIndex: "subEventType",
          render: renderSubtype,
        },
        // {
        //     title: `${t('view.storage.file_name')}`,
        //     dataIndex: "fileName",
        //     key: "fileName",
        //     width: 150,
        //     render: renderName,
        // },
        {
          title: `${t("view.ai_events.camera_name")}`,
          dataIndex: "cameraName",
          key: "cameraName",
          width: 240,
          render: renderName,
        },
        {
          title: `${t("view.storage.violation_time")}`,
          width: 160,
          dataIndex: "createdTime",
          render: renderTime,
        },
        {
          title: `${t("view.penalty_ticket.ticket_num")}`,
          dataIndex: "penaltyTicketId",
          key: "penaltyTicketId",
          width: 200,
          render: renderName,
        },
        {
          title: `${t("view.common_device.status")}`,
          dataIndex: "status",
          key: "status",
          width: 160,
          render: renderName,
        },
        {
          title: `${t("view.storage.note")}`,
          width: 160,
          dataIndex: "note",
        },
      ];
    } else {
      return [
        {
          title: `${t("view.storage.type")}`,
          dataIndex: "type",
          key: "type",
          width: 60,
          fixed: "left",
          render: renderType,
        },
        {
          title: `${t("view.storage.file_name")}`,
          dataIndex: "name",
          key: "name",
          width: 240,
          render: renderName,
        },
        {
          title: "Camera",
          dataIndex: "cameraName",
          key: "cameraName",
          width: 240,
          render: renderName,
        },
        {
          title: `${t("view.storage.event")}`,
          width: 240,
          dataIndex: "eventName",
          render: renderName,
        },
        {
          title: `${t("view.storage.created_time")}`,
          width: 160,
          dataIndex: "createdTime",
          render: renderTime,
        },
        {
          title: "",
          dataIndex: "",
          key: "action",
          align: "right",
          width: 50,
          fixed: "right",
          render: renderSetImportantAction,
        },
      ];
    }
  };

  const fileColumns = createFileColumns();
  const [cameraList, setCameraList] = useState([]);
  const [cameraGroupList, setCameraGroupList] = useState([]);
  const [provinceList, setProvinceList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [wardList, setWardList] = useState([]);
  const [adminUnitList, setAdminUnitList] = useState([]);
  const [form] = Form.useForm();
  const [searchParam, setSearchParam] = useState(searchCaptureFileParamDefault);
  const iPage = 1;
  const iPageSize = 15;
  const [page, setPage] = useState(iPage);
  const [pageSize, setPageSize] = useState(iPageSize);
  const [useAdvanceSearch, setUseAdvanceSearch] = useState(false);
  let timerIdentifier = null;
  const [selectedRowUuid, setSelectedRowUuid] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const onClickRowSelect = (record) => {
    if (props) {
      setSelectedRowUuid(record.uuid);
      props.onClickRow(record);
    }
  };

  const getAllCamera = (cameraGroupUuid) => {
    if (cameraGroupUuid === "") {
      cameraApi
        .getAll({ page: 0, size: 1000000, sort_by: "name", order_by: "asc" })
        .then((data) => {
          if (data && data.payload) {
            setCameraList(data.payload);
          }
        });
    } else {
      cameraApi
        .getAll({
          page: 0,
          size: 1000000,
          sort_by: "name",
          order_by: "asc",
          cameraGroupUuid: cameraGroupUuid,
        })
        .then((data) => {
          if (data && data.payload) {
            setCameraList(data.payload);
          }
        });
    }
  };

  useEffect(() => {
    AddressApi.getAllProvinces().then(setProvinceList);
    adDivisionApi
      .getAll({ page: 0, size: 1000000, sort_by: "name", order_by: "asc" })
      .then((data) => {
        if (data && data.payload) {
          setAdminUnitList(data.payload);
        }
      });
    getAllCamera("");
    cameraGroupApi
      .getAll({
        parent: "all",
        page: 0,
        size: 1000000,
        sort_by: "name",
        order_by: "asc",
      })
      .then((data) => {
        if (data && data.payload) {
          setCameraGroupList(data.payload);
        }
      });
  }, []);

  const onSetImportantFileHandler = (uuid, isImportant) => {
    const newListFile = [...listFiles];
    const index = findIndex(newListFile, (item) => item.uuid === uuid);
    if (index !== -1) {
      newListFile[index] = Object.assign({
        ...newListFile[index],
        isImportant: isImportant,
      });
      props.onEditFile(newListFile[index], newListFile, "mark_important_file");
    }
  };

  const onSetEventFileHandler = (eventUuid, uuid) => {
    let index = findIndex(eventList, (item) => item.uuid === eventUuid);
    if (index !== -1) {
      const eventName = eventList[index].name;
      const newListFile = [...listFiles];
      index = findIndex(newListFile, (item) => item.uuid === uuid);
      if (index !== -1) {
        newListFile[index] = Object.assign({
          ...newListFile[index],
          tableName: "event_file",
          eventUuid: eventUuid,
          eventName: eventName,
        });
        props.onEditFile(newListFile[index], newListFile, "");
      }
    }
  };

  const onAdvanceSearchHandler = (currPage, currPageSize, currSearchParam) => {
    let dataParam = {};
    if (props.viewFileType === 2) {
      let eventUuid = "notnull";
      if (currSearchParam.eventUuid !== "")
        eventUuid = currSearchParam.eventUuid;
      dataParam = Object.assign({
        ...currSearchParam,
        page: currPage,
        size: currPageSize,
        eventUuid: eventUuid,
      });
    } else {
      dataParam = Object.assign({
        ...currSearchParam,
        page: currPage,
        size: currPageSize,
      });
    }
    props.onSearch(dataParam);
  };

  const onQuickSearchHandler = (value) => {
    console.log("value", value);
    value = value.trim();
    let dataParam = {};
    if (props.viewFileType === 2) {
      let eventUuid = "notnull";
      dataParam = Object.assign({
        ...searchParam,
        searchType: "all",
        searchValue: value,
        eventUuid: eventUuid,
      });
    } else {
      dataParam = Object.assign({
        ...searchParam,
        searchType: "all",
        searchValue: value,
      });
    }
    props.onSearch(dataParam);
    setSearchParam(dataParam);
    setPage(iPage);
  };

  const handleQuickSearchBlur = (event) => {
    const value = event.target.value.trim();
    form.setFieldsValue({
      quickSearch: value,
    });
  };
  const handleQuickSearchPaste = (event) => {
    const value = event.target.value.trimStart();
    form.setFieldsValue({
      quickSearch: value,
    });
  };

  const handleAddressBlur = (event) => {
    const value = event.target.value.trim();
    form.setFieldsValue({
      address: value,
    });
  };

  useEffect(() => {
    setUseAdvanceSearch(false);
    clearAllValueHandler();
    if (!props.isOpenRootFile) {
      if (props.viewFileType === 2) {
        props.onSearch({
          ...searchCaptureFileParamDefault,
          searchType: "all",
          eventUuid: "notnull",
        });
      } else {
        props.onSearch({ ...searchCaptureFileParamDefault, searchType: "all" });
      }
    }
    setPage(iPage);
    setPageSize(iPageSize);
  }, [props.viewFileType]);

  const clearAllValueHandler = () => {
    setProvinceList([...provinceList]);
    setDistrictList([]);
    setWardList([]);
    form.setFieldsValue({
      provinceId: null,
      districtId: null,
      wardId: null,
      address: "",
      administrativeUnitUuid: null,
      cameraUuid: null,
      cameraGroupUuid: null,
      startDate: null,
      endDate: null,
      type: null,
      event: null,
      plateNumber: null,
      code: null,
      name: null,
      eventName: null,
      eventType: null,
      fileName: null,
      quickSearch: "",
    });
    setSearchParam(searchCaptureFileParamDefault);
    getAllCamera("");
    setSelectedRowUuid("");
  };

  const onChangeCity = (cityId) => {
    form.setFieldsValue({ districtId: null, wardId: null });
    setWardList([]);
    AddressApi.getDistrictByProvinceId(cityId).then(setDistrictList);
    const dataParam = Object.assign({ ...searchParam, provinceId: cityId });
    setSearchParam(dataParam);
  };

  const onChangeDistrict = (districtId) => {
    form.setFieldsValue({ wardId: null });
    AddressApi.getWardByDistrictId(districtId).then(setWardList);
    const dataParam = Object.assign({ ...searchParam, districtId: districtId });
    setSearchParam(dataParam);
  };

  const onChangeWard = (wardId) => {
    const dataParam = Object.assign({ ...searchParam, wardId: wardId });
    setSearchParam(dataParam);
  };

  const onChangeAddress = (event) => {
    clearTimeout(timerIdentifier);
    let value = event.target.value;
    timerIdentifier = setTimeout(() => {
      const dataParam = Object.assign({ ...searchParam, address: value });
      setSearchParam(dataParam);
    }, 500);
  };

  const onFileName = (event) => {
    form.setFieldsValue({
      fileName: event.target.value.trim(),
    });
    const dataParam = Object.assign({
      ...searchParam,
      fileName: event.target.value.trim(),
    });
    setSearchParam(dataParam);
  };

  const onCode = (event) => {
    form.setFieldsValue({
      code: event.target.value.trim(),
    });
    const dataParam = Object.assign({
      ...searchParam,
      code: event.target.value.trim(),
    });
    setSearchParam(dataParam);
  };

  const onName = (event) => {
    form.setFieldsValue({
      name: event.target.value.trim(),
    });
    const dataParam = Object.assign({
      ...searchParam,
      name: event.target.value.trim(),
    });
    setSearchParam(dataParam);
  };

  const onPlateNumber = (event) => {
    form.setFieldsValue({
      plateNumber: event.target.value.trim(),
    });
    const dataParam = Object.assign({
      ...searchParam,
      plateNumber: event.target.value.trim(),
    });
    setSearchParam(dataParam);
  };

  const onChangeUnit = (unitId) => {
    const dataParam = Object.assign({
      ...searchParam,
      administrativeUnitUuid: unitId,
    });
    setSearchParam(dataParam);
  };

  const onChangeType = (id) => {
    const dataParam = Object.assign({ ...searchParam, type: id });
    setSearchParam(dataParam);
  };

  const onChangeEventType = (eventUuid) => {
    const dataParam = Object.assign({ ...searchParam, eventUuid: eventUuid });
    setSearchParam(dataParam);
  };

  const onChangeSubEventType = (type) => {
    const dataParam = Object.assign({ ...searchParam, eventType: type });
    setSearchParam(dataParam);
  };

  const onChangeCamera = (cameraUuid) => {
    const dataParam = Object.assign({ ...searchParam, cameraUuid: cameraUuid });
    setSearchParam(dataParam);
  };

  const onChangeCameraGroup = (cameraGroupUuid) => {
    const dataParam = Object.assign({
      ...searchParam,
      cameraGroupUuid: cameraGroupUuid,
      cameraUuid: null,
    });
    setSearchParam(dataParam);
    form.setFieldsValue({
      cameraUuid: null,
    });
    getAllCamera(cameraGroupUuid);
  };

  const onChangeStartDate = (moment) => {
    if (moment) {
      moment.set("hour", 0);
      moment.set("minute", 0);
      moment.set("second", 0);
      moment.set("millisecond", 1);
      if (endDate && moment.isAfter(endDate)) {
        form.setFieldsValue({
          startDate: null,
        });
        const dataParam = Object.assign({
          ...searchParam,
          startRecordTime: -1,
        });
        setSearchParam(dataParam);
        setStartDate(null);
      } else {
        const dataParam = Object.assign({
          ...searchParam,
          startRecordTime: +moment.unix(),
        });
        setSearchParam(dataParam);
        setStartDate(moment);
      }
    } else {
      const dataParam = Object.assign({ ...searchParam, startRecordTime: -1 });
      setSearchParam(dataParam);
    }
  };

  const onChangeEndDate = (moment) => {
    if (moment) {
      moment.set("hour", 23);
      moment.set("minute", 59);
      moment.set("second", 59);
      moment.set("millisecond", 999);
      if (startDate && startDate.isAfter(moment)) {
        form.setFieldsValue({
          endDate: null,
        });
        const dataParam = Object.assign({
          ...searchParam,
          endRecordTime: -1,
        });
        setSearchParam(dataParam);
        setEndDate(null);
      } else {
        const dataParam = Object.assign({
          ...searchParam,
          endRecordTime: +moment.unix(),
        });
        setSearchParam(dataParam);
        setEndDate(moment);
      }
    } else {
      const dataParam = Object.assign({ ...searchParam, endRecordTime: -1 });
      setSearchParam(dataParam);
    }
  };

  const onAdvanceSearchDisplayHandler = () => {
    setUseAdvanceSearch((prevState) => {
      return !prevState;
    });
  };

  const renderGridView = () => {
    if (listFiles) {
      if (props.viewFileType < 2) {
        return (
          <div className="gridFileContainer">
            <div className="data">
              {listFiles.map((value, i) => (
                <div className="box" key={i}>
                  <div
                    className="gridFileImage"
                    key={i}
                    onClick={() => props.onClickRow(value)}
                  >
                    <img
                      className="imageFile"
                      src={
                        "data:image/jpeg;base64," +
                        (value.thumbnailData && value.thumbnailData.length > 0
                          ? value.thumbnailData[0]
                          : "")
                      }
                      alt={
                        value.thumbnailData && value.thumbnailData.length > 0
                          ? value.name
                          : ""
                      }
                    />
                    {value && value.name && value.name.length > 30 ? (
                      <Tooltip title={value.name}>
                        <span className="nameFile">
                          {value.name.substr(0, 14) +
                            "..." +
                            value.name.substr(
                              value.name.length - 15,
                              value.name.length - 1
                            )}
                        </span>
                      </Tooltip>
                    ) : (
                      <span className="nameFile">{value.name}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Pagination
              showLessItems={true}
              showSizeChanger={true}
              onShowSizeChange={(current, size) => {
                setPage(current);
                setPageSize(size);
                if (size !== pageSize)
                  onAdvanceSearchHandler(current, size, searchParam);
              }}
              current={page}
              defaultCurrent={page}
              pageSize={pageSize}
              defaultPageSize={15}
              pageSizeOptions={[15, 30, 60, 120]}
              total={total}
              onChange={(value) => {
                setPage(value);
                if (value !== page)
                  onAdvanceSearchHandler(value, pageSize, searchParam);
              }}
            />
          </div>
        );
      } else if (props.viewFileType === 4) {
        return (
          <div className="gridEventFileContainer">
            {listFiles.map((value, i) => {
              return (
                <div key={i} className="gridEventFileItem">
                  <Row gutter={[16, 0]} className="row1">
                    <Col span={8}>
                      <div
                        className="gridFileImage"
                        onClick={() => props.onClickRow(value)}
                      >
                        {value.overViewUrl ? (
                          <img
                            className="imageFile"
                            src={value.overViewUrl}
                            alt={value.overViewUrl ? value.overViewUrl : ""}
                          />
                        ) : (
                          <img
                            className="imageFile"
                            src={
                              "data:image/jpeg;base64," +
                              (value.thumbnailData &&
                              value.thumbnailData.length > 0
                                ? value.thumbnailData
                                : "")
                            }
                            alt={
                              value.thumbnailData &&
                              value.thumbnailData.length > 0
                                ? value.name
                                : ""
                            }
                          />
                        )}
                      </div>
                    </Col>
                    <Col span={15}>
                      <Row gutter={[0, 8]}>
                        <Col span={24}>
                          <ul>
                            {value.eventName ? (
                              <li className="eventName">{value.eventName}</li>
                            ) : (
                              <li className="eventName">
                                {t("view.ai_events." + value.subEventType)}
                              </li>
                            )}
                            {value.fileName ? (
                              <li className="name">{value.fileName}</li>
                            ) : null}
                            {value.pathFile ? (
                              <li className="pathFile">{value.pathFile}</li>
                            ) : null}
                            <li className="createdTime">
                              {moment(+value.createdTime).format(
                                "HH:mm DD/MM/YYYY"
                              )}
                            </li>
                          </ul>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row gutter={[16, 0]} className="row2">
                    <Col span={8}>
                      <ul>
                        <li className="cameraName">
                          {value &&
                          value.cameraName &&
                          value.cameraName.length > 24 ? (
                            <Tooltip title={value.cameraName}>
                              <span>
                                {value.cameraName.substr(0, 10) +
                                  "..." +
                                  value.cameraName.substr(
                                    value.cameraName.length - 10,
                                    value.cameraName.length - 1
                                  )}
                              </span>
                            </Tooltip>
                          ) : (
                            <span>{value.cameraName}</span>
                          )}
                        </li>
                      </ul>
                    </Col>
                    <Col span={16}>
                      <ul>
                        <li className="address">{value.address}</li>
                      </ul>
                    </Col>
                  </Row>
                  <hr />
                </div>
              );
            })}
            {/* </div> */}

            <Pagination
              showLessItems={true}
              showSizeChanger={true}
              onShowSizeChange={(current, size) => {
                setPage(current);
                setPageSize(size);
                if (size !== pageSize)
                  onAdvanceSearchHandler(current, size, searchParam);
              }}
              current={page}
              defaultCurrent={page}
              pageSize={pageSize}
              defaultPageSize={15}
              pageSizeOptions={[15, 30, 60, 120]}
              total={total}
              onChange={(value) => {
                setPage(value);
                if (value !== page)
                  onAdvanceSearchHandler(value, pageSize, searchParam);
              }}
            />
          </div>
        );
      } else {
        return (
          <div className="gridEventFileContainer">
            {listFiles.map((value, i) => {
              return (
                <div key={i} className="gridEventFileItem">
                  <Row gutter={[16, 0]} className="row1">
                    <Col span={8}>
                      <div
                        className="gridFileImage"
                        onClick={() => props.onClickRow(value)}
                      >
                        <img
                          className="imageFile"
                          src={
                            "data:image/jpeg;base64," +
                            (value.thumbnailData &&
                            value.thumbnailData.length > 0
                              ? value.thumbnailData[0]
                              : "")
                          }
                          alt={
                            value.thumbnailData &&
                            value.thumbnailData.length > 0
                              ? value.name
                              : ""
                          }
                        />
                      </div>
                    </Col>
                    <Col span={15}>
                      <Row gutter={[0, 8]}>
                        <Col span={24}>
                          <ul>
                            <li className="eventName">{value.eventName}</li>
                            <li className="name">{value.name}</li>
                            <li className="pathFile">{value.pathFile}</li>
                            <li className="createdTime">
                              {moment(+value.violationTime * 1000).format(
                                "HH:mm DD/MM/YYYY"
                              )}
                            </li>
                          </ul>
                        </Col>
                      </Row>
                    </Col>
                    <Col span={1}>
                      <div className="actionEventFile">
                        {!value.isImportant && (
                          <FiBookmark
                            className="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSetImportantFileHandler(value.uuid, true);
                            }}
                          />
                        )}
                        {value.isImportant && (
                          <FiBookmark
                            className="icon-active"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSetImportantFileHandler(value.uuid, false);
                            }}
                          />
                        )}
                      </div>
                    </Col>
                  </Row>
                  <Row gutter={[16, 0]} className="row2">
                    <Col span={8}>
                      <ul>
                        <li className="cameraName">
                          {value &&
                          value.cameraName &&
                          value.cameraName.length > 24 ? (
                            <Tooltip title={value.cameraName}>
                              <span>
                                {value.cameraName.substr(0, 10) +
                                  "..." +
                                  value.cameraName.substr(
                                    value.cameraName.length - 10,
                                    value.cameraName.length - 1
                                  )}
                              </span>
                            </Tooltip>
                          ) : (
                            <span>{value.cameraName}</span>
                          )}
                        </li>
                      </ul>
                    </Col>
                    <Col span={16}>
                      <ul>
                        <li className="address">{value.address}</li>
                      </ul>
                    </Col>
                  </Row>
                  <hr />
                </div>
              );
            })}
            {/* </div> */}

            <Pagination
              showLessItems={true}
              showSizeChanger={true}
              onShowSizeChange={(current, size) => {
                setPage(current);
                setPageSize(size);
                if (size !== pageSize)
                  onAdvanceSearchHandler(current, size, searchParam);
              }}
              current={page}
              defaultCurrent={page}
              pageSize={pageSize}
              defaultPageSize={15}
              pageSizeOptions={[15, 30, 60, 120]}
              total={total}
              onChange={(value) => {
                setPage(value);
                if (value !== page)
                  onAdvanceSearchHandler(value, pageSize, searchParam);
              }}
            />
          </div>
        );
      }
    }
  };
  const renderTableView = () => {
    return (
      <Table
        className="table__list--file height-table"
        rowClassName={(record, rowIndex) => {
          if (record.uuid === selectedRowUuid) return "selected";
          return "not-selected";
        }}
        rowKey="uuid"
        columns={fileColumns}
        dataSource={listFiles}
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              onClickRowSelect(record);
            },
          };
        }}
        scroll={{ x: 600, y: 650 }}
        pagination={{
          showLessItems: true,
          showSizeChanger: true,
          onShowSizeChange: (current, size) => {
            setPage(current);
            setPageSize(size);
            if (size !== pageSize)
              onAdvanceSearchHandler(current, size, searchParam);
          },
          hideOnSinglePage: false,
          current: page,
          total: total,
          pageSize: pageSize,
          pageSizeOptions: [15, 30, 60, 120],
          onChange: (value) => {
            setPage(value);
            if (value !== page)
              onAdvanceSearchHandler(value, pageSize, searchParam);
          },
        }}
      />
    );
  };

  return (
    <>
      <Form
        className="bg-grey formSearch"
        form={form}
        {...formItemLayout}
        style={{ width: "100%", paddingBottom: "30px" }}
      >
        <Row gutter={24} className="itemRow">
          <Col span={23}>
            <Row gutter={24} className="itemRow">
              <Col span={24}>
                <div>
                  <Form.Item name={["quickSearch"]} className="search__bar">
                    <AutoComplete
                      maxLength={255}
                      onBlur={handleQuickSearchBlur}
                      onPaste={handleQuickSearchPaste}
                      onSearch={debounce(onQuickSearchHandler, 1500)}
                      placeholder={
                        <>
                          <SearchOutlined />
                          <span className="placeholder__text">
                            {t("view.map.search")}
                          </span>
                        </>
                      }
                    />
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <Row
              gutter={24}
              className="itemRow"
              style={!useAdvanceSearch ? { display: "none" } : {}}
            >
              <Col span={8}>
                <Form.Item name={["provinceId"]}>
                  <Select
                    allowClear
                    showSearch
                    onChange={(cityId) => onChangeCity(cityId)}
                    filterOption={filterOption}
                    options={normalizeOptions(
                      "name",
                      "provinceId",
                      provinceList
                    )}
                    placeholder={t("view.map.province_id")}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name={["districtId"]}>
                  <Select
                    allowClear
                    showSearch
                    onChange={(districtId) => onChangeDistrict(districtId)}
                    filterOption={filterOption}
                    options={normalizeOptions(
                      "name",
                      "districtId",
                      districtList
                    )}
                    placeholder={t("view.map.district_id")}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name={["wardId"]}>
                  <Select
                    allowClear
                    showSearch
                    onChange={(id) => onChangeWard(id)}
                    filterOption={filterOption}
                    options={normalizeOptions("name", "id", wardList)}
                    placeholder={t("view.map.ward_id")}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row
              gutter={24}
              className="itemRow"
              style={!useAdvanceSearch ? { display: "none" } : {}}
            >
              <Col span={16}>
                <Form.Item name={["address"]} rules={[{ required: false }]}>
                  <Input
                    placeholder={t("view.storage.street")}
                    onChange={onChangeAddress}
                    maxLength={255}
                    onBlur={handleAddressBlur}
                    onPaste={(e) => {
                      form.setFieldsValue({
                        address: e.target.value.trimStart(),
                      });
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name={["administrativeUnitUuid"]}>
                  <Select
                    showSearch
                    allowClear
                    onChange={(id) => onChangeUnit(id)}
                    filterOption={filterOption}
                    options={normalizeOptions("name", "uuid", adminUnitList)}
                    placeholder={t("view.map.administrative_unit")}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row
              gutter={24}
              className="itemRow"
              style={!useAdvanceSearch ? { display: "none" } : {}}
            >
              <Col span={12}>
                <Form.Item name={["cameraGroupUuid"]}>
                  <Select
                    allowClear
                    showSearch
                    onChange={(uuid) => onChangeCameraGroup(uuid)}
                    filterOption={filterOption}
                    options={normalizeOptions("name", "uuid", cameraGroupList)}
                    placeholder={t("view.map.camera_group", {
                      cam: t("camera"),
                    })}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name={["cameraUuid"]}>
                  <Select
                    allowClear
                    showSearch
                    onChange={(uuid) => onChangeCamera(uuid)}
                    filterOption={filterOption}
                    options={normalizeOptions("name", "uuid", cameraList)}
                    placeholder="Camera"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row
              gutter={24}
              className="itemRow"
              style={!useAdvanceSearch ? { display: "none" } : {}}
            >
              <Col span={8}>
                <Form.Item name={["startDate"]}>
                  <DatePicker
                    onChange={onChangeStartDate}
                    placeholder={t("view.storage.from_date")}
                    style={{ width: "100%" }}
                    locale={locale}
                    format="DD/MM/YYYY"
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name={["endDate"]}>
                  <DatePicker
                    onChange={onChangeEndDate}
                    placeholder={t("view.storage.to_date")}
                    style={{ width: "100%" }}
                    locale={locale}
                    format="DD/MM/YYYY"
                  />
                </Form.Item>
              </Col>
            </Row>
            {props.viewFileType === 4 && (
              <Row
                gutter={24}
                className="itemRow"
                style={!useAdvanceSearch ? { display: "none" } : {}}
              >
                <Col span={8}>
                  <Form.Item name={["fileName"]} rules={[{ required: false }]}>
                    <Input
                      placeholder={t("view.storage.file_name")}
                      onChange={onFileName}
                      maxLength={255}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name={["code"]} rules={[{ required: false }]}>
                    <Input
                      placeholder={t("view.ai_humans.code")}
                      onChange={onCode}
                      maxLength={255}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name={["name"]} rules={[{ required: false }]}>
                    <Input
                      placeholder={t("view.ai_humans.name")}
                      onChange={onName}
                      maxLength={255}
                    />
                  </Form.Item>
                </Col>
              </Row>
            )}

            <Row
              gutter={24}
              className="itemRow"
              style={!useAdvanceSearch ? { display: "none" } : {}}
            >
              <Col span={8}>
                {props.viewFileType >= 1 && props.viewFileType != 4 && (
                  <Form.Item name={["type"]}>
                    <Select
                      allowClear
                      showSearch
                      onChange={(id) => onChangeType(id)}
                      filterOption={filterOption}
                      options={normalizeOptions("name", "id", typeList)}
                      placeholder={t("view.storage.file_type")}
                    />
                  </Form.Item>
                )}
                {props.viewFileType === 4 && (
                  <Form.Item
                    name={["plateNumber"]}
                    rules={[{ required: false }]}
                  >
                    <Input
                      placeholder={t("view.ai_events.plateNumber")}
                      onChange={onPlateNumber}
                      maxLength={255}
                    />
                  </Form.Item>
                )}
              </Col>
              <Col span={8}>
                {props.viewFileType >= 2 && props.viewFileType != 4 && (
                  <Form.Item name={["eventType"]}>
                    <Select
                      allowClear
                      showSearch
                      onChange={(uuid) => onChangeEventType(uuid)}
                      filterOption={filterOption}
                      options={normalizeOptions("name", "uuid", eventList)}
                      placeholder={t("view.storage.event_type")}
                    />
                  </Form.Item>
                )}

                {props.viewFileType === 4 && (
                  <Form.Item name={["eventType"]}>
                    <Select
                      allowClear
                      showSearch
                      onChange={(type) => onChangeSubEventType(type)}
                      filterOption={filterOption}
                      options={normalizeOptions("name", "type", eventListAI)}
                      placeholder={t("view.storage.event_type")}
                    />
                  </Form.Item>
                )}
              </Col>
              <Col span={8}>
                <Tooltip
                  placement="bottom"
                  title={t("view.map.btn_remove_filter")}
                >
                  <div className="search">
                    <MdClear
                      className="icon"
                      onClick={() => {
                        clearAllValueHandler();
                      }}
                    />
                  </div>
                </Tooltip>
                <Tooltip placement="bottom" title={t("view.map.btn_apply")}>
                  <div className="search">
                    <FiSearch
                      className="icon"
                      onClick={() => {
                        setPage(iPage);
                        setPageSize(iPageSize);
                        onAdvanceSearchHandler(iPage, iPageSize, searchParam);
                      }}
                    />
                  </div>
                </Tooltip>
              </Col>
            </Row>
          </Col>
          <Col span={1} className="dropdown">
            <div className="iconContainer">
              {!useAdvanceSearch && (
                <IoChevronDownOutline
                  className="icon"
                  onClick={onAdvanceSearchDisplayHandler}
                />
              )}
              {useAdvanceSearch && (
                <IoChevronUpOutline
                  className="icon"
                  onClick={onAdvanceSearchDisplayHandler}
                />
              )}
            </div>
          </Col>
        </Row>
      </Form>
      <div className="tableData">
        {props.isTableView && renderTableView()}
        {!props.isTableView && renderGridView()}
      </div>
    </>
  );
};

function tableFilePropsAreEqual(prevTableFile, nextTableFile) {
  return (
    _.isEqual(prevTableFile.isTableView, nextTableFile.isTableView) &&
    _.isEqual(prevTableFile.viewFileType, nextTableFile.viewFileType) &&
    _.isEqual(prevTableFile.listFiles, nextTableFile.listFiles) &&
    _.isEqual(prevTableFile.total, nextTableFile.total)
  );
}

export const MemoizedTableFile = React.memo(TableFile, tableFilePropsAreEqual);
