import { SearchOutlined } from "@ant-design/icons";
import { AutoComplete, Button, Form, Select, Space, Table } from "antd";
import { isEmpty } from "lodash-es";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AddressApi from "../../actions/api/address/AddressApi";
import AdDivisionApi from "../../actions/api/advision/AdDivision";
import CameraApi from "../../actions/api/camera/CameraApi";
import VendorApi from "../../actions/api/vendor/VendorApi";
import Notification from "../../components/vms/notification/Notification";
import { filterOption, normalizeOptions } from "../common/select/CustomSelect";
import { renderText } from "../user/dataListUser/components/TableListUser";
import { DATA_FAKE_CAMERA } from "./ModalAddCamera";
import "./TableAddCamInCamGroup.scss";

const formItemLayout = {
  wrapperCol: { span: 24 },
  labelCol: { span: 24 },
};

export default function TableAddCamInCamGroup(props) {
  const { t } = useTranslation();
  const { camGroupUuid, handleAdddCamera } = props;

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [listCamera, setListCamera] = useState([]);

  const [provinceId, setProvinceId] = useState("");
  const [search, setSearch] = useState("");
  const [districts, setDistrict] = useState([]);
  const [districtId, setDistrictId] = useState("");
  const [wards, setWard] = useState([]);
  const [form] = Form.useForm();
  const [name, setName] = useState("");
  const [id, setId] = useState("");

  const [administrativeUnitUuid, setAdministrativeUnitUuid] = useState("");

  const [filterOptions, setFilterOptions] = useState(DATA_FAKE_CAMERA);

  useEffect(() => {
    let data = {
      name: "",
      provinceId: "",
      districtId: "",
      id: "",
      administrativeUnitUuid: "",
      vendorUuid: "",
      status: "",
      page: 1,
      size: 100000,
    };
    CameraApi.getAllCamera(data).then((result) => {
      let selectedId = props?.camInGroupKey;

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

  const { provinces, adDivisions } = filterOptions;

  const onChangeCity = async (cityId) => {
    setProvinceId(cityId);

    await resetDistrictAndWardData();

    let data = {
      name: name,
      provinceId: cityId,
      districtId: "",
      id: "",
      administrativeUnitUuid: administrativeUnitUuid,
      page: 1,
      size: 100000,
    };
    CameraApi.getAllCamera(data).then((result) => {
      let selectedId = props?.camInGroupKey;

      const data = result.filter((r) => !selectedId.includes(r.uuid));
      setListCamera(data);
    });
  };

  function resetDistrictAndWardData() {
    form.setFieldsValue({ districtId: null, wardId: null });
  }

  const onChangeDistrict = async (districtId) => {
    setDistrictId(districtId);
    await resetWardData();
    const data = {
      provinceId: provinceId,
      districtId: districtId,
      id: "",
      name: name,
      administrativeUnitUuid: administrativeUnitUuid,
      page: 1,
      size: 100000,
    };
    CameraApi.getAllCamera(data).then((result) => {
      let selectedId = props?.camInGroupKey;
      const data = result.filter((r) => !selectedId.includes(r.uuid));
      setListCamera(data);
    });
  };

  const onChangeWard = async (id) => {
    setId(id);
    const data = {
      provinceId: provinceId,
      districtId: districtId,
      id: id,
      name: name,
      administrativeUnitUuid: administrativeUnitUuid,
      page: 1,
      size: 100000,
    };
    CameraApi.getAllCamera(data).then((result) => {
      let selectedId = props?.camInGroupKey;

      const data = result.filter((r) => !selectedId.includes(r.uuid));
      setListCamera(data);
    });
  };

  const onChangeUnit = async (id) => {
    setAdministrativeUnitUuid(id);
    const data = {
      provinceId: provinceId,
      districtId: districtId,
      id: id,
      name: name,
      administrativeUnitUuid: administrativeUnitUuid,
      page: 1,
      size: 100000,
    };
    CameraApi.getAllCamera(data).then((result) => {
      let selectedId = props?.camInGroupKey;

      const data = result.filter((r) => !selectedId.includes(r.uuid));
      setListCamera(data);
    });
  };

  function resetWardData() {
    form.setFieldsValue({ wardId: null });
  }

  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys([
      ...new Set(props?.camInGroupKey.concat(selectedRowKeys)),
    ]);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleSearch = async (value) => {
    setSearch(value);
    setName(value);
    let data = {
      name: value,
      provinceId: provinceId,
      districtId: districtId,
      id: id,
      administrativeUnitUuid: administrativeUnitUuid,
      page: 1,
      size: 100000,
    };
    CameraApi.getAllCamera(data).then((result) => {
      let selectedId = props?.camInGroupKey;

      const data = result.filter((r) => !selectedId.includes(r.uuid));
      setListCamera(data);
    });
  };

  const handleSubmit = async () => {
    const payload = {
      cameraUuidList: selectedRowKeys,
    };

    const isUpdate = await CameraApi.updateCameraGroup(camGroupUuid, payload);

    if (isUpdate) {
      const notifyMess = {
        type: "success",
        title: "",
        description: `${t("noti.successfully_add_camera_to_group")}`,
      };
      Notification(notifyMess);
      handleAdddCamera(false);
    }
  };

  const handleCancel = async () => {
    handleAdddCamera(false);
  };

  const columns = [
    // {
    //   title: `${t('view.category.no')}`,
    //   fixed: 'left',
    //   key: 'index',
    //   className: 'headerUserColums',
    //   width: '7%',
    //   render: (text, record, index) => index + 1
    // },
    {
      title: "Camera",
      dataIndex: "name",
      className: "headerUserColums",
      width: "40%",
      render: renderText,
    },
    {
      title: `${t("view.map.location")}`,
      dataIndex: "address",
      className: "headerUserColums",
      width: "20%",
      render: renderText,
    },
    {
      title: `${t("view.map.administrative_unit")}`,
      dataIndex: "administrativeUnitName",
      className: "headerUserColums",
      width: "40%",
      render: renderText,
    },
  ];

  // const handleSearch = async (value) => {};

  const handleBlur = (event) => {
    const value = event.target.value.trim();

    setSearch(value);
  };

  const handlePaste = (event) => {
    const value = event.target.value.trimStart();

    setSearch(value);
  };

  const renderHeader = () => {
    return (
      <>
        <div
          className="d-flex"
          style={{
            justifyContent: "space-between",
            padding: "8px 16px",
            alignItem: "center",
          }}
        >
          <h4 className="font-weight-700">
            {t("view.camera.add_cam_in_group")}
          </h4>
          <div
            className="submit d-flex"
            style={{ justifyContent: "space-between", alignItem: "center" }}
          >
            <Space>
              <Button
                type="primary"
                onClick={handleSubmit}
                disabled={selectedRowKeys?.length > 0 ? false : true}
                className={selectedRowKeys?.length > 0 ? "" : "btn-disabled"}
              >
                {t("view.user.detail_list.confirm")}
              </Button>
              <Button type="primary" onClick={handleCancel}>
                {t("view.camera.close")}
              </Button>
            </Space>
          </div>
        </div>
        <div className="d-flex justify-content-between">
          <AutoComplete
            className="searchData full-width height-40"
            onSearch={handleSearch}
            value={search}
            onBlur={handleBlur}
            onPaste={handlePaste}
            maxLength={255}
            placeholder={
              <div className="placehoder height-40 justify-content-between d-flex align-items-center">
                <span> &nbsp; {t("view.map.search")} </span>{" "}
                <SearchOutlined style={{ fontSize: 22 }} />
              </div>
            }
          />
        </div>
        <Form className="filter__search" form={form} {...formItemLayout}>
          <div className="address__choose div__1">
            <Form.Item name={["provinceId"]}>
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

            <Form.Item name={["districtId"]}>
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

            <Form.Item name={["wardId"]}>
              <Select
                allowClear
                showSearch
                dataSource={wards}
                onChange={(id) => onChangeWard(id)}
                filterOption={filterOption}
                options={normalizeOptions("name", "id", wards)}
                placeholder={t("view.map.ward_id")}
              />
            </Form.Item>
          </div>
          <div className="div__2">
            <Form.Item name={["administrativeUnitUuid"]}>
              <Select
                allowClear
                onChange={(id) => onChangeUnit(id)}
                dataSource={adDivisions}
                filterOption={filterOption}
                options={normalizeOptions("name", "uuid", adDivisions)}
                placeholder={t("view.map.please_choose_administrative_unit")}
              />
            </Form.Item>
          </div>
        </Form>
      </>
    );
  };

  return (
    <div>
      {isEmpty(camGroupUuid) ? null : (
        <div>
          <Table
            className="table__list--camera-add"
            rowKey="uuid"
            columns={columns}
            // scroll={{ y: 1000 }}
            dataSource={listCamera}
            title={renderHeader}
            rowSelection={rowSelection}
            pagination={{
              pageSize: 5,
            }}
            locale={{
              emptyText: `${t("view.user.detail_list.no_valid_results_found")}`,
            }}
          />
        </div>
      )}
    </div>
  );
}

async function fetchSelectOptions() {
  const data = {
    name: "",
    id: "",
    provinceId: "",
    districtId: "",
  };

  const provinces = await AddressApi.getAllProvinces();

  const adDivisions = await AdDivisionApi.getAllAdDivision(data);
  const vendors = await VendorApi.getAllVendor(data);

  return {
    provinces,
    adDivisions,
    vendors,
  };
}
