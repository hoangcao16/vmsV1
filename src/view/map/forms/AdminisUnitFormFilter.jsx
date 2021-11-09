import React from "react";
import {  Select, Input, Form} from "antd";
import {
  filterOption,
  normalizeOptions,
} from "../../common/select/CustomSelect";
import { useTranslation } from 'react-i18next';



const AdminisUnitFormFilter = (props) => {
  let { provinces, districts, onChangeCity, onChangeDistrict,wards, onChangeWard, points } = props;
  const { t } = useTranslation();

  return (
    <>
      <Form.Item name={["provinceId"]} label={t('view.map.province_id')}>
        <Select
          datasource={provinces ? provinces : []}
          showSearch
          allowClear
          onChange={(provinceId) => onChangeCity(provinceId)}
          filterOption={filterOption}
          options={normalizeOptions("name", "provinceId", provinces || [])}
          placeholder={t('view.map.province_id')}
          dropdownClassName="map-filter-dropdown-list"
        />
      </Form.Item>

      <Form.Item name={["districtId"]} label={t('view.map.district_id')}>
        <Select
          dataSource={districts}
          showSearch
          allowClear
          onChange={(districtId) => onChangeDistrict(districtId)}
          filterOption={filterOption}
          options={normalizeOptions("name", "districtId", districts || [])}
          placeholder={t('view.map.district_id')}
          dropdownClassName="map-filter-dropdown-list"
        />
      </Form.Item>
      <Form.Item name={["wardId"]} label={t('view.map.ward_id')}>
        <Select
          dataSource={wards}
          showSearch
          allowClear
          onChange={(wardId) => onChangeWard(wardId)}
          filterOption={filterOption}
          options={normalizeOptions("name", "id", wards || [])}
          placeholder={t('view.map.ward_id')}
          dropdownClassName="map-filter-dropdown-list"
        />
      </Form.Item>

      <Form.Item name={["address"]} label={t('view.map.address_id')}>
        <Input placeholder={t('view.map.address_id')} />
      </Form.Item>

      <Form.Item name={["locationOnMap"]} label={t('view.map.location_onmap')}>
        <Select
          dataSource={points}
          allowClear
          filterOption={filterOption}
          onChange={(isLocateGeo) => {}}
          options={normalizeOptions("name", "id", points || [])}
          placeholder={t('view.map.location_onmap')}
          dropdownClassName="map-filter-dropdown-list"
        />
      </Form.Item>
    </>
  );
};

export default AdminisUnitFormFilter;
