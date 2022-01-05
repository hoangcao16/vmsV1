import { CloseOutlined } from "@ant-design/icons";
import { Button, Form, Radio } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AdministrativeUnitType, CamType } from "../../../@core/common/common";
import AddressApi from "../../../actions/api/address/AddressApi";
import adDivisionApi from "../../../api/controller-api/adDivisionApi";
import cameraGroupApi from "../../../api/controller-api/cameraGroupApi";
import { PAGE_SIZE } from "../../common/vms/Constant";
import AdminisUnitFormFilter from "./AdminisUnitFormFilter";
import CameraFormFilter from "./CamFormFilter";

const MapFilter = (props) => {
  const { t } = useTranslation();
  let {
    provinces,
    handlerToggleFilter,
    handleApplyFilterCallback,
    isShowRadioGroupChangeMode = true,
  } = props;
  const [form] = Form.useForm();

  const [filterType, setFilterType] = useState(1);
  const [provinceId, setProvinceId] = useState(null);
  const [districtId, setDistrictId] = useState(null);
  const [administrativeUnitUuid, setAdministrativeUnitUuid] = useState(null);
  const [wardId, setWardId] = useState(null);
  const [districts, setDistrict] = useState();
  const [wards, setWards] = useState([]);
  const [adDivisions, setAdDivisions] = useState([]);
  const [camGroups, setCamGroups] = useState([]);
  const [cameraGroupUuid, setCameraGroupUuid] = useState(null);

  useEffect(() => {
    adDivisionApi.getAll().then((data) => {
      if (data && data.payload) {
        setAdDivisions(data.payload);
      }
    });
    cameraGroupApi.getAll().then((data) => {
      if (data && data.payload) setCamGroups(data.payload);
    });
  }, []);
  useEffect(() => {
    setDistrict([]);
    if (provinceId) {
      AddressApi.getDistrictByProvinceId(provinceId).then(setDistrict);
    }
  }, [provinceId]);

  useEffect(() => {
    setWards([]);
    if (districtId) {
      AddressApi.getWardByDistrictId(districtId).then(setWards);
    }
  }, [districtId]);
  const onChangeFilterType = (e) => {
    setFilterType(e.target.value);
    resetFilter();
  };
  const points = [
    {
      name: `${t('view.storage.all')}`,
      id: 1,
    },
    {
      name: `${t('view.map.location_onmap')}`,
      id: 2,
    },
    {
      name: `${t('view.map.not_located_yet')}`,
      id: 3,
    },
  ];

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

  const onChangeWard = async (wardId) => {
    setWardId(wardId);
  };

  function resetWardData() {
    form.setFieldsValue({ wardId: null });
  }

  const handleSubmit = async (value) => {

    const location = form.getFieldValue("locationOnMap");
    const address = form.getFieldValue("address");
    const filter = {
      page: 1,
      size: PAGE_SIZE,
      cameraGroupUuid: cameraGroupUuid,
      provinceId: provinceId,
      districtId: districtId,
      wardId: wardId,
      address: address,
      administrativeUnitUuid: administrativeUnitUuid,
      locationOnMap: location,
    };
    handleApplyFilterCallback(filter, filterType);
    handlerToggleFilter();
  };

  const resetFilter = () => {
    setWardId(null);
    setDistrictId(null);
    setProvinceId(null);
    setCameraGroupUuid(null);
    setAdministrativeUnitUuid(null);
    form.setFieldsValue({
      page: 1,
      size: PAGE_SIZE,
      cameraGroupUuid: null,
      provinceId: null,
      districtId: null,
      wardId: null,
      address: null,
      administrativeUnitUuid: null,
      locationOnMap: 1,
    });
  };

  const handleReset = () => {
    resetFilter();
  };

  return (
    <div
      className={
        "camera-filter position-absolute d-flex flex-column" +
        (props.isOpen ? " open" : "")
      }
    >
      <Form
        className="camera-form-inner"
        layout="vertical"
        form={form}
        initialValues={{ layout: "vertical" }}
        onFinish={handleSubmit}
      >
        <Form.Item>
          <CloseOutlined
            className="icon-close app-icon"
            onClick={props.handlerToggleFilter}
          />
        </Form.Item>

        {isShowRadioGroupChangeMode && (
          <Form.Item>
            <Radio.Group onChange={onChangeFilterType} value={filterType}>
              <Radio value={CamType}>{t("camera")}</Radio>
              <Radio value={AdministrativeUnitType}>
                {t("view.map.administrative_unit_uuid")}
              </Radio>
            </Radio.Group>
          </Form.Item>
        )}
        {filterType == CamType ? (
          <CameraFormFilter
            provinces={provinces}
            camGroups={camGroups}
            setCameraGroupUuid={setCameraGroupUuid}
            onChangeCity={onChangeCity}
            districts={districts}
            onChangeDistrict={onChangeDistrict}
            wards={wards}
            onChangeWard={onChangeWard}
            administrativeUnitUuid={administrativeUnitUuid}
            setAdministrativeUnitUuid={setAdministrativeUnitUuid}
            adDivisions={adDivisions}
            points={points}
            form={form}
          />
        ) : (
          <AdminisUnitFormFilter
            provinces={provinces}
            onChangeCity={onChangeCity}
            districts={districts}
            onChangeDistrict={onChangeDistrict}
            onChangeWard={onChangeWard}
            wards={wards}
            points={points}
            form={form}
          />
        )}

        <Form.Item>
          <Button type="primary" block onClick={() => handleSubmit()}>
            {t("view.map.btn_apply")}
          </Button>
        </Form.Item>
        <Form.Item>
          <Button type="primary" ghost block onClick={() => handleReset()}>
            {t("view.map.btn_remove_filter", { del: t("delete") })}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default MapFilter;
