import { Spin } from "antd";
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
    props.handlePickData(`${selectedItems}:`);
  };

  const filteredOptions = options.filter((o) => !selectedItems.includes(o));

  if (!options) {
    return <Spin />;
  }

  return (
    <div className="list-data-search">
      <ul>
        {filteredOptions.map((item) => (
          <li key={item} onClick={() => handleChange(item)}>
            {item}
          </li>
        ))}
      </ul>
    </div>
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
