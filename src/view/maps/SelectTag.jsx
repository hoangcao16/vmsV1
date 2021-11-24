import { Select, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { loadTags } from "./redux/actions/tagsActions";

const SelectTag = (props) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    props.loadTagsData();
  }, []);

  useEffect(() => {
    setOptions(props.tags);
  }, [props.tags]);

  const handleChange = (selectedItems) => {
    setSelectedItems(
      setSelectedItems,
      props.handlePickData(`${selectedItems[0]}:`)
    );
  };

  const filteredOptions = options.filter((o) => !selectedItems.includes(o));

  if (!options) {
    return <Spin />;
  }

  return (
    <Select
      mode="multiple"
      placeholder="Chọn gợi ý"
      value={selectedItems}
      onChange={handleChange}
      style={{ width: "100%" }}
    >
      {filteredOptions.map((item) => (
        <Select.Option key={item} value={item}>
          {item}
        </Select.Option>
      ))}
    </Select>
  );
};

const mapStateToProps = (state) => ({
  isLoading: state.quickSearch.isLoading,
  tags: state.quickSearch.tags,
  error: state.quickSearch.error,
});

const mapDispatchToProps = (dispatch) => {
  return {
    loadTagsData: () => {
      dispatch(loadTags());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectTag);
