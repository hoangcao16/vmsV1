import { SearchOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import { isEmpty } from "lodash";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import EditableTagGroup from "./EditableTagGroup";

const SearchCamItem = (props) => {
  const {t } = useTranslation()
  const searchCamRef = useRef(null);
  const [expandSearch, setExpandSearch] = useState(false);
  const handleExpandSearchBar = () => {
    searchCamRef.current && searchCamRef.current.classList.toggle("active");
    setExpandSearch(!expandSearch);
  };

  const handleFocusCameraCallback = (camera) => {
    props.handleFocusCameraCallback(camera);
  };

  return (
    <div ref={searchCamRef} className="search-cam-item">
      <div className="search-box">
        {expandSearch && <EditableTagGroup />}
        <div className="search-icon" onClick={handleExpandSearchBar}>
          <Tooltip
            placement="top"
            title={t("view.user.detail_list.search_mode")}
            arrowPointAtCenter={true}
          >
            <SearchOutlined />
          </Tooltip>
        </div>
      </div>
      {!isEmpty(props.cameraTags) && (
        <div className="list-data-search">
          <ul>
            {props.cameraTags.map((camera, index) => {
              return (
                <li
                  key={index}
                  onClick={() => handleFocusCameraCallback(camera)}
                >
                  {camera.name}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  cameraTags: state.quickSearch.cameraTags,
});

const mapDispatchToProps = (dispatch) => {};

export default connect(mapStateToProps, mapDispatchToProps)(SearchCamItem);
