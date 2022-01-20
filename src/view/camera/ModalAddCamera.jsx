import { LoadingOutlined, PlusOutlined, UserOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Upload,
} from "antd";
import "antd/dist/antd.css";
import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { v4 as uuidV4 } from "uuid";
import AddressApi from "../../actions/api/address/AddressApi";
import AdDivisionApi from "../../actions/api/advision/AdDivision";
import CameraApi from "../../actions/api/camera/CameraApi";
import VendorApi from "../../actions/api/vendor/VendorApi";
import ZoneApi from "../../actions/api/zone/ZoneApi";
import clearData from "../../actions/function/MyUltil/CheckData";
import Notification from "../../components/vms/notification/Notification";
import { filterOption, normalizeOptions } from "../common/select/CustomSelect";
import ExportEventFileApi from "./../../actions/api/exporteventfile/ExportEventFileApi";
import "./../commonStyle/commonForm.scss";
import "./../commonStyle/commonInput.scss";
import "./../commonStyle/commonModal.scss";
import "./../commonStyle/commonSelect.scss";
import "./ModalAddCamera.scss";
import ModalAddEditTagBindCam from "./ModalAddEditTagBindCam";
import { compareName } from "./ModalEditCamera";
import "./UploadFile.scss";

export const DATA_FAKE_CAMERA = {
  provinces: [{ name: "", provinceId: "" }],
  cameraTypes: [{ name: "", uuid: "" }],
  zones: [{ name: "", uuid: "" }],
  adDivisions: [{ name: "", uuid: "" }],
  vendors: [{ name: "", uuid: "" }],
  tags: [],
};

const formItemLayout = {
  wrapperCol: { span: 24 },
  labelCol: { span: 24 },
};

const ModalAddCamera = (props) => {
  const { t } = useTranslation();
  const { handleShowModalAdd, selectedAdd, data } = props;
  const [showModalTag, setShowModalTag] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(selectedAdd);
  const [filterOptions, setFilterOptions] = useState(DATA_FAKE_CAMERA);
  const [provinceId, setProvinceId] = useState(null);
  const [districts, setDistrict] = useState([]);
  const [districtId, setDistrictId] = useState(null);
  const [wards, setWard] = useState([]);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [avatarFileName, setAvatarFileName] = useState("");
  const [form] = Form.useForm();

  useEffect(() => {
    fetchSelectOptions().then(setFilterOptions);
  }, []);
  useEffect(() => {
    if (!isEmpty(data)) {
      form.setFieldsValue({
        cameraUrl: data?.rtspUrl,
        ip: data?.ip,
      });
    }
  }, []);

  useEffect(() => {
    setDistrict([]);

    if (!provinceId) {
      return;
    }
    AddressApi.getDistrictByProvinceId(provinceId).then(setDistrict);
  }, [provinceId]);

  useEffect(() => {
    setWard([]);

    if (!districtId) {
      return;
    }
    AddressApi.getWardByDistrictId(districtId).then(setWard);
  }, [districtId]);

  const { provinces, zones, vendors, cameraTypes, adDivisions } = filterOptions;

  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  const uploadButton = (
    <div>
      {isLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>{t("view.map.add_image")}</div>
    </div>
  );

  function beforeUpload(file) {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      const notifyMess = {
        type: "error",
        title: "",
        description: `${t("noti.upload_file_desc")}`,
      };
      Notification(notifyMess);
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      const notifyMess = {
        type: "error",
        title: "",
        description: `${t("noti.size_file_desc")}`,
      };
      Notification(notifyMess);
    }
    return isJpgOrPng && isLt2M;
  }

  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
    }
  };

  const uploadImage = async (options) => {
    const { file } = options;
    await ExportEventFileApi.uploadAvatar(uuidV4(), file).then((result) => {
      if (
        result.data &&
        result.data.payload &&
        result.data.payload.fileUploadInfoList.length > 0
      ) {
        getBase64(file, (imageUrl) => {
          setLoading(false);
          setAvatarUrl(imageUrl);
          let fileName = result.data.payload.fileUploadInfoList[0].name;

          // handleSubmit({ avatar_file_name: fileName });
          setAvatarFileName(fileName);

          //phần này set vào state để push lên
        });
      }
    });
  };

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

  // if (
  //   isEmpty(provinces) ||
  //   isEmpty(zones) ||
  //   isEmpty(vendors) ||
  //   isEmpty(cameraTypes) ||
  //   isEmpty(adDivisions)
  // ) {
  //   return <Loading />;
  // }

  const handleSubmit = async (value) => {
    const payload = {
      ...value,
      avatarFileName: avatarFileName,
      lat_: +value?.lat_,
      long_: +value?.long_,
    };
    const clearPayload = clearData(payload);

    const isAdd = await CameraApi.addCamera(clearPayload);

    if (isAdd) {
      const notifyMess = {
        type: "success",
        title: "",
        description: `${t("noti.successfully_add_camera")}`,
      };
      Notification(notifyMess);
      setIsModalVisible(false);
      handleShowModalAdd();
    }
  };

  const showModalEditTag = () => {
    setShowModalTag(true);
  };

  const handleSubmitUpdateTags = (value) => {
    form.setFieldsValue({ tags: value.tags });
    setShowModalTag(false);
  };

  return (
    <>
      <Modal
        title={t("view.maps.add_camera", { add: t("add"), cam: t("camera") })}
        visible={isModalVisible}
        onOk={handleShowModalAdd}
        onCancel={handleShowModalAdd}
        footer={null}
        className="modal--add-camera"
        maskStyle={{ background: "rgba(51, 51, 51, 0.9)" }}
      >
        <Form
          className="bg-grey"
          form={form}
          {...formItemLayout}
          onFinish={handleSubmit}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name={["name"]}
                label={t("view.camera.camera_name", { cam: t("camera") })}
                rules={[
                  {
                    required: true,
                    message: `${t("view.map.required_field")}`,
                  },
                ]}
              >
                <Input
                  maxLength={255}
                  placeholder={t("view.map.please_enter_camera_name", {
                    plsEnter: t("please_enter"),
                    cam: t("camera"),
                  })}
                  onBlur={(e) => {
                    form.setFieldsValue({
                      name: e.target.value.trim(),
                    });
                  }}
                />
              </Form.Item>
              <Form.Item
                name={["code"]}
                label={t("view.map.camera_id", { cam: t("camera") })}
                rules={[
                  {
                    required: true,
                    message: `${t("view.map.required_field")}`,
                  },
                ]}
              >
                <Input
                  maxLength={255}
                  placeholder={t("view.map.please_enter_camera_id", {
                    plsEnter: t("please_enter"),
                    cam: t("camera"),
                  })}
                  onBlur={(e) => {
                    form.setFieldsValue({
                      code: e.target.value.trim(),
                    });
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Upload
                accept=".png,.jpeg,.jpg"
                name="avatar"
                listType="picture-card"
                className="avatar-uploader width-150"
                showUploadList={false}
                beforeUpload={beforeUpload}
                customRequest={uploadImage}
                onChange={handleChange}
              >
                {avatarUrl && avatarUrl !== "" ? (
                  <div className=" d-flex justify-content-center">
                    <Avatar
                      icon={<UserOutlined />}
                      src={avatarUrl}
                      className="avatarUser"
                      size={{
                        xs: 24,
                        sm: 32,
                        md: 40,
                        lg: 64,
                        xl: 80,
                        xxl: 130,
                      }}
                    />
                  </div>
                ) : (
                  uploadButton
                )}
              </Upload>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label={t("view.camera.camera_type", { cam: t("camera") })}
                name={["cameraTypeUuid"]}
                rules={[
                  {
                    required: true,
                    message: `${t("view.map.required_field")}`,
                  },
                ]}
              >
                <Select
                  showSearch
                  dataSource={cameraTypes}
                  filterOption={filterOption}
                  options={normalizeOptions("name", "uuid", cameraTypes)}
                  placeholder={t("view.map.please_choose_camera_type", {
                    cam: t("camera"),
                  })}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={["vendorUuid"]}
                label={t("view.map.vendor")}
                rules={[
                  {
                    required: true,
                    message: `${t("view.map.required_field")}`,
                  },
                ]}
              >
                <Select
                  showSearch
                  dataSource={vendors}
                  filterOption={filterOption}
                  options={normalizeOptions("name", "uuid", vendors)}
                  placeholder={t("view.map.choose_vendor", {
                    plsEnter: t("please_enter"),
                  })}
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name={["provinceId"]}
                label={t("view.map.province_id")}
                rules={[
                  {
                    required: true,
                    message: `${t("view.map.required_field")}`,
                  },
                ]}
              >
                <Select
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
                label={t("view.map.district_id")}
                rules={[
                  {
                    required: true,
                    message: `${t("view.map.required_field")}`,
                  },
                ]}
              >
                <Select
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
                label={t("view.map.ward_id")}
                // rules={[{ required: true, message: `${t('view.map.required_field')}` }]}
              >
                <Select
                  showSearch
                  dataSource={wards}
                  filterOption={filterOption}
                  options={normalizeOptions("name", "id", wards)}
                  placeholder={t("view.map.ward_id")}
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("view.map.location")}
                name={["address"]}
                rules={[
                  {
                    required: true,
                    message: `${t("view.map.required_field")}`,
                  },
                ]}
              >
                <Input
                  placeholder={t("view.map.please_enter_location", {
                    plsEnter: t("please_enter"),
                  })}
                  onBlur={(e) => {
                    form.setFieldsValue({
                      address: e.target.value.trim(),
                    });
                  }}
                  maxLength={255}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("view.map.administrative_unit")}
                name={["administrativeUnitUuid"]}
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
              <Form.Item
                label={t("view.map.longitude")}
                name={["long_"]}
                rules={[
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      const data = getFieldValue(["long_"]);
                      if (data) {
                        if (
                          isFinite(data) &&
                          Math.abs(data) <= 180 &&
                          data[0] !== "." &&
                          data[data.length - 1] !== "."
                        ) {
                          return Promise.resolve();
                        } else {
                          return Promise.reject(`${t("view.map.long_error")}`);
                        }
                      } else {
                        return Promise.resolve(
                          `${t("view.map.required_field")}`
                        );
                      }
                    },
                  }),
                ]}
              >
                <Input
                  placeholder={t("view.map.please_enter_longitude", {
                    plsEnter: t("please_enter"),
                  })}
                  maxLength={255}
                  onBlur={(e) =>
                    form.setFieldsValue({ long_: e.target.value.trim() })
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("view.map.latitude")}
                name={["lat_"]}
                rules={[
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      const data = getFieldValue(["lat_"]);
                      if (data) {
                        if (
                          isFinite(data) &&
                          Math.abs(data) <= 90 &&
                          data[0] !== "." &&
                          data[data.length - 1] !== "."
                        ) {
                          return Promise.resolve();
                        } else {
                          return Promise.reject(`${t("view.map.lat_error")}`);
                        }
                      } else {
                        return Promise.resolve(
                          `${t("view.map.required_field")}`
                        );
                      }
                    },
                  }),
                ]}
              >
                <Input
                  placeholder={t("view.map.please_enter_latitude", {
                    plsEnter: t("please_enter"),
                  })}
                  maxLength={255}
                  onBlur={(e) =>
                    form.setFieldsValue({ lat_: e.target.value.trim() })
                  }
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={t("view.map.port")}
                name={["port"]}
                rules={[
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      const data = getFieldValue(["port"]);
                      if (data) {
                        if (isFinite(data)) {
                          return Promise.resolve();
                        } else {
                          return Promise.reject(`${t("noti.just_number")}`);
                        }
                      } else {
                        return Promise.resolve(
                          `${t("view.map.required_field")}`
                        );
                      }
                    },
                  }),
                ]}
              >
                <Input
                  placeholder={t("view.map.please_enter_port", {
                    plsEnter: t("please_enter"),
                  })}
                  onBlur={(e) => {
                    form.setFieldsValue({
                      port: e.target.value.trim(),
                    });
                  }}
                  maxLength={255}
                ></Input>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("view.map.zone")}
                name={["zoneUuid"]}
                rules={[
                  {
                    required: true,
                    message: `${t("view.map.required_field")}`,
                  },
                ]}
              >
                <Select
                  showSearch
                  dataSource={zones}
                  filterOption={filterOption}
                  options={normalizeOptions("name", "uuid", zones)}
                  placeholder={t("view.map.choose_zone", {
                    plsEnter: t("please_enter"),
                  })}
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="IP"
                name={["ip"]}
                rules={[
                  {
                    required: true,
                    message: `${t("view.map.required_field")}`,
                  },
                ]}
              >
                <Input
                  placeholder={t("view.map.please_enter_ip", {
                    plsEnter: t("please_enter"),
                  })}
                  onBlur={(e) => {
                    form.setFieldsValue({
                      ip: e.target.value.trim(),
                    });
                  }}
                  maxLength={255}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label={t("view.map.original_url")}
                name={["cameraUrl"]}
                rules={[
                  {
                    required: true,
                    message: `${t("view.map.required_field")}`,
                  },
                ]}
              >
                <Input
                  placeholder={t("view.map.please_enter_original_url", {
                    plsEnter: t("please_enter"),
                  })}
                  onBlur={(e) => {
                    form.setFieldsValue({
                      cameraUrl: e.target.value.trim(),
                    });
                  }}
                  maxLength={2000}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label={t("view.map.hls_url")} name={["hlsUrl"]}>
                <Input
                  placeholder={t("view.map.please_enter_hls_url", {
                    plsEnter: t("please_enter"),
                  })}
                  onBlur={(e) => {
                    form.setFieldsValue({
                      hlsUrl: e.target.value.trim(),
                    });
                  }}
                  maxLength={2000}
                />
              </Form.Item>
            </Col>
            <Col span={24} className="mt-1">
              <span className="edit-tag-item" onClick={showModalEditTag}>
                {t("view.camera.add_new_tag")}
              </span>
            </Col>
            <Col span={24}>
              <Form.Item noStyle name={["tags"]}>
                <Input type="hidden" />
              </Form.Item>
            </Col>
          </Row>
          <div className="btn--confirm">
            <Button type="primary" htmlType="submit">
              {t("view.user.detail_list.confirm")}
            </Button>
            <Button onClick={handleShowModalAdd}>
              {t("view.map.button_cancel")}
            </Button>
          </div>
        </Form>
      </Modal>
      {showModalTag && (
        <ModalAddEditTagBindCam
          handleSubmit={handleSubmitUpdateTags}
          setShowModal={setShowModalTag}
          showModal={showModalTag}
          tags={form.getFieldValue("tags")}
        />
      )}
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
  let zones = await ZoneApi.getAllZones(data);

  if (isEmpty(zones)) {
    zones = DATA_FAKE_CAMERA.zones;
  }

  let adDivisions = await AdDivisionApi.getAllAdDivision(data);

  if (isEmpty(adDivisions)) {
    adDivisions = DATA_FAKE_CAMERA.adDivisions;
  }

  let cameraTypes = await CameraApi.getAllCameraTypes(data);

  if (isEmpty(cameraTypes)) {
    cameraTypes = DATA_FAKE_CAMERA.cameraTypes;
  } else {
    cameraTypes = cameraTypes.sort(compareName);
  }

  let vendors = await VendorApi.getAllVendor(data);

  if (isEmpty(vendors)) {
    vendors = DATA_FAKE_CAMERA.vendors;
  }

  return {
    provinces,
    zones,
    adDivisions,
    cameraTypes,
    vendors,
  };
}
export default ModalAddCamera;
