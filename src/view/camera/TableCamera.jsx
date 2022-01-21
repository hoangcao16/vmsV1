import {
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  FilterOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  ScanOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  AutoComplete,
  Button,
  Col,
  Form,
  Input,
  List,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Tag,
  Tooltip,
} from "antd";
import "antd/dist/antd.css";
import { isEmpty } from "lodash";
import debounce from "lodash/debounce";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useRouteMatch, withRouter } from "react-router-dom";
import { reactLocalStorage } from "reactjs-localstorage";
import AddressApi from "../../actions/api/address/AddressApi";
import AdDivisionApi from "../../actions/api/advision/AdDivision";
import CameraApi from "../../actions/api/camera/CameraApi";
import UserApi from "../../actions/api/user/UserApi.js";
import VendorApi from "../../actions/api/vendor/VendorApi";
import clearData from "../../actions/function/MyUltil/CheckData";
import Notification from "../../components/vms/notification/Notification";
import { ShowTotal } from "../../styled/showTotal";
import {
  filterOption,
  normalizeOptions,
} from "../../view/common/select/CustomSelect";
import Loading from "../Loading";
import "./../commonStyle/commonTable.scss";
import ModalAddCamera, { DATA_FAKE_CAMERA } from "./ModalAddCamera";
import ModalEditCamera from "./ModalEditCamera";
import ModalViewDetail from "./ModalViewDetail";
import "./styleCamera.scss";
import "./TableCamera.scss";
import fileDownload from "js-file-download";
import moment from "moment";
const { Option } = Select;

const STATUS = {
  SUCCESS: 1,
  ERRORS: 0,
};

const UNIT = {
  ALL: "all",
  CAMERA_NAME: "name",
  CAMERA_CODE: "code",
  CAMERA_TYPE: "type",
  VENDOR: "vendor",
  PORT: "port",
  ZONE: "zone",
  IP: "ip",
  URL: "url",
  UNIT_AD: "unit",
  ADDRESS: "address",
};

const TableCamera = () => {
  const { t } = useTranslation();
  const [listCamera, setListCamera] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState(null);
  const [selectedCameraIdEdit, setSelectedCameraIdEdit] = useState(null);
  const [selectedAdd, setSelectedAdd] = useState(false);
  const [selectedEdit, setSelectedEdit] = useState(false);
  const [selectedScan, setSelectedScan] = useState(false);
  const [loading, setLoading] = useState(false);
  const [provinceId, setProvinceId] = useState("");
  const [districts, setDistrict] = useState([]);
  const [districtId, setDistrictId] = useState("");
  const [wardId, setWardId] = useState("");
  const [administrativeUnitUuid, setAdministrativeUnitUuid] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("");
  const [vendorUuid, setVendorUuid] = useState("");
  const [wards, setWard] = useState([]);
  const [form] = Form.useForm();
  const [filterOptions, setFilterOptions] = useState(DATA_FAKE_CAMERA);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState("");
  const [unit, setUnit] = useState(UNIT.ALL);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const history = useHistory();
  let { path } = useRouteMatch();

  const formItemLayout = {
    wrapperCol: { span: 24 },
    labelCol: { span: 24 },
  };

  useEffect(() => {
    setLoading(true);
    let data = {
      name: "",
      address: address,
      provinceId: provinceId,
      districtId: districtId,
      id: wardId,
      administrativeUnitUuid: administrativeUnitUuid,
      vendorUuid: vendorUuid,
      starecordingStatustus: status,
      page: page,
      size: size,
    };

    CameraApi.getAllCameraWidthTotal(data)
      .then((result) => {
        setListCamera(result.payload);
        setTotal(result?.metadata?.total);
      })
      .finally(setLoading(false));
    setLoading(false);
  }, []);

  useEffect(() => {
    setLoading(true);
    let data = {
      address: address,
      name: search,
      searchType: unit,
      searchValue: search,
      provinceId: provinceId,
      districtId: districtId,
      id: wardId,
      administrativeUnitUuid: administrativeUnitUuid,
      vendorUuid: vendorUuid,
      recordingStatus: status,
      page: page,
      size: size,
    };

    CameraApi.getAllCameraWidthTotal(data)
      .then((result) => {
        setListCamera(result.payload);
        setTotal(result?.metadata?.total);
      })
      .finally(setLoading(false));
    setLoading(false);
  }, [page, size]);

  useEffect(() => {
    setLoading(true);
    let data = {
      address: address,
      searchType: unit,
      searchValue: search,
      provinceId: provinceId,
      districtId: districtId,
      id: wardId,
      administrativeUnitUuid: administrativeUnitUuid,
      vendorUuid: vendorUuid,
      recordingStatus: status,
      page: page,
      size: size,
    };

    CameraApi.getAllCameraWidthTotal(data)
      .then((result) => {
        setListCamera(result.payload);
        setTotal(result?.metadata?.total);
      })
      .finally(setLoading(false));
    setLoading(false);
  }, [selectedAdd, selectedEdit]);

  const handleDelete = async (cameraId) => {
    const isDeleted = await CameraApi.delete(cameraId);
    let data = {
      name: search,
      address: address,
      provinceId: provinceId,
      districtId: districtId,
      id: wardId,
      administrativeUnitUuid: administrativeUnitUuid,
      vendorUuid: vendorUuid,
      recordingStatus: status,
      page: page,
      size: size,
    };

    if (isDeleted) {
      setLoading(true);
      const result = await CameraApi.getAllCameraWidthTotal(data).finally(
        setLoading(false)
      );
      setLoading(false);

      setListCamera(result.payload);
      setTotal(result?.metadata?.total);

      const notifyMess = {
        type: "success",
        title: "",
        description: `${t("noti.successfully_delete_camera")}`,
      };
      Notification(notifyMess);
    }
  };

  useEffect(() => {
    UserApi.getPermissionForUserLogin().then((result) => {
      reactLocalStorage.setObject("permissionUser", result);
    });
  }, []);

  const handleSearch = async (value) => {
    setSearch(value);
    setPage(1);
    // setLoading(true);
    let data = {
      searchType: unit,
      address: address,
      searchValue: value,
      provinceId: provinceId,
      districtId: districtId,
      id: wardId,
      administrativeUnitUuid: administrativeUnitUuid,
      vendorUuid: vendorUuid,
      recordingStatus: status,
      size: size,
    };
    const result = await CameraApi.getAllCameraWidthTotal(data);

    setListCamera(result.payload);
    setTotal(result?.metadata?.total);
    // setLoading(false);
  };

  const handleShowModalInfo = () => {
    setSelectedCameraId(null);
  };

  const handleShowModalEdit = () => {
    setSelectedCameraIdEdit(null);
    setSelectedEdit(false);
  };

  const showModalEdit = () => {
    setSelectedEdit(true);
  };

  const showModalAdd = () => {
    setSelectedAdd(true);
  };

  const handleShowModalAdd = () => {
    setSelectedAdd(false);
  };

  const handleShowModalScan = () => {
    setSelectedScan(false);
  };

  useEffect(() => {
    fetchSelectOptions().then(setFilterOptions);
  }, []);

  useEffect(() => {
    setDistrict([]);

    if (provinceId) {
      AddressApi.getDistrictByProvinceId(provinceId).then(setDistrict);
    }
  }, [provinceId]);

  useEffect(() => {
    setWard([]);

    if (districtId) {
      AddressApi.getWardByDistrictId(districtId).then(setWard);
    }
  }, [districtId]);

  const { provinces, adDivisions, vendors } = filterOptions;

  const onChangeCity = async (cityId) => {
    setProvinceId(cityId);

    await resetDistrictAndWardData();
  };

  function resetDistrictAndWardData() {
    form.setFieldsValue({ districtId: null, wardId: null });
  }

  const onChangeDistrict = async (districtId) => {
    setDistrictId(districtId);
    await resetWardData();
  };

  function resetWardData() {
    form.setFieldsValue({ wardId: null });
  }

  const onChangeTypeFilter = async (value) => {
    setUnit(value);
    setSearch("");
    form.setFieldsValue({ searchForm: null });

    setSearch(value);
    setLoading(true);
    let data = {
      searchType: unit,
      searchValue: "",
      address: address,
      provinceId: provinceId,
      districtId: districtId,
      id: wardId,
      administrativeUnitUuid: administrativeUnitUuid,
      vendorUuid: vendorUuid,
      recordingStatus: status,
      page: page,
      size: size,
    };
    const result = await CameraApi.getAllCameraWidthTotal(data);

    setListCamera(result.payload);
    setTotal(result?.metadata?.total);
    setLoading(false);
  };

  const renderTag = (status) => {
    if (status !== 0) {
      return (
        <Tag
          style={{
            borderRadius: "6px",
            color: "#28C76F",
            backgroundColor: "rgba(40, 199, 111, 0.2) ",
          }}
          color="success"
        >
          {t("view.camera.active")}
        </Tag>
      );
    }
    return (
      <Tag
        style={{
          borderRadius: "6px",
          color: "#EA5455",
          backgroundColor: "rgba(234, 84, 85, 0.2)",
        }}
        color="error"
      >
        {t("view.camera.inactive")}
      </Tag>
    );
  };

  // ===========================Modal

  const showModal = () => {
    setUnit(UNIT.ALL);
    setSearch("");
    form.setFieldsValue({ searchForm: null });
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);

    setSearch("");
    setUnit(null);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = async (value) => {
    setDistrictId(value.districtId ?? "");
    setProvinceId(value.provinceId ?? "");
    setWardId(value.wardId ?? "");
    setAdministrativeUnitUuid(value.administrativeUnitUuid ?? "");
    setStatus(value.recordingStatus ?? "");
    setVendorUuid(value.vendorUuid ?? "");
    setAddress(value.address ?? "");

    const payload = {
      ...value,
      page: page,
      size: size,
    };

    const cleanData = clearData(payload);

    CameraApi.getAllCameraWidthTotal(cleanData)
      .then((result) => {
        setListCamera(result.payload);
        setTotal(result?.metadata?.total);
      })
      .finally(setLoading(false));
    setLoading(false);

    handleOk();
  };

  const handleExport = async () => {
    let data = {
      searchType: unit,
      address: address,
      searchValue: search,
      provinceId: provinceId,
      districtId: districtId,
      id: wardId,
      administrativeUnitUuid: administrativeUnitUuid,
      vendorUuid: vendorUuid,
      recordingStatus: status,
      lang: reactLocalStorage.get("language"),
    };

    await CameraApi.getExportData(data).then((value) => {
      const data = new Blob([value], { type: "application/vnd.ms-excel" });
      fileDownload(
        data,
        `Report_Camera_Info_${moment().format("DD.MM.YYYY_HH.mm.ss")}.xlsx`
      );
    });
  };

  // if (isEmpty(listCamera)) {
  //   return <Spin />;
  // }

  const redirectScan = () => {
    history.push(`${path}/scan`);

    // return <Link to={`${url}/scan`}></Link>;
  };

  const renderHeader = () => {
    return (
      <div className="table__camera">
        <h4 className="font-weight-700">
          {t("view.camera.camera_list", { cam: t("camera") })}
        </h4>
        <div className="d-flex">
          <h4 className="mr-2 total-camera">
            {t("view.camera.camera_quantity", { cam: t("camera") })}:{" "}
            <span>{total}</span>
          </h4>

          <Tooltip
            placement="top"
            title={t("view.camera.scan_to_add_new_camera", {
              cam: t("camera"),
            })}
            style={{ marginRight: "10px" }}
          >
            <Button
              type="primary"
              className=" height-40 btn--scan-camera"
              style={{ borderRadius: "6px" }}
              onClick={redirectScan}
            >
              <ScanOutlined className="d-flex justify-content-between align-center" />
            </Button>
          </Tooltip>

          <Tooltip placement="top" title={t("view.camera.export_camera")}>
            <Button
              type="primary"
              className="btn--add-user height-40 mr-1"
              style={{ borderRadius: "6px" }}
              onClick={handleExport}
            >
              <ExportOutlined className="d-flex justify-content-between align-center" />
            </Button>
          </Tooltip>

          <Tooltip
            placement="rightTop"
            title={t("view.camera.add_new_camera", {
              cam: t("camera"),
              add: t("add"),
            })}
          >
            <Button
              type="primary"
              className="btn--add-user height-40 mr-1"
              style={{ borderRadius: "6px" }}
              onClick={showModalAdd}
            >
              <PlusOutlined className="d-flex justify-content-between align-center" />
            </Button>
          </Tooltip>
        </div>
      </div>
    );
  };

  const renderItem = (item) => {
    return (
      <div className="camera__detail">
        <div className="camera__header">
          <h4>{item?.name}</h4>
          <Space>
            <Tooltip placement="top" title={t("view.common_device.detail")}>
              <InfoCircleOutlined
                style={{ fontSize: "16px", color: "#6E6B7B" }}
                onClick={() => {
                  setSelectedCameraId(item.uuid);
                }}
              />
            </Tooltip>
            {/* {permissionCheck('edit_camera') && ( */}
            <Tooltip placement="top" title={t("view.common_device.edit")}>
              <EditOutlined
                style={{ fontSize: "16px", color: "#6E6B7B" }}
                onClick={() => {
                  setSelectedCameraIdEdit(item.uuid);
                  showModalEdit();
                  // handleSearch(search);
                }}
              />
            </Tooltip>
            {/* )} */}
            {/* {permissionCheck('delete_camera') && ( */}
            <Tooltip placement="top" title={t("delete")}>
              <Popconfirm
                cancelText={t("view.user.detail_list.cancel")}
                okText={t("view.user.detail_list.confirm")}
                title={t("noti.delete_camera", {
                  this: t("this"),
                  cam: t("camera"),
                })}
                onConfirm={() => handleDelete(item.uuid)}
              >
                <DeleteOutlined
                  style={{ fontSize: "16px", color: "#6E6B7B" }}
                />
              </Popconfirm>
            </Tooltip>
            {/* )} */}
          </Space>
        </div>

        <div className="camera__infor">
          <ul className="camera__infor--fisrt">
            <li>
              <>
                {item?.cameraTypeName && <Tag>{item?.cameraTypeName}</Tag>}
                {item?.vendorName && <Tag>{item?.vendorName}</Tag>}
              </>
            </li>
            <li className="camera--active">
              {renderTag(item?.recordingStatus)}
            </li>
          </ul>
          <ul className="camera__infor--second">
            <li className="camera--cameraUrl">{item?.cameraUrl}</li>
            <li className="camera--long-lat">
              {item?.lat_} / {item?.long_}{" "}
            </li>
          </ul>
          <ul className="camera__infor--third">
            <li className="camera--IP">{item?.ip}</li>
            <li className="camera--zoneName">{item?.zoneName}</li>
          </ul>
          <ul className="camera__infor--forth">
            <li className="camera--resolution">1080</li>
            <li className="camera--address">
              {item?.address}/{item?.wardName}-{item?.districtName}-
              {item?.provinceName}
            </li>
          </ul>
        </div>
      </div>
    );
  };
  const handleBlur = (event) => {
    const value = event.target.value.trim();

    form.setFieldsValue({
      searchForm: value,
    });

    setSearch(value);
  };

  const onShowSizeChange = (current, pageSize) => {
    setPage(current);
    setSize(pageSize);
  };

  return (
    <>
      <div className="search-filter table--camera__container">
        <Select
          className="selected__user--by"
          placeholder="Tìm theo"
          showSearch
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          onChange={(value) => onChangeTypeFilter(value)}
          defaultValue={unit || UNIT.ALL}
        >
          <Option value={UNIT.ALL}>{t("view.user.detail_list.all")}</Option>
          <Option value={UNIT.CAMERA_NAME}>
            {t("view.camera.camera_name", { cam: t("camera") })}
          </Option>
          <Option value={UNIT.CAMERA_CODE}>
            {t("view.camera.camera_code", { cam: t("camera") })}
          </Option>
          <Option value={UNIT.CAMERA_TYPE}>
            {t("view.camera.camera_type", { cam: t("camera") })}
          </Option>
          <Option value={UNIT.VENDOR}>{t("view.map.vendor")}</Option>
          <Option value={UNIT.PORT}>{t("view.map.port")}</Option>
          <Option value={UNIT.ZONE}>{t("view.map.zone")}</Option>
          <Option value={UNIT.IP}>Ip</Option>
          <Option value={UNIT.URL}>{t("view.map.original_url")}</Option>
          <Option value={UNIT.UNIT_AD}>
            {t("view.map.administrative_unit_uuid")}
          </Option>
          <Option value={UNIT.ADDRESS}>{t("view.map.location")}</Option>
        </Select>

        <Form className="searchData" form={form}>
          <Form.Item name={["searchForm"]}>
            <AutoComplete
              onSearch={debounce(handleSearch, 1000)}
              value={search}
              onBlur={handleBlur}
              maxLength={255}
              placeholder={
                <div className="placeholder">
                  <span style={{ opacity: "0.5" }}>
                    {" "}
                    &nbsp;{" "}
                    {`${t("view.user.detail_list.please_enter_search_keyword", {
                      plsEnter: t("please_enter"),
                    })}`}{" "}
                  </span>{" "}
                  <SearchOutlined style={{ fontSize: 22 }} />
                </div>
              }
            />
          </Form.Item>
        </Form>

        <Button
          className="filter-advance"
          type="primary"
          onClick={showModal}
          style={{ marginTop: 5, marginBottom: 5 }}
        >
          <FilterOutlined />
        </Button>
      </div>

      <Modal
        title={t("view.camera.advanced_filter")}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        className="modal--add-camera modal__filter-advance"
        maskStyle={{ background: "rgba(51, 51, 51, 0.9)" }}
      >
        <Form form={form} {...formItemLayout} onFinish={handleSubmit}>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                name={["provinceId"]}
                label={t("view.map.province_id")}
                // rules={[{ required: true, message: 'Trường này bắt buộc' }]}
              >
                <Select
                  allowClear
                  showSearch
                  dataSource={provinces}
                  onChange={(cityId) => onChangeCity(cityId)}
                  filterOption={filterOption}
                  options={normalizeOptions("name", "provinceId", provinces)}
                  placeholder={t("view.map.province_id")}
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name={["districtId"]}
                // rules={[{ required: true, message: 'Trường này bắt buộc' }]}
                label={t("view.map.district_id")}
              >
                <Select
                  allowClear
                  showSearch
                  dataSource={districts}
                  onChange={(districtId) => onChangeDistrict(districtId)}
                  filterOption={filterOption}
                  options={normalizeOptions("name", "districtId", districts)}
                  placeholder={t("view.map.district_id")}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name={["wardId"]}
                // rules={[{ required: true, message: 'Trường này bắt buộc' }]}
                label={t("view.map.ward_id")}
              >
                <Select
                  allowClear
                  showSearch
                  dataSource={wards}
                  filterOption={filterOption}
                  options={normalizeOptions("name", "id", wards)}
                  placeholder={t("view.map.ward_id")}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={t("view.map.location")}
                name={["address"]}
                // rules={[{ required: true, message: 'Trường này bắt buộc' }]}
              >
                <Input
                  placeholder={t("view.map.please_choose_location")}
                  maxLength={255}
                  onBlur={(e) => {
                    form.setFieldsValue({
                      address: e.target.value.trim(),
                    });
                  }}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name={["administrativeUnitUuid"]}
                label={t("view.map.administrative_unit")}
              >
                <Select
                  allowClear
                  showSearch
                  dataSource={adDivisions}
                  filterOption={filterOption}
                  options={normalizeOptions("name", "uuid", adDivisions)}
                  placeholder={t("view.map.please_choose_administrative_unit")}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name={["vendorUuid"]} label={t("view.map.vendor")}>
                <Select
                  allowClear
                  showSearch
                  dataSource={vendors}
                  filterOption={filterOption}
                  options={normalizeOptions("name", "uuid", vendors)}
                  placeholder={t("view.map.choose_vendor")}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="recordingStatus"
                label={t("view.user.detail_list.user_status")}
              >
                <Select
                  showSearch
                  allowClear
                  placeholder={t("view.user.detail_list.user_status")}
                  // style={{ width: 200 }}
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Option value={STATUS.SUCCESS}>
                    {t("view.camera.active")}
                  </Option>
                  <Option value={STATUS.ERRORS}>
                    {t("view.camera.inactive")}
                  </Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <div className="btn--submit">
            <Button type="primary" htmlType="submit">
              {t("view.user.detail_list.confirm")}
            </Button>
          </div>
        </Form>
      </Modal>

      <List
        className="listCamera"
        header={renderHeader()}
        bordered
        dataSource={listCamera}
        renderItem={(item) => {
          return <List.Item>{renderItem(item)}</List.Item>;
        }}
        locale={{
          emptyText: (
            <div style={{ color: "white" }}>
              {t("view.user.detail_list.no_valid_results_found")}
            </div>
          ),
        }}
        pagination={{
          showSizeChanger: true,
          onShowSizeChange: (current, size) => {
            onShowSizeChange(current, size);
          },

          hideOnSinglePage: false,
          current: page,
          total: total,
          pageSize: size,
          onChange: (value) => {
            setPage(value);
          },
          showTotal: (total, range) => {
            return (
              <ShowTotal className="show--total">
                {t("view.user.detail_list.viewing")} {range[0]}{" "}
                {t("view.user.detail_list.to")} {range[1]}{" "}
                {t("view.user.detail_list.out_of")} {total}{" "}
                {t("view.user.detail_list.indexes")}
              </ShowTotal>
            );
          },
        }}
      />

      {selectedCameraId && (
        <ModalViewDetail
          selectedCameraId={selectedCameraId}
          handleShowModal={handleShowModalInfo}
        />
      )}

      {selectedCameraIdEdit && (
        <ModalEditCamera
          selectedCameraIdEdit={selectedCameraIdEdit}
          handleShowModalEdit={handleShowModalEdit}
        />
      )}

      {selectedAdd && (
        <ModalAddCamera
          selectedAdd={selectedAdd}
          handleShowModalAdd={handleShowModalAdd}
        />
      )}
      {selectedScan && (
        <ModalAddCamera
          selectedScan={selectedScan}
          handleShowModalScan={handleShowModalScan}
        />
      )}
      {loading ? <Loading /> : null}
    </>
  );
};

async function fetchSelectOptions() {
  const data = {
    name: "",
    id: "",
    provinceId: "",
    districtId: "",
  };

  let provinces = await AddressApi.getAllProvinces();

  if (isEmpty(provinces)) {
    provinces = DATA_FAKE_CAMERA.provinces;
  }

  let adDivisions = await AdDivisionApi.getAllAdDivision(data);

  if (isEmpty(adDivisions)) {
    adDivisions = DATA_FAKE_CAMERA.adDivisions;
  }
  let vendors = await VendorApi.getAllVendor(data);

  if (isEmpty(vendors)) {
    vendors = DATA_FAKE_CAMERA.vendors;
  }

  return {
    provinces,
    adDivisions,
    vendors,
  };
}

export default withRouter(TableCamera);
