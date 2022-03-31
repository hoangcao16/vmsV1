import { Select } from 'antd';
import { defaultTo, get } from 'lodash';
import React from 'react';


function removeAccents(str) {
  return str.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd').replace(/Đ/g, 'D')
            .replace(/\s+/g, '');
}

export function filterOption(input, option) {
  return option.label.match(new RegExp(input, 'i')) || removeAccents(option.label).match(new RegExp(input, 'i'));
}

export function normalizeOptions(labelField, valueField, dataSource) {
  if (dataSource != null) {
    return dataSource
      .sort((a, b) =>
        defaultTo(get(a, labelField), '').localeCompare(get(b, labelField))
      )
      .map((r) => ({
        value: get(r, valueField),
        label: get(r, labelField)
      }));
  }
  return [];
}

export function CustomSelect(props) {
  // using undocumented props: id
  const {
    onChange: originalOnChangeFn,
    dataSource,
    labelField,
    valueField,
    id: formField,
    relatedFormField,
    relatedDataField,
    placeholder,
    form,
    ...otherProps
  } = props;
  function onChange(selected) {
    if (typeof originalOnChangeFn === 'function') {
      originalOnChangeFn(selected);
    }

    if (relatedFormField) {
      if (selected === undefined) {
        form.setFieldsValue({ [formField]: null });
      }

      const found = dataSource.find((r) => r[valueField] === selected);

      form.setFieldsValue({
        [formField]: get(found, relatedDataField, null)
      });
    }
  }

  return (
    <Select
      {...otherProps}
      className="select-field"
      placeholder={placeholder}
      showSearch
      filterOption={filterOption}
      options={normalizeOptions(labelField, valueField, dataSource)}
      onChange={onChange}
    />
  );
}
