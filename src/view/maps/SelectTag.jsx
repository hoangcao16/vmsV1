import { Select, Spin } from "antd";
import React from "react";

const OPTIONS = ["Apples", "Nails", "Bananas", "Helicopters"];

class SelectWithHiddenSelectedOptions extends React.Component {
  state = {
    selectedItems: [],
    options: [],
  };

  componentDidMount() {
    // compare new tag vs options
    const data = OPTIONS.filter((t) => {
      const string = JSON.stringify(this.props.allTags)
      return !string.includes(t)
    });

    this.setState({
      options: data,
    });
  }

  handleChange = (selectedItems) => {
    this.setState(
      { selectedItems },
      this.props.handlePickData(`#${selectedItems[0]}:`)
    );
  };

  render() {
    const { selectedItems, options } = this.state;
    const filteredOptions = options.filter((o) => !selectedItems.includes(o));

    if (!options) {
      return <Spin />;
    }

    return (
      <Select
        mode="multiple"
        placeholder="Inserted are removed"
        value={selectedItems}
        onChange={this.handleChange}
        style={{ width: "100%" }}
      >
        {filteredOptions.map((item) => (
          <Select.Option key={item} value={item}>
            {item}
          </Select.Option>
        ))}
      </Select>
    );
  }
}

export default SelectWithHiddenSelectedOptions;
