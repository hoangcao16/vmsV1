import { SearchOutlined } from "@ant-design/icons";
import React, { useRef, useState } from "react";
import EditableTagGroup from "./EditableTagGroup";

const SearchCamItem = () => {
  const searchCamRef = useRef(null);
  const [expandSearch, setExpandSearch] = useState(false);
  const handleExpandSearchBar = () => {
    searchCamRef.current && searchCamRef.current.classList.toggle("active");
    setExpandSearch(!expandSearch);
  };
  return (
    <div ref={searchCamRef} className="search-cam-item">
      <div className="search-box">
        <div className="input-box">
          <input type="text" placeholder="Search...." > 
         
          </input>
        </div>
        <div className="search-icon" onClick={handleExpandSearchBar}>
          <SearchOutlined />
        </div>
      </div>
      <EditableTagGroup />

      {
        <div className="list-data-search">
          <ul>
            <li>hungng</li>
            <li>hungng</li>
            <li>hungng</li>
            <li>hungng</li>
            <li>hungng</li>
          </ul>
        </div>
      }
    </div>
  );
};

export default SearchCamItem;
