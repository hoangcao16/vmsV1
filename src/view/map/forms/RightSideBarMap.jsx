import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "antd/dist/antd.css";
import "../../../assets/scss/app-icons.scss";
import provinceApi from "../../../api/controller-api/provinceApi";
import { PAGE_SIZE } from "../../common/vms/Constant";
import { AdministrativeUnitType, CamType } from "../../../@core/common/common";
import MapAdminisUnitList from "./MapAdminisUnitList";
import MapPagination from "./MapPagination";
import Search from "../../../components/vms/search";
import MapCameraList from "./MapCameraList";
import HeaderRightSideBar from "./HeaderRightSideBar";
import MapFilter from "./MapFilter";
import "./RightSideBar.scss";
const RightSideBarMap = (props) => {
  const { listCamera: cameras, metadata: camMetadata } = useSelector(
    (state) => state.map.camera
  );
  const { listAdminisUnit: adUnits, metadata: adMetadata } = useSelector(
    (state) => state.map.adminisUnit
  );
  const { isLoading: isLoadingAdUnit } = useSelector(
    (state) => state.map.adminisUnit
  );
  const { isLoading: isLoadingMap } = useSelector((state) => state.map.camera);
  let {
    handleSelectCameraCallback,
    filter,
    handleApplyFilterCallback,
    handleSearch,
    handleNextPage,
    handleFocusCameraCallback,
    handleSelectAdUnitCallback,
    handleFocusAdUnitCallback,
    isOpenForm,
    filterType,
    searchValue,
  } = props;
  const [isCollapsedCameraList, setIsCollapsedCameraList] = useState(false);
  const [isOpennedCameraFilter, setIsOpennedCameraFilter] = useState(false);
  const [provinces, setProvinces] = useState(null);
  const [totalPage, setTotalPage] = useState(1);
  let [currentPage, setCurrentPage] = useState(1);
  const toggleCollapsedCameraList = () => {
    setIsCollapsedCameraList(!isCollapsedCameraList);
  };

  useEffect(() => {
    if (camMetadata && filterType == CamType) {
      const totalPage = Math.ceil(camMetadata.total / PAGE_SIZE);
      if (totalPage < 1) {
        setTotalPage(1);
      } else {
        setTotalPage(totalPage);
      }
      setCurrentPage(camMetadata.page);
    }
  }, [camMetadata, currentPage, filterType]);
  useEffect(() => {
    if (adMetadata && filterType == AdministrativeUnitType) {
      const totalPage = Math.ceil(adMetadata.total / PAGE_SIZE);
      if (totalPage < 1) {
        setTotalPage(1);
      } else {
        setTotalPage(totalPage);
      }
      setCurrentPage(adMetadata.page);
    }
  }, [adMetadata, filterType]);

  const toggleOpennedCameraFilter = () => {
    setIsOpennedCameraFilter(!isOpennedCameraFilter);
  };

  const handleApplyFilterCallback1 = (data, type) => {
    handleApplyFilterCallback(data, type);
  };
  const onPressEnter = (searchValue) => {
    handleSearch(searchValue);
  };

  const handleSelectPreviousPage = () => {
    if (currentPage === 1) {
      setCurrentPage(1);
      return;
    } else {
      setCurrentPage(--currentPage);
    }
    handleNextPage(currentPage);
  };
  const handleSelectNextPage = () => {
    if (currentPage === totalPage) {
      return;
    }
    setCurrentPage(++currentPage);
    handleNextPage(currentPage);
  };

  useEffect(() => {
    provinceApi.getAll().then((data) => {
      if (data && data.payload) setProvinces(data.payload);
    });
  }, []);

  return (
    <div
      className={
        "camera-list right-sidebar-map position-absolute d-flex flex-column" +
        (isCollapsedCameraList ? " collapsed" : "")
      }
    >
      <HeaderRightSideBar
        toggleCollapsedCameraList={toggleCollapsedCameraList}
      />
      <Search
        searchValue={searchValue}
        onPressEnter={onPressEnter}
        toggleOpenFilter={toggleOpennedCameraFilter}
      />
      {filterType === CamType ? (
        <MapCameraList
          cameras={cameras}
          handleSelectCameraCallback={handleSelectCameraCallback}
          handleFocusCameraCallback={handleFocusCameraCallback}
          isOpenForm={isOpenForm}
          isLoading={isLoadingMap}
        />
      ) : (
        <MapAdminisUnitList
          adUnits={adUnits}
          handleSelectAdUnitCallback={handleSelectAdUnitCallback}
          handleFocusAdUnitCallback={handleFocusAdUnitCallback}
          isOpenForm={isOpenForm}
          isLoading={isLoadingAdUnit}
        />
      )}
      <MapPagination
        currentPage={currentPage}
        totalPage={totalPage}
        handleSelectNextPage={handleSelectNextPage}
        handleSelectPreviousPage={handleSelectPreviousPage}
        isLoading={isLoadingMap || isLoadingAdUnit}
      />
      <MapFilter
        handlerToggleFilter={toggleOpennedCameraFilter}
        isOpen={isOpennedCameraFilter}
        provinces={provinces}
        handleApplyFilterCallback={handleApplyFilterCallback1}
        filter={filter}
      />
    </div>
  );
};

export default RightSideBarMap;
