import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Row, Select, Space, Upload } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AdministrativeUnitType } from "../../../@core/common/common";
import AddressApi from "../../../actions/api/address/AddressApi";
import AdDivisionApi from "../../../actions/api/advision/AdDivision";
import cameraTypeApi from "../../../api/controller-api/cameraTypeApi";
import vendorApi from "../../../api/controller-api/vendorApi";
import zoneApi from "../../../api/controller-api/zoneApi";
import useHandleUploadFile from "../../../hooks/useHandleUploadFile";
import {
  filterOption,
  normalizeOptions,
} from "../../common/select/CustomSelect";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import "./MapAdministrativeUnitAdd.scss";

const { Dragger } = Upload;
async function fetchSelectOptions() {
  const provinces = await AddressApi.getAllProvinces();
  const zones = await zoneApi.getAll();
  const adDivisions = await AdDivisionApi.getAllAdDivision();
  const cameraTypes = await cameraTypeApi.getAll();
  const vendors = await vendorApi.getAll();
  return {
    provinces,
    zones,
    adDivisions,
    cameraTypes,
    vendors,
  };
}

const MapAdministrativeUnitAdd = (props) => {
  const { t } = useTranslation();
  const [paste, setPaste] = useState(false);
  const [form] = Form.useForm();
  const [imgFile, setImgFile] = useState("");
  const [isCollapsedCameraForm, setIsCollapsedCameraForm] = useState(false);
  const [
    imageUrl,
    imgFileName,
    loading,
    handleChange,
    uploadImage,
    beforeUpload,
  ] = useHandleUploadFile(imgFile);
  const {
    initialLatLgn,
    editAdminisUnit,
    handleSubmitCallback,
    selectNewPosition,
  } = props;

  useEffect(() => {
    (async () => {
      await fetchSelectOptions().then(setFilterOptions);
      if (editAdminisUnit != null) {
        // setProvinceId(editAdminisUnit.provinceId);
        await AddressApi.getDistrictByProvinceId(
          editAdminisUnit.provinceId
        ).then(setDistrict);
        if (editAdminisUnit.districtId) {
          await AddressApi.getWardByDistrictId(editAdminisUnit.districtId).then(
            setWard
          );
        }
        form.setFieldsValue({
          uuid: editAdminisUnit.uuid,
          name: editAdminisUnit.name,
          long_: editAdminisUnit.long_,
          lat_: editAdminisUnit.lat_,
          address: editAdminisUnit.address,
          provinceId: editAdminisUnit.provinceId,
          districtId: editAdminisUnit.districtId,
          wardId: editAdminisUnit.wardId,
          tel: editAdminisUnit.tel,
        });
        if (selectNewPosition) {
          form.setFieldsValue({
            long_: initialLatLgn[0],
            lat_: initialLatLgn[1],
          });
        }
      } else {
        form.resetFields()
        setDistrict([])
        setWard([])
        if (selectNewPosition) {
          form.setFieldsValue({
            long_: initialLatLgn[0],
            lat_: initialLatLgn[1],
          });
        }
      }
      setImgFile(editAdminisUnit?.avatarFileName ?? "");
    })();
  }, [
    editAdminisUnit,
    form,
    initialLatLgn[0],
    initialLatLgn[1],
    selectNewPosition,
  ]);

  const toggleCollapsedCameraForm = () => {
    setIsCollapsedCameraForm(isCollapsedCameraForm ? false : true);
  };

  const [filterOptions, setFilterOptions] = useState({});

  const [provinceId, setProvinceId] = useState(null);

  const [districts, setDistrict] = useState([]);

  const [districtId, setDistrictId] = useState(null);

  const [wards, setWard] = useState([]);

  // useEffect(() => {
  //   fetchSelectOptions().then(setFilterOptions);
  // }, []);

  useEffect(() => {
    setDistrict([]);
    setDistrictId(null);
    setWard([]);
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

  const { provinces } = filterOptions;

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>{t("view.map.add_image")}</div>
    </div>
  );

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

  const handleSubmit = async (value) => {
    const payload = {
      ...value,
      avatarFileName: imgFileName,
      lat_: +value?.lat_,
      long_: +value?.long_,
    };
    handleSubmitCallback(payload, AdministrativeUnitType);
  };

  const onReset = () => {
    form.resetFields();
  };

  const validatePhoneNumber = (value) => {
    let rules = [];
    if (value == "tel") {
      rules.push(
        {
          required: true,
          message: `${t("view.map.required_field")}`,
        },
        {
          min: 12,
          message: `${t("noti.at_least_10_characters")}`,
        },
        () => ({
          validator(_, value) {
            const valiValue = document.getElementById("tel").value;
            if (
              valiValue.length &&
              valiValue.length <= 20
            ) {
              return Promise.resolve();
            }
            return Promise.reject(new Error(t("noti.up_to_20_characters")));
          },
        })
      );
    }
    return rules;
  };

  return (
    <div
      className={
        "camera-form position-absolute d-flex flex-column" +
        (isCollapsedCameraForm ? " collapsed" : "")
      }
    >
      <a className="toggle-collapse" onClick={toggleCollapsedCameraForm} />
      <Form
        className="camera-form-inner"
        layout="vertical"
        form={form}
        fields={[]}
        onFinish={handleSubmit}
      >
        <Row gutter={12}>
          <Col span={24} className="pb-1">
            <Dragger
              name="avatar"
              listType="picture-card"
              className="camera-image"
              showUploadList={false}
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              beforeUpload={beforeUpload}
              onChange={handleChange}
              customRequest={uploadImage}
            >
              {imageUrl ? (
                <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
              ) : (
                uploadButton
              )}
            </Dragger>
          </Col>
          <Col span={24} hidden={true}>
            <Form.Item name={["uuid"]}>
              <Input placeholder="uuid" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name={["name"]}
              label={t("view.map.unit_name")}
              rules={[
                { required: true, message: t("view.map.required_field") },
              ]}
            >
              <Input
                placeholder={t("view.map.please_enter_unit_name", {
                  plsEnter: t("please_enter"),
                })}
                maxLength={255}
                onBlur={(e) =>
                  form.setFieldsValue({ name: e.target.value.trim() })
                }
                onPaste={(e) => {
                  form.setFieldsValue({ name: e.target.value.trimStart() });
                  setPaste(true);
                }}
                onChange={(e) => {
                  if (paste) {
                    setPaste(false);
                    form.setFieldsValue({
                      name: e.target.value.trim(),
                    });
                  }
                }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12} className="camera-form-inner__item">
          <Col span={24}>
            <Form.Item
              name={["address"]}
              label={t("view.map.address")}
              rules={[
                { required: true, message: t("view.map.required_field") },
              ]}
            >
              <Input
                placeholder={t("view.map.please_enter_your_address", {
                  plsEnter: t("please_enter"),
                })}
                maxLength={255}
                onBlur={(e) =>
                  form.setFieldsValue({ address: e.target.value.trim() })
                }
                onPaste={(e) => {
                  form.setFieldsValue({ address: e.target.value.trimStart() });
                  setPaste(true);
                }}
                onChange={(e) => {
                  if (paste) {
                    setPaste(false);
                    form.setFieldsValue({
                      address: e.target.value.trim(),
                    });
                  }
                }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={24}>
            <Form.Item
              label={t("view.map.phone_number")}
              name={["tel"]}
              rules={validatePhoneNumber("tel")}
            >
              <PhoneInput
                international={false}
                defaultCountry="VN"
                placeholder={t("view.map.please_enter_your_phone_number", {
                  plsEnter: t("please_enter"),
                })}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              name={["provinceId"]}
              label={t("view.map.province_id")}
              rules={[
                { required: true, message: t("view.map.required_field") },
              ]}
            >
              <Select
                dataSource={provinces || []}
                onChange={(cityId) => onChangeCity(cityId)}
                filterOption={filterOption}
                options={normalizeOptions(
                  "name",
                  "provinceId",
                  provinces || []
                )}
                placeholder={t("view.map.province_id")}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name={["districtId"]}
              label={t("view.map.district_id")}
              rules={[
                { required: true, message: t("view.map.required_field") },
              ]}
            >
              <Select
                dataSource={districts}
                onChange={(districtId) => onChangeDistrict(districtId)}
                filterOption={filterOption}
                options={normalizeOptions(
                  "name",
                  "districtId",
                  districts || []
                )}
                placeholder={t("view.map.district_id")}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item name={["wardId"]} label={t("view.map.ward_id")}>
              <Select
                allowClear
                dataSource={wards}
                filterOption={filterOption}
                options={normalizeOptions("name", "id", wards || [])}
                placeholder={t("view.map.ward_id")}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
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
                      return Promise.resolve(`${t("view.map.required_field")}`);
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
                onPaste={(e) => {
                  form.setFieldsValue({ long_: e.target.value.trimStart() });
                  setPaste(true);
                }}
                onChange={(e) => {
                  if (paste) {
                    setPaste(false);
                    form.setFieldsValue({
                      long_: e.target.value.trim(),
                    });
                  }
                }}
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
                      return Promise.resolve(`${t("view.map.required_field")}`);
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
                onPaste={(e) => {
                  form.setFieldsValue({ lat_: e.target.value.trimStart() });
                  setPaste(true);
                }}
                onChange={(e) => {
                  if (paste) {
                    setPaste(false);
                    form.setFieldsValue({
                      lat_: e.target.value.trim(),
                    });
                  }
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        <div
          className="submit"
          style={{
            textAlign: "center",
          }}
        >
          <Space>
            <Button
              className="submit__button submit__button--cancel"
              htmlType="button"
              ghost
              onClick={onReset}
            >
              {t("view.map.button_cancel")}
            </Button>
            <Button
              className="submit__button"
              type="primary"
              htmlType="submit "
            >
              {t("view.map.button_save")}
            </Button>
          </Space>
        </div>
      </Form>
    </div>
  );
};

export default MapAdministrativeUnitAdd;
