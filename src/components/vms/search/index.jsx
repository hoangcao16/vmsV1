import React, { useState } from 'react'
import { Input, Space, Button } from "antd";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";

import "./index.scss"
import { useTranslation } from 'react-i18next';

const Search = ({ onPressEnter, toggleOpenFilter, searchValue }) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState(searchValue);
  const handleChange = (e) => {
    const value = e.target.value;
    if (value === '') {
      onPressEnter(value);
    }
    setSearch(value)
  }
  return (
    <Space className="search-input" style={{ justifyContent: 'space-between' }}>
      <Input
        value={search}
        className="search-input__item"
        placeholder={t('view.map.search')}
        onPressEnter={(e) => onPressEnter(e.target.value)}
        onChange={handleChange}
        suffix={<SearchOutlined onClick={() => onPressEnter(search)} />}
      />
      {toggleOpenFilter && <Button
        onClick={toggleOpenFilter}
        className="search-input__filter"
      >
        <FilterOutlined />
      </Button>}
    </Space>
  )
}

export default Search
