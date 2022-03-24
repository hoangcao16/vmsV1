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
import { isEmpty } from "lodash-es";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { v4 as uuidV4 } from "uuid";
import AddressApi from "../../actions/api/address/AddressApi";
import AdDivisionApi from "../../actions/api/advision/AdDivision";
import Notification from "../../components/vms/notification/Notification";
import Loading from "../common/element/Loading";
import { filterOption, normalizeOptions } from "../common/select/CustomSelect";
import ExportEventFileApi from "./../../actions/api/exporteventfile/ExportEventFileApi";
import "./../commonStyle/commonForm.scss";
import "./../commonStyle/commonInput.scss";
import "./../commonStyle/commonModal.scss";
import "./../commonStyle/commonSelect.scss";
import "./ModalEditAdministrativeUnit.scss";
import { NOTYFY_TYPE } from "../common/vms/Constant";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

const formItemLayout = {
  wrapperCol: { span: 24 },
  labelCol: { span: 24 },
};

const DATA_FAKE_UNIT = {
  provinces: [{ name: "", provinceId: "" }],
};

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

const ModalEditAdministrativeUnit = (props) => {
  const { t } = useTranslation();
  const { setShowModal, selectedCategoryId } = props;

  const [adUnit, setAdUnit] = useState(null);

  const [filterOptions, setFilterOptions] = useState(DATA_FAKE_UNIT);

  const [provinceId, setProvinceId] = useState(adUnit?.provinceId || null);

  const [districts, setDistrict] = useState([]);

  const [districtId, setDistrictId] = useState(adUnit?.districtId || null);

  const [wards, setWard] = useState([]);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [avatarFileName, setAvatarFileName] = useState("");

  const [form] = Form.useForm();

  useEffect(() => {
    if (selectedCategoryId !== null) {
      AdDivisionApi.getAdDivisionByUuid(selectedCategoryId).then((data) => {
        if (data?.avatarFileName) {
          loadAvatarHandler(data?.avatarFileName).then();
        }
        setAdUnit(data);

        setProvinceId(data.provinceId);
        setDistrictId(data.districtId);
        return;
      });
    }
  }, []);

  useEffect(() => {
    fetchSelectOptions().then(setFilterOptions);
  }, []);

  useEffect(() => {
    if (null === provinceId) {
      return;
    }

    setDistrict([]);
    setWard([]);

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

  const { provinces } = filterOptions;

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
          setAvatarFileName(fileName);
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

  if (isEmpty(provinces)) {
    return <Loading />;
  }

  const validatePhoneNumber = (value) => {
    const pattern = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;
    if (!pattern.test(value) && value.length >= 10) {
      const notifyMess = {
        type: NOTYFY_TYPE.error,
        description: `${t("noti.phone_number_format_is_not_correct")}`,
      };
      Notification(notifyMess);
      return false;
    }
    return true;
  };

  const handleSubmit = async (value) => {
    if (validatePhoneNumber(value?.tel)) {
      const payload = {
        ...value,
        tel: value?.tel,
        avatarFileName: avatarFileName,
        lat_: +value?.lat_,
        long_: +value?.long_,
      };

      try {
        if (selectedCategoryId !== null) {
          const isEdit = await AdDivisionApi.editAdDivision(
            props.selectedCategoryId,
            payload
          );

          if (isEdit) {
            const notifyMess = {
              type: "success",
              title: "",
              description: `${t("noti.successfully_edit_administrative_unit")}`,
            };
            Notification(notifyMess);
          }
        } else {
          const isAdd = await AdDivisionApi.addAdDivision(payload);

          if (isAdd) {
            const notifyMess = {
              type: "success",
              title: "",
              description: `${t("noti.successfully_add_administrative")}`,
            };
            Notification(notifyMess);
          }
        }

        setShowModal(false);
      } catch (error) {
        console.log(error);
      }
    }
  };

  if (selectedCategoryId !== null) {
    if (isEmpty(adUnit)) {
      return null;
    }
  }

  return (
    <>
      <Modal
        title={
          selectedCategoryId
            ? `${t("view.category.edit_administrative_unit")}`
            : `${t("view.camera.add_new")}`
        }
        visible={true}
        onCancel={() => {
          setShowModal(false);
        }}
        footer={null}
        className="modal--administrative__unit"
        maskStyle={{ background: "rgba(51, 51, 51, 0.9)" }}
      >
        <Form
          form={form}
          {...formItemLayout}
          onFinish={handleSubmit}
          initialValues={adUnit}
        >
          <Row gutter={24}>
            <Col span={9}>
              <Upload
                accept=".png,.jpeg,.jpg"
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                beforeUpload={beforeUpload}
                customRequest={uploadImage}
                onChange={handleChange}
              >
                {avatarUrl && avatarUrl !== "" ? (
                  <Avatar
                    icon={<UserOutlined />}
                    src={avatarUrl}
                    className="avatarUser"
                    // size={{
                    //   xs: 24,
                    //   sm: 32,
                    //   md: 40,
                    //   lg: 64,
                    //   xl: 80,
                    //   xxl: 130
                    // }}
                  />
                ) : (
                  uploadButton
                )}
              </Upload>
            </Col>
            <Col span={15}>
              <Row gutter={24}>
                <Col span={24}>
                  <Form.Item
                    name={["name"]}
                    label={t("view.category.administrative_unit_name")}
                    rules={[
                      {
                        required: true,
                        message: `${t("view.map.required_field")}`,
                      },
                    ]}
                  >
                    <Input
                      placeholder={t(
                        "view.category.plsEnter_administrative_unit_name",
                        { plsEnter: t("please_enter") }
                      )}
                      maxLength={255}
                      onBlur={(e) => {
                        form.setFieldsValue({
                          name: e.target.value.trim(),
                        });
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item
                    name={["tel"]}
                    label={t("view.map.phone_number")}
                    rules={[
                      {
                        required: true,
                        message: `${t("view.map.required_field")}`,
                      },
                      {
                        min: 12,
                        message: `${t("noti.at_least_10_characters")}`,
                      },
                      {
                        max: 22,
                        message: `${t("noti.up_to_20_characters")}`,
                      },
                    ]}
                  >
                    <PhoneInput
                      international={false}
                      defaultCountry="VN"
                      placeholder={t(
                        "view.map.please_enter_your_phone_number",
                        { plsEnter: t("please_enter") }
                      )}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24}>
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
                  onBlur={(e) => {
                    form.setFieldsValue({
                      address: e.target.value.trim(),
                    });
                  }}
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
                  dataSource={provinces}
                  onChange={(cityId) => onChangeCity(cityId)}
                  filterOption={filterOption}
                  options={normalizeOptions("name", "provinceId", provinces)}
                  placeholder={t("view.map.province_id")}
                  allowClear
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
                  dataSource={districts}
                  onChange={(districtId) => onChangeDistrict(districtId)}
                  filterOption={filterOption}
                  options={normalizeOptions("name", "districtId", districts)}
                  allowClear
                  placeholder={t("view.map.district_id")}
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name={["wardId"]} label={t("view.map.ward_id")}>
                <Select
                  dataSource={wards}
                  filterOption={filterOption}
                  options={normalizeOptions("name", "id", wards)}
                  allowClear
                  placeholder={t("view.map.ward_id")}
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
          </Row>
          <div className="footer__modal">
            <Button
              onClick={() => {
                setShowModal(false);
              }}
            >
              {t("view.camera.close")}
            </Button>
            <Button type="primary" htmlType="submit ">
              {t("view.user.detail_list.confirm")}
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

async function fetchSelectOptions() {
  const provinces = await AddressApi.getAllProvinces();

  return {
    provinces,
  };
}

export default ModalEditAdministrativeUnit;
