import { Button, Input, Tag, Tooltip } from "antd";
import React from "react";
import { connect } from "react-redux";
import { reactLocalStorage } from "reactjs-localstorage";
import { loadCameraTags } from "./redux/actions/listCameraTagsAction";
import SelectWithHiddenSelectedOptions from "./SelectTag";
class EditableTagGroup extends React.Component {
  state = {
    tags: JSON.parse(localStorage.getItem("tags")) || [],
    inputVisible: false,
    inputValue: "",
    isShowSuggestions: false,
    isEdit: true,
    addonValue: "",
  };

  escFunction = (event) => {
    if (event.keyCode === 27 && this.state.inputValue === "#") {
      this.setState({ isShowSuggestions: false, inputValue: "" });
    }
  };

  componentDidMount() {
    this.props.callDataCameraTag(this.state.tags);
    document.addEventListener("keydown", this.escFunction, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.escFunction, false);
  }

  handleClose = (removedTag) => {
    const tags = this.state.tags.filter((tag) => tag !== removedTag);
    localStorage.setItem("tags", JSON.stringify(tags));
    this.setState({ tags }, this.props.callDataCameraTag(tags));
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange = (e) => {
    const value = e.target.value;
    if (value.slice(0, 1) === "#") {
      e.stopPropagation();
      this.setState({
        isShowSuggestions: true,
        inputValue: value.trimStart(),
      });
      return;
    }

    this.setState({ inputValue: value.trimStart(), isShowSuggestions: false });
  };

  handleInputConfirm = () => {
    const state = this.state;
    const inputValue = state.addonValue + " " + state.inputValue;
    let tags = state.tags;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue.trim()];
    }

    localStorage.setItem("tags", JSON.stringify(tags));

    //call data

    this.props.callDataCameraTag(tags);
    this.setState({
      tags,
      inputVisible: false,
      inputValue: "",
      isShowSuggestions: false,
      isEdit: true,
      addonValue: "",
    });
  };

  saveInputRef = (input) => (this.input = input);

  handlePickData = (value) => {
    this.setState({
      inputValue: "",
      isShowSuggestions: false,
      isEdit: false,
      addonValue: value,
    });
  };

  render() {
    const {
      tags,
      inputVisible,
      inputValue,
      isShowSuggestions,
      isEdit,
      addonValue,
    } = this.state;

    const lang = reactLocalStorage.get("language");
    return (
      <>
        <div
          style={{
            height: "100%",
            width: "100%",
            position: "relative",
            overflow: "auto",
          }}
        >
          {tags.map((tag, index) => {
            const isLongTag = tag.length > 20;
            const tagElem = (
              <Tag
                key={tag}
                closable
                afterClose={() => this.handleClose(tag)}
                onClose={(e) => {
                  e.preventDefault();
                  this.handleClose(tag);
                }}
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
              style={{ width: "70%", height: "100%" }}
              value={inputValue}
              onChange={this.handleInputChange}
              onPressEnter={this.handleInputConfirm}
              addonBefore={!isEdit ? addonValue : null}
              maxLength={255}
              disabled={isShowSuggestions}
            />
          )}

          {!inputVisible && (
            <Button
              size="small"
              type="dashed"
              onClick={this.showInput}
              style={{ height: "100%" }}
            >
              {lang == "vn" ? "+ Nhãn mới" : "+ New Tag"}
            </Button>
          )}
        </div>
        {isShowSuggestions && (
          <div style={{ marginTop: "4px" }}>
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

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => {
  return {
    callDataCameraTag: (data) => {
      dispatch(loadCameraTags(data));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditableTagGroup);
