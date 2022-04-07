import React, { useState } from "react";
import { Select, Input, Form } from "antd";
import {
  filterOption,
  normalizeOptions,
} from "../../common/select/CustomSelect";

import { useTranslation } from "react-i18next";

const CameraFormFilter = (props) => {
  const { t } = useTranslation();

  let {
    provinces,
    camGroups,
    setCameraGroupUuid,
    onChangeCity,
    districts,
    onChangeDistrict,
    wards,
    onChangeWard,
    administrativeUnitUuid,
    setAdministrativeUnitUuid,
    adDivisions,
    points,
    form,
  } = props;

  return (
    <>
      <Form.Item
        name={["cameraGroupUuid"]}
        label={t("view.map.camera_group", { cam: `${t("camera")}` })}
      >
        <Select
          className="filter_select-box"
          datasource={camGroups ? camGroups : []}
          showSearch
          allowClear
          onChange={(uuid) => setCameraGroupUuid(uuid)}
          filterOption={filterOption}
          options={normalizeOptions("name", "uuid", camGroups || [])}
          placeholder={t("view.map.camera_group", { cam: `${t("camera")}` })}
          dropdownClassName="map-filter-dropdown-list"
        />
      </Form.Item>

      <Form.Item name={["provinceId"]} label={t("view.map.province_id")}>
        <Select
          datasource={provinces ? provinces : []}
          showSearch
          allowClear
          onChange={(provinceId) => onChangeCity(provinceId)}
          filterOption={filterOption}
          options={normalizeOptions("name", "provinceId", provinces || [])}
          placeholder={t("view.map.province_id")}
          dropdownClassName="map-filter-dropdown-list"
        />
      </Form.Item>

      <Form.Item name={["districtId"]} label={t("view.map.district_id")}>
        <Select
          datasource={districts}
          showSearch
          allowClear
          onChange={(districtId) => onChangeDistrict(districtId)}
          filterOption={filterOption}
          options={normalizeOptions("name", "districtId", districts || [])}
          placeholder={t("view.map.district_id")}
          dropdownClassName="map-filter-dropdown-list"
        />
      </Form.Item>
      <Form.Item name={["wardId"]} label={t("view.map.ward_id")}>
        <Select
          datasource={wards}
          showSearch
          allowClear
          onChange={(wardId) => onChangeWard(wardId)}
          filterOption={filterOption}
          options={normalizeOptions("name", "id", wards || [])}
          placeholder={t("view.map.ward_id")}
          dropdownClassName="map-filter-dropdown-list"
        />
      </Form.Item>

      <Form.Item name={["address"]} label={t("view.map.address_id")}>
        <Input
          placeholder={t("view.map.address_id")}
          maxLength={255}
          onBlur={(e) => {
            form.setFieldsValue({
              address: e.target.value.trim(),
            });
          }}
          onPaste={(e) => {
            e.preventDefault();
            form.setFieldsValue({
              address: e.clipboardData.getData("text").trim(),
            });
          }}
        />
      </Form.Item>

      <Form.Item
        name={["administrativeUnitUuid"]}
        label={t("view.map.administrative_unit_uuid")}
      >
        <Select
          datasource={administrativeUnitUuid}
          onChange={(administrativeUnitUuid) =>
            setAdministrativeUnitUuid(administrativeUnitUuid)
          }
          filterOption={filterOption}
          showSearch
          allowClear
          options={normalizeOptions("name", "uuid", adDivisions || [])}
          placeholder={t("view.map.administrative_unit_uuid")}
          dropdownClassName="map-filter-dropdown-list"
        />
      </Form.Item>

      <Form.Item name={["locationOnMap"]} label={t("view.map.location_onmap")}>
        <Select
          datasource={points}
          allowClear
          filterOption={filterOption}
          onChange={(isLocateGeo) => {}}
          options={normalizeOptions("name", "id", points || [])}
          placeholder={t("view.map.location_onmap")}
          dropdownClassName="map-filter-dropdown-list"
        />
      </Form.Item>
    </>
  );
};

export default CameraFormFilter;
