import { Button, Input, Tag, Tooltip } from "antd";
import React from "react";
import SelectWithHiddenSelectedOptions from "./SelectTag";
class EditableTagGroup extends React.Component {
  state = {
    tags: [],
    inputVisible: false,
    inputValue: "",
    isShowSuggestions: false,
  };

  handleClose = (removedTag) => {
    const tags = this.state.tags.filter((tag) => tag !== removedTag);
    this.setState({ tags });
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange = (e) => {
    const value = e.target.value;
    if (value.slice(0, 1) === "#") {
      e.stopPropagation()
      this.setState({
        isShowSuggestions: true,
        inputValue: value,
      });
      return;
    }

    this.setState({ inputValue: value, isShowSuggestions: false });
  };

  handleInputConfirm = () => {
    const state = this.state;
    const inputValue = state.inputValue;
    let tags = state.tags;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    this.setState({
      tags,
      inputVisible: false,
      inputValue: "",
      isShowSuggestions: false,
    });
  };

  saveInputRef = (input) => (this.input = input);
  handlePickData = (value) => {
    this.setState({
      inputValue: value,
      isShowSuggestions: false,
    });
  };

  render() {
    const { tags, inputVisible, inputValue, isShowSuggestions } = this.state;
    return (
      <>
        <div style={{ height: "100%",  position: "relative" ,overflow: "auto"  }}>
          {tags.map((tag, index) => {
            const isLongTag = tag.length > 20;
            const tagElem = (
              <Tag
                key={tag}
                closable
                afterClose={() => this.handleClose(tag)}
              >
                {isLongTag ? `${tag.slice(0, 20)}...` : tag}
              </Tag>
            );
            return isLongTag ? (
              <Tooltip title={tag} key={tag}>
                {tagElem}
              </Tooltip>
            ) : (
              tagElem
            );
          })}
          {inputVisible && (
            <Input
              ref={this.saveInputRef}
              type="text"
              size="small"
              style={{ width: "70%",height:'100%'}}
              value={inputValue}
              onChange={this.handleInputChange}
              // onBlur={this.handleInputConfirm}
              onPressEnter={this.handleInputConfirm}
            />
          )}

          {!inputVisible && (
            <Button size="small" type="dashed" onClick={this.showInput}>
              + New Tag
            </Button>
          )}
        </div>
        {isShowSuggestions && (
          <div style={{ position: "absolute", width: "100%",top:50 }}>
            <SelectWithHiddenSelectedOptions
              handlePickData={this.handlePickData}
              allTags={tags}
            />
          </div>
        )}
      </>
    );
  }
}

export default EditableTagGroup;
