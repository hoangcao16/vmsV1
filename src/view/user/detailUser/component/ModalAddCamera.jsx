import { SearchOutlined } from "@ant-design/icons";
import { AutoComplete, Col, Form, Modal, Row, Select, Table, Tag } from "antd";
import { debounce, isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AddressApi from "../../../../actions/api/address/AddressApi";
import AdDivisionApi from "../../../../actions/api/advision/AdDivision";
import CameraApi from "../../../../actions/api/camera/CameraApi";
import VendorApi from "../../../../actions/api/vendor/VendorApi";
import { DATA_FAKE_CAMERA } from "../../../camera/ModalAddCamera";
import {
  filterOption,
  normalizeOptions,
} from "../../../common/select/CustomSelect";
import "./ModalAddCamera.scss";
import { renderText } from "../../../user/dataListUser/components/TableListUser";

const { Option } = Select;

const STATUS = {
  SUCCESS: 1,
  ERRORS: 0,
};

const ModalAddCamera = (props) => {
  const { t } = useTranslation();
  const { handleShowModalAdd, selectedAdd } = props;
  const [isModalVisible, setIsModalVisible] = useState(selectedAdd);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [listCamera, setListCamera] = useState([]);
  const selectedCameraIdEdit = null;
  const [provinceId, setProvinceId] = useState("");
  const [search, setSearch] = useState("");
  const [districts, setDistrict] = useState([]);
  const [districtId, setDistrictId] = useState("");
  const [wards, setWard] = useState([]);
  const [form] = Form.useForm();
  const [name, setName] = useState("");
  const [wardId, setWardId] = useState("");

  const [administrativeUnitUuid, setAdministrativeUnitUuid] = useState("");
  const [vendorUuid, setVendorUuid] = useState("");
  const [recordingStatus, setRecordingStatus] = useState("");

  const [filterOptions, setFilterOptions] = useState(DATA_FAKE_CAMERA);

  const formItemLayout = {
    wrapperCol: { span: 24 },
    labelCol: { span: 24 },
  };

  useEffect(() => {
    let data = {
      name: "",
      provinceId: "",
      districtId: "",
      wardId: "",
      administrativeUnitUuid: "",
      vendorUuid: "",
      recordingStatus: "",
      page: 1,
      size: 1000000,
    };

    CameraApi.getAllCamera(data).then((result) => {
      let selectedId = props?.checkedGroups;

      const data = result.filter((r) => !selectedId.includes(r.uuid));

      setListCamera(data);
    });
  }, [selectedCameraIdEdit]);

  useEffect(() => {
    let data = {
      name: "",
      provinceId: "",
      districtId: "",
      wardId: "",
      administrativeUnitUuid: "",
      vendorUuid: "",
      recordingStatus: "",
      page: 1,
      size: 1000000,
    };
    CameraApi.getAllCamera(data).then((result) => {
      let selectedId = props?.checkedGroups;

      const data = result.filter((r) => !selectedId.includes(r.uuid));

      setListCamera(data);
    });
  }, []);

  useEffect(() => {
    fetchSelectOptions().then(setFilterOptions);
  }, []);

  useEffect(() => {
    if (provinceId) {
      AddressApi.getDistrictByProvinceId(provinceId).then(setDistrict);
      setWard([]);
      setDistrictId(null);
    }
  }, [provinceId]);

  useEffect(() => {
    if (districtId) {
      AddressApi.getWardByDistrictId(districtId).then(setWard);
    } else {
      setWard([]);
    }
  }, [districtId]);

  const { provinces, adDivisions, vendors } = filterOptions;

  const onChangeCity = async (cityId) => {
    setProvinceId(cityId);
    setDistrictId(null);
    setWardId(null);
    await resetDistrictAndWardData();

    let data = {
      name: name,
      provinceId: cityId,
      districtId: "",
      wardId: "",
      administrativeUnitUuid: administrativeUnitUuid,
      vendorUuid: vendorUuid,
      recordingStatus: recordingStatus,
      page: 1,
      size: 1000000,
    };
    CameraApi.getAllCamera(data).then((result) => {
      let selectedId = props?.checkedGroups;

      const data = result.filter((r) => !selectedId.includes(r.uuid));

      setListCamera(data);
    });
  };

  function resetDistrictAndWardData() {
    form.setFieldsValue({ districtId: null, wardId: null });
  }

  const onChangeDistrict = async (districtId) => {
    setDistrictId(districtId);
    setWardId(null);
    await resetWardData();
    const data = {
      provinceId: provinceId,
      districtId: districtId,
      wardId: "",
      name: name,
      administrativeUnitUuid: administrativeUnitUuid,
      vendorUuid: vendorUuid,
      recordingStatus: recordingStatus,
      page: 1,
      size: 1000000,
    };
    CameraApi.getAllCamera(data).then((result) => {
      let selectedId = props?.checkedGroups;

      const data = result.filter((r) => !selectedId.includes(r.uuid));

      setListCamera(data);
    });
  };

  const onChangeWard = async (wardId) => {
    setWardId(wardId);
    const data = {
      provinceId: provinceId,
      districtId: districtId,
      wardId: wardId,
      name: name,
      administrativeUnitUuid: administrativeUnitUuid,
      vendorUuid: vendorUuid,
      recordingStatus: recordingStatus,
      page: 1,
      size: 1000000,
    };
    CameraApi.getAllCamera(data).then((result) => {
      let selectedId = props?.checkedGroups;

      const data = result.filter((r) => !selectedId.includes(r.uuid));

      setListCamera(data);
    });
  };

  const onChangeUnit = async (id) => {
    setAdministrativeUnitUuid(id);
    const data = {
      provinceId: provinceId,
      districtId: districtId,
      wardId: wardId,
      name: name,
      administrativeUnitUuid: id,
      vendorUuid: vendorUuid,
      recordingStatus: recordingStatus,
      page: 1,
      size: 1000000,
    };
    CameraApi.getAllCamera(data).then((result) => {
      let selectedId = props?.checkedGroups;

      const data = result.filter((r) => !selectedId.includes(r.uuid));

      setListCamera(data);
    });
  };

  const onChangeVendor = async (vendorUuid) => {
    setVendorUuid(vendorUuid);
    const data = {
      provinceId: provinceId,
      districtId: districtId,
      wardId,
      name: name,
      administrativeUnitUuid: administrativeUnitUuid,
      vendorUuid: vendorUuid,
      recordingStatus: recordingStatus,
      page: 1,
      size: 1000000,
    };

    CameraApi.getAllCamera(data).then((result) => {
      let selectedId = props?.checkedGroups;

      const data = result.filter((r) => !selectedId.includes(r.uuid));

      setListCamera(data);
    });
  };
  const onChangeStatus = async (recordingStatus) => {
    setRecordingStatus(recordingStatus);
    const data = {
      provinceId: provinceId,
      districtId: districtId,
      wardId,
      name: name,
      administrativeUnitUuid: administrativeUnitUuid,
      vendorUuid: vendorUuid,
      recordingStatus: recordingStatus,
      page: 1,
      size: 1000000,
    };
    CameraApi.getAllCamera(data).then((result) => {
      let selectedId = props?.checkedGroups;

      const data = result.filter((r) => !selectedId.includes(r.uuid));

      setListCamera(data);
    });
  };

  function resetWardData() {
    form.setFieldsValue({ wardId: null });
  }

  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  // const hasSelected = selectedRowKeys.length - props.checkedGroups.length > 0;
  const handleSearch = async (value) => {
    setSearch(value);
    setName(value);
    let data = {
      name: value,
      provinceId: provinceId,
      districtId: districtId,
      wardId: wardId,
      administrativeUnitUuid: administrativeUnitUuid,
      vendorUuid: vendorUuid,
      recordingStatus: recordingStatus,
      page: 1,
      size: 1000000,
    };
    CameraApi.getAllCamera(data).then((result) => {
      let selectedId = props?.checkedGroups;

      const data = result.filter((r) => !selectedId.includes(r.uuid));

      setListCamera(data);
    });
  };

  const statusTag = (cellValue, row) => {
    if (cellValue !== 0) {
      return (
        <Tag
          style={{
            borderRadius: "6px",
            backgroundColor: "rgba(40, 199, 111, 0.2)",
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
          backgroundColor: "rgba(234, 84, 85, 0.2)",
        }}
        color="error"
      >
        {t("view.camera.inactive")}
      </Tag>
    );
  };

  const handleSubmit = async () => {
    const data = selectedRowKeys.map((s) => {
      return {
        subject: `user@${props.id}`,
        object: `cam@${s}`,
        action: "view_online",
      };
    });

    const dataAdd = {
      policies: data,
    };

    await CameraApi.addMultilPermission(dataAdd);

    setIsModalVisible(false);
    handleShowModalAdd([
      ...new Set(props?.checkedGroups.concat(selectedRowKeys)),
    ]);
  };

  const handleCancel = async () => {
    setIsModalVisible(false);
    handleShowModalAdd();
  };
  const handleBlur = (event) => {
    const value = event.target.value.trim();
    setSearch(value);
  };

  const renderHeader = () => {
    return (
      <>
        <div className="d-flex justify-content-between">
          <AutoComplete
            className=" full-width height-40"
            onSearch={debounce(handleSearch, 1000)}
            onBlur={handleBlur}
            maxLength={255}
            placeholder={
              <div className="placehoder height-40 justify-content-between d-flex align-items-center">
                <span style={{ opacity: "0.5" }}>
                  {" "}
                  &nbsp;{" "}
                  {t("view.user.detail_list.please_enter_search_keyword", {
                    plsEnter: t("please_enter"),
                  })}{" "}
                </span>{" "}
                <SearchOutlined style={{ fontSize: 22 }} />
              </div>
            }
          />
        </div>
        <Form
          className="mt-2 bg-grey"
          form={form}
          {...formItemLayout}
          style={{ width: "100%", paddingBottom: "30px" }}
        >
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item
                name={["provinceId"]}
                label={t("view.map.province_id")}
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

            <Col span={6}>
              <Form.Item
                name={["districtId"]}
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

            <Col span={6}>
              <Form.Item name={["wardId"]} label={t("view.map.ward_id")}>
                <Select
                  allowClear
                  showSearch
                  dataSource={wards}
                  onChange={(wardId) => onChangeWard(wardId)}
                  filterOption={filterOption}
                  options={normalizeOptions("name", "id", wards)}
                  placeholder={t("view.map.ward_id")}
                />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                name="recordingStatus"
                label={t("view.common_device.status")}
              >
                <Select
                  showSearch
                  allowClear
                  onChange={(recordingStatus) =>
                    onChangeStatus(recordingStatus)
                  }
                  placeholder={t("view.common_device.status")}
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
          <Row gutter={24} style={{ marginTop: 10 }}>
            <Col span={12}>
              <Form.Item
                name={["administrativeUnitUuid"]}
                label={t("view.map.administrative_unit")}
              >
                <Select
                  allowClear
                  showSearch
                  onChange={(id) => onChangeUnit(id)}
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
                  onChange={(id) => onChangeVendor(id)}
                  showSearch
                  dataSource={vendors}
                  filterOption={filterOption}
                  options={normalizeOptions("name", "uuid", vendors)}
                  placeholder={t("view.map.please_enter_vendor_name", {
                    plsEnter: t("please_enter"),
                  })}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>

        {/* <div
          style={{
            marginRight: 20,
            marginBottom: 20,
            color: '#ffffff',
            height: '30px'
          }}
        >
          {hasSelected
            ? `${t('view.storage.choose')} ${selectedRowKeys.length - props.checkedGroups.length
            } ${t('view.storage.record')}`
            : ''}
        </div> */}
      </>
    );
  };

  const columns = [
    {
      title: `${t("view.storage.NO")}`,
      fixed: "left",
      key: "index",
      className: "headerUserColums",
      width: "5%",
      render: (text, record, index) => index + 1,
    },

    {
      title: `${t("view.map.camera_name", { cam: t("camera") })}`,
      dataIndex: "name",
      key: "name",
      fixed: "left",
      className: "headerUserColums",
      ellipsis: true,
    },
    {
      title: `${t("view.user.detail_list.image")}`,
      dataIndex: "name",
      key: "name",
      className: "headerUserColums",
      ellipsis: true,
    },
    {
      title: `${t("view.camera.camera_type", { cam: t("camera") })}`,
      dataIndex: "code",
      key: "code",
      className: "headerUserColums",
    },
    {
      title: `${t("view.map.province_id")}`,
      dataIndex: "provinceName",
      key: "provinceName",
      className: "headerUserColums",
    },
    {
      title: `${t("view.map.district_id")}`,
      dataIndex: "districtName",
      key: "provinceName",
      className: "headerUserColums",
    },
    {
      title: "Phường xã",
      dataIndex: "wardName",
      key: "wardName",
      className: "headerUserColums",
    },
    {
      title: `${t("view.map.location")}`,
      dataIndex: "address",
      key: "address",
      className: "headerUserColums",
      render: renderText,
    },
    {
      title: `${t("view.common_device.status")}`,
      dataIndex: "recordingStatus",
      key: "recordingStatus",
      className: "headerUserColums",
      render: statusTag,
    },

    {
      title: `${t("view.map.administrative_unit")}`,
      dataIndex: "administrativeUnitName",
      className: "headerUserColums",
      key: "administrativeUnitName",
    },
  ];

  return (
    <>
      <Modal
        title={t("view.user.detail_list.add_camera_to_user")}
        className="modal__add-camera--in-detail-user"
        visible={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        style={{ top: 30, height: 790, borderRadius: 10 }}
        width={1000}
        okText={t("view.map.button_save")}
        cancelText={t("view.map.button_cancel")}
        maskStyle={{ background: "rgba(51, 51, 51, 0.9)" }}
      >
        <Table
          className="tableAddCamera"
          rowKey="uuid"
          columns={columns}
          dataSource={listCamera}
          title={renderHeader}
          // pagination={{
          //   position: ['bottomCenter']
          // }}
          scroll={{ x: 2000 }}
          rowSelection={rowSelection}
          rowClassName={(includes) =>
            props?.checkedGroups.includes(includes?.uuid) ? "disabled-row" : ""
          }
          locale={{
            emptyText: `${t("view.user.detail_list.no_valid_results_found")}`,
          }}
        />
      </Modal>
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

export default ModalAddCamera;
