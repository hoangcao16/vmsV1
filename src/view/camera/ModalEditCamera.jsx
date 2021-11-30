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
import { isEmpty } from "lodash-es";
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
import Loading from "../common/element/Loading";
import { filterOption, normalizeOptions } from "../common/select/CustomSelect";
import ExportEventFileApi from "./../../actions/api/exporteventfile/ExportEventFileApi";
import "./../commonStyle/commonForm.scss";
import "./../commonStyle/commonInput.scss";
import "./../commonStyle/commonModal.scss";
import "./../commonStyle/commonSelect.scss";
import { DATA_FAKE_CAMERA } from "./ModalAddCamera";
import ModalAddEditTagBindCam from "./ModalAddEditTagBindCam";
import "./ModalEditCamera.scss";
import "./UploadFile.scss";

const formItemLayout = {
  wrapperCol: { span: 24 },
  labelCol: { span: 24 },
};

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

const ModalEditCamera = (props) => {
  const { t } = useTranslation();
  const { handleShowModalEdit, selectedCameraIdEdit } = props;

  const [isModalVisible, setIsModalVisible] = useState(
    !isEmpty(selectedCameraIdEdit)
  );

  const [selectedCameraEdit, setSelectedCameraEdit] =
    useState(DATA_FAKE_CAMERA);

  const [filterOptions, setFilterOptions] = useState({});

  const [provinceId, setProvinceId] = useState(
    selectedCameraEdit?.provinceId || null
  );

  const [districts, setDistrict] = useState([]);

  const [districtId, setDistrictId] = useState(
    selectedCameraEdit?.districtId || null
  );

  const [wards, setWard] = useState([]);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [avatarFileName, setAvatarFileName] = useState("");

  const [form] = Form.useForm();

  const [showModalTag, setShowModalTag] = useState(false);

  useEffect(() => {
    CameraApi.getCameraByUuid(selectedCameraIdEdit).then((data) => {
      if (data?.avatarFileName) {
        loadAvatarHandler(data?.avatarFileName).then();
      }
      setSelectedCameraEdit(data);
      setProvinceId(data.provinceId);
      setDistrictId(data.districtId);
      return;
    });
  }, []);

  useEffect(() => {
    fetchSelectOptions().then(setFilterOptions);
  }, []);

  useEffect(() => {
    if (null === provinceId) {
      return;
    }

    setDistrict([]);

    if (provinceId) {
      AddressApi.getDistrictByProvinceId(provinceId).then(setDistrict);
    }
  }, [provinceId]);

  useEffect(() => {
    if (null === districtId) {
      return;
    }

    setWard([]);

    if (districtId) {
      AddressApi.getWardByDistrictId(districtId).then(setWard);
    }
  }, [districtId]);

  const { provinces, zones, vendors, cameraTypes, adDivisions } = filterOptions;

  const loadAvatarHandler = async (avatarFileName) => {
    if (avatarFileName !== "" && avatarUrl === "") {
      await ExportEventFileApi.getAvatar(avatarFileName).then((result) => {
        if (result.data) {
          let blob = new Blob([result.data], { type: "octet/stream" });
          let url = window.URL.createObjectURL(blob);
          setAvatarUrl(url);
        } else {
          setAvatarUrl("");
        }
      });
    }
  };

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

  if (
    isEmpty(provinces) ||
    isEmpty(zones) ||
    isEmpty(vendors) ||
    isEmpty(cameraTypes) ||
    isEmpty(adDivisions)
  ) {
    return <Loading />;
  }

  const handleSubmit = async (value) => {
    const payload = {
      ...value,
      avatarFileName: avatarFileName,
    };

    const clearPayload = clearData(payload);

    try {
      const isEdit = await CameraApi.editCamera(
        props.selectedCameraIdEdit,
        clearPayload
      );

      if (isEdit) {
        setIsModalVisible(false);
        handleShowModalEdit();
      }
    } catch (error) {
      Notification({
        type: "error",
        title: "",
        description: "Edit camera failed " + error.toString(),
      });
      console.log(error);
    }
  };

  const showModalEditTag = () => {
    setShowModalTag(true);
  };

  const handleSubmitUpdateTags = (value) => {
    form.setFieldsValue({ tags: value.tags });
    setSelectedCameraEdit({ ...selectedCameraEdit, tags: value.tags });
    setShowModalTag(false);
  };
  return (
    <>
      <Modal
        title={t("view.camera.edit_camera", { cam: t("camera") })}
        visible={isModalVisible}
        onOk={handleShowModalEdit}
        onCancel={handleShowModalEdit}
        footer={null}
        className="modal--edit-camera"
        maskStyle={{ background: "rgba(51, 51, 51, 0.9)" }}
      >
        <Form
          className="bg-grey"
          form={form}
          {...formItemLayout}
          onFinish={handleSubmit}
          initialValues={selectedCameraEdit}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Row>
                <Col span={24}>
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
                      placeholder={t("view.map.please_enter_camera_name", {
                        plsEnter: t("please_enter"),
                        cam: t("camera"),
                      })}
                      maxLength={255}
                      onBlur={(e) =>
                        form.setFieldsValue({ name: e.target.value.trim() })
                      }
                    />
                  </Form.Item>
                </Col>

                <Col span={24}>
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
                      placeholder={t("view.map.please_enter_camera_id", {
                        plsEnter: t("please_enter"),
                        cam: t("camera"),
                      })}
                      maxLength={255}
                      onBlur={(e) =>
                        form.setFieldsValue({ code: e.target.value.trim() })
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col
              span={12}
              style={{
                display: "flex",
                alignItem: "center",
                justifyContent: "center",
              }}
            >
              <Col span={12}>
                <Upload
                  accept=".png,.jpeg,.jpg"
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader "
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
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label={t("view.map.camera_type", { cam: t("camera") })}
                name={["cameraTypeUuid"]}
                rules={[
                  {
                    required: true,
                    message: `${t("view.map.required_field")}`,
                  },
                ]}
              >
                <Select
                  dataSource={cameraTypes}
                  filterOption={filterOption}
                  options={normalizeOptions("name", "uuid", cameraTypes)}
                  placeholder={
                    (t("view.map.please_choose_camera_type"),
                    { cam: t("camera") })
                  }
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
                  dataSource={vendors}
                  filterOption={filterOption}
                  options={normalizeOptions("name", "uuid", vendors)}
                  placeholder={t("view.map.please_enter_name_vendor", {
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
                  placeholder={t("view.map.please_choose_location")}
                  maxLength={255}
                  onBlur={(e) =>
                    form.setFieldsValue({ address: e.target.value.trim() })
                  }
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
                          Math.abs(data) <= 180 
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
                  // type="number"
                  // onKeyDown={(evt) =>
                  //   ["e", "E","d","D"].includes(evt.key) &&
                  //   evt.preventDefault()
                  // }
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
                        if (isFinite(data) && Math.abs(data) <= 90) {
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
                  // type="number"
                  // onKeyDown={(evt) =>
                  //   ["e", "E","d","D"].includes(evt.key) &&
                  //   evt.preventDefault()
                  // }
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
                  {
                    required: true,
                    message: `${t("view.map.required_field")}`,
                  },
                ]}
              >
                <Input
                  placeholder={t("view.map.please_enter_port", {
                    plsEnter: t("please_enter"),
                  })}
                  maxLength={255}
                  onBlur={(e) =>
                    form.setFieldsValue({ port: e.target.value.trim() })
                  }
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
                  dataSource={zones}
                  filterOption={filterOption}
                  options={normalizeOptions("name", "uuid", zones)}
                  placeholder={t("view.camera.choose_zone")}
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
                  maxLength={255}
                  onBlur={(e) =>
                    form.setFieldsValue({ ip: e.target.value.trim() })
                  }
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
                  maxLength={2000}
                  onBlur={(e) =>
                    form.setFieldsValue({ cameraUrl: e.target.value.trim() })
                  }
                />
              </Form.Item>
              <Col span={24}>
                <Form.Item noStyle name={["tags"]}>
                  <Input type="hidden" />
                </Form.Item>
              </Col>
            </Col>
            <Col span={24} className="mt-1">
              <span className="edit-tag-item" onClick={showModalEditTag}>
                {t("view.camera.edit_tag")}
              </span>
            </Col>
          </Row>
          <div className="btn--confirm">
            <Button type="primary" htmlType="submit ">
              {t("view.user.detail_list.confirm")}
            </Button>
            <Button onClick={handleShowModalEdit}>
              {t("view.camera.close")}
            </Button>
          </div>
        </Form>
      </Modal>
      {showModalTag && (
        <ModalAddEditTagBindCam
          handleSubmit={handleSubmitUpdateTags}
          setShowModal={setShowModalTag}
          camId={selectedCameraIdEdit}
          showModal={showModalTag}
          tags={selectedCameraEdit?.tags}
        />
      )}
    </>
  );
};

export function compareName(a, b) {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
}

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

export default ModalEditCamera;
