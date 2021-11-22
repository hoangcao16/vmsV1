import "antd/dist/antd.css";
import React, { useEffect, useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { useTranslation } from "react-i18next";
import provinceApi from "../../api/controller-api/provinceApi";
import "../../assets/scss/app-icons.scss";
import Search from "../../components/vms/search";
import { PAGE_SIZE } from "../common/vms/Constant";
import { svg } from "../map/camera.icon";
import MapCamItem from "../map/forms/MapCamItem";
import MapFilter from "../map/forms/MapFilter";
import MapPagination from "../map/forms/MapPagination";

// Create an image for the Layer`
const image = new Image();
image.src = "data:image/svg+xml;charset=utf-8;base64," + btoa(svg);

const DraggableCameraList = (props) => {
  let {
    cameras,
    totalCameras,
    search,
    handleSelectCameraCallback,
    filter,
    handleApplyFilterCallback,
    handleSearch,
    handleNextPage,
  } = props;
  const { t } = useTranslation();
  const [isCollapsedCameraList, setIsCollapsedCameraList] = useState(true);
  const [isOpennedCameraFilter, setIsOpennedCameraFilter] = useState(false);
  const [provinces, setProvinces] = useState(null);

  const toggleCollapsedCameraList = () => {
    setIsCollapsedCameraList(isCollapsedCameraList ? false : true);
  };

  const toggleOpennedCameraFilter = () => {
    setIsOpennedCameraFilter(isOpennedCameraFilter ? false : true);
  };

  const handleSelectCamera = (camera, index) => {
    handleSelectCameraCallback(camera, index);
  };

  const handleApplyFilterCallback1 = (data) => {
    handleApplyFilterCallback(data);
  };
  const onPressEnter = (searchValue) => {
    handleSearch(searchValue);
  };

  const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    display: "inline-block",
    minWidth: "100px",
    border: isDragging ? "dashed 1px #eee" : 0,
    borderRadius: isDragging ? "3px" : 0,
    backgroundColor: isDragging ? "#eee" : "",
    backgroundImage: isDragging ? `url(${image.src})` : "",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "2px 0px",
    paddingLeft: isDragging ? "25px" : 0,
    width: "100%",
    // styles we need to apply on draggables
    ...draggableStyle,
  });

  const totalPage = Math.ceil(totalCameras / PAGE_SIZE);
  let [currentPage, setCurrentPage] = useState(1);

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

  const buildDraggableId = (camera) => {
    return camera.uuid + "_" + camera.name + "_" + camera.id;
  };
  return (
    <div
      className={
        "camera-list position-absolute d-flex flex-column" +
        (isCollapsedCameraList ? " collapsed" : "")
      }
    >
      <a className="toggle-collapse" onClick={toggleCollapsedCameraList} />
      <div className="camera-list__header">
        <a className="toggle-collapse" onClick={toggleCollapsedCameraList} />
        <h5>
          <i className="app-icon icon-camera-list" />
          {t("view.camera.camera_list", { cam: t("camera") })}
        </h5>
      </div>
      <Search
        searchValue={search}
        onPressEnter={onPressEnter}
        toggleOpenFilter={toggleOpennedCameraFilter}
      />
      <Droppable droppableId="droppable-camera-list">
        {(provided, snapshot) => (
          <ul
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="mt-1 list-unstyled border h-100"
          >
            {cameras?.map((camera, index) => (
              <li key={index}>
                <Draggable
                  key={camera.uuid}
                  draggableId={buildDraggableId(camera)}
                  index={index}
                  style={{ with: "100%" }}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                      className="draggable-cam-item"
                    >
                      <MapCamItem
                        isControlCam={false}
                        camera={camera}
                        handleSelectCamera={handleSelectCamera}
                      />
                    </div>
                  )}
                </Draggable>
              </li>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
      <MapPagination
        currentPage={currentPage}
        totalPage={totalPage}
        handleSelectNextPage={handleSelectNextPage}
        handleSelectPreviousPage={handleSelectPreviousPage}
      />

      <MapFilter
        handlerToggleFilter={toggleOpennedCameraFilter}
        isOpen={isOpennedCameraFilter}
        provinces={provinces}
        handleApplyFilterCallback={handleApplyFilterCallback1}
        filter={filter}
        isShowRadioGroupChangeMode={false}
      />
    </div>
  );
};

export default DraggableCameraList;
