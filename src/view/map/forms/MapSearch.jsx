import React from 'react'
import { Input, Space, Button } from "antd";
import { Filter } from "react-feather"
import { SearchOutlined } from "@ant-design/icons";
const MapSearch = ({searchCamera, onPressEnter,toggleOpennedCameraFilter}) => {
    return (
        <Space>
        <Input
          className="camera-list__search"
          placeholder="Tìm kiếm"
          value={searchCamera}
          onPressEnter={(e) => onPressEnter(e.target.value)}
          suffix={<SearchOutlined />}
        />
        <Button
          onClick={toggleOpennedCameraFilter}
          className="camera-list__filter-box"
        >
          {/* <i className="feather icon-filter camera-list__filter-icon"></i> */}
          <Filter className="camera-list__filter-icon feather icon-filter"/>
        </Button>
      </Space>
    )
}

export default MapSearch
