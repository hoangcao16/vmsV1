import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space } from 'antd';
import { get, isNull, isUndefined } from 'lodash';
import React from 'react';

const TableUtils = {
  getColumnDropDownFilter(listData, dataIndex) {
    const dataIndices = Array.isArray(dataIndex) ? dataIndex : [dataIndex];

    let dataForFilter = [];
    for (let i = 0; i < dataIndices.length; i++) {
      dataForFilter = dataForFilter.concat(
        listData.map((d) => get(d, dataIndices[i], null))
      );
    }

    const uniqueDataForFilter = [...new Set(dataForFilter)];

    const filters = uniqueDataForFilter
      .filter((o) => !isNull(o) && !isUndefined(o))
      .sort((a, b) => a.toString().localeCompare(b))
      .map((o) => ({
        text: o,
        value: o,
      }));

    return {
      filters,
      onFilter: (value, record) => {
        return dataIndices.some((key) => get(record, key) === value);
      },
    };
  },
  getColumnSearchProps(dataIndex) {
    return {
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={(node) => {
              this.searchInput = node;
            }}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={confirm}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button onClick={clearFilters} size="small" style={{ width: 90 }}>
              Reset
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (value, record) =>
        record[dataIndex]
          ? record[dataIndex]
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase())
          : '',
      onFilterDropdownVisibleChange: (visible) => {
        if (visible) {
          setTimeout(() => this.searchInput.select(), 100);
        }
      },
    };
  },
};

export default TableUtils;
