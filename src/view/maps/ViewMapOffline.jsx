import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import * as turf from "@turf/turf";
import _ from "lodash";
import {
  CircleMode,
  DirectMode,
  DragCircleMode,
  SimpleSelectMode,
} from "mapbox-gl-draw-circle";
import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { reactLocalStorage } from "reactjs-localstorage";
import mapboxgl from "vietmaps-gl";
import CameraService from "../../lib/camera";
import { updateAdminisUnitOnMap } from "../../redux/actions/map/adminisUnitsAction";
import { updateCameraOnMapByFilter } from "../../redux/actions/map/cameraActions";
import { setCamsLiveOnMap } from "../../redux/actions/map/camLiveAction";
import { updateMapObject } from "../../redux/actions/map/formMapActions";
import {
  deleteAllTrackingPoint,
  deleteOneTrackingPoint,
  setSelectedTrackingPoint,
} from "../../redux/actions/map/trackingPointActions";
import {
  CAM_LIVE_ITEMS,
  FORM_MAP_ITEM,
  LAT_LNG,
  MAP_STYLES,
  NAVIGATION_CONTROL,
  STYLE_MODE,
  TRACKING_POINTS,
  TYPE_CONTEXT_MENU,
  TYPE_FORM_ACTION_ON_MAP,
} from "../common/vms/constans/map";
import { cameraGreenIconSvg } from "../map/camera-green.icon";
import { cameraRedIconSvg } from "../map/camera-red.icon";
import { svg } from "../map/camera.icon";
import CamInfoPopup from "./CamInfoPopup";
import ContextMenuPopup from "./ContextMenuPopup";
import { AdminisUnitIconSvg } from "./icons/adminisUnit.icon";

const ViewMapOffline = (props) => {
  const { t } = useTranslation();
  const language = reactLocalStorage.get("language");

  useEffect(() => {
    if (
      language === "vn"
        ? (document.title = "VMS | Bản đồ")
        : (document.title = "VMS | Map")
    );
  }, [t]);
  const { addTrackingPoint, onContextMenuCallback, updateTrackingPoint } =
    props;

  const liveCameras = useSelector((state) => state.map.camera.listCamera); 
  const adminisUnitList = useSelector(
    (state) => state.map.adminisUnit.listAdminisUnit
  );
  const currentLatLngSelector = useSelector(
    (state) => state.map.trackingPoint.currentLang
  );
  const formMapSelector = useSelector((state) => state.map.form);

  const {
    listCamByTrackingPoint: camsByTrackPointSelector,
    trackingPoints: trackingPointSelector,
    selectedTrackPoint,
  } = useSelector((state) => state.map.trackingPoint);

  const image = new Image();
  const adminisUinitIcon = new Image();
  const cameraRedIcon = new Image();
  const cameraGreenIcon = new Image();
  image.src = "data:image/svg+xml;charset=utf-8;base64," + btoa(svg);
  adminisUinitIcon.src =
    "data:image/svg+xml;charset=utf-8;base64," + btoa(AdminisUnitIconSvg);
  cameraRedIcon.src =
    "data:image/svg+xml;charset=utf-8;base64," + btoa(cameraRedIconSvg);
  cameraGreenIcon.src =
    "data:image/svg+xml;charset=utf-8;base64," + btoa(cameraGreenIconSvg);

  // const mapContainerSelecttor = useSelector(state => state.map.contextMapReducer.mapContainer);
  const contextMenuPoppupRef = useRef();
  const mapboxRef = useRef(null);
  const popupAttachMarkerRef = useRef(null);
  const mapCamMarkersRef = useRef([]);
  const mapAdUnitMarkersRef = useRef([]);
  const mapMarkersRef = useRef([]);
  const mapMarkerTrackPointsRef = useRef([]);
  const markerTargetRef = useRef(null);
  const mapBoxDrawRef = useRef(null);
  const zoom = 14;
  const dispatch = useDispatch();
  const { editMode, selectedMapStyle, selectedPos } = formMapSelector;
  const [rmTrackingPoint, setRmTrackingPoint] = useState(false);
  const showTypeMapPopup =
    editMode && !rmTrackingPoint
      ? TYPE_CONTEXT_MENU[0]
      : rmTrackingPoint
      ? TYPE_CONTEXT_MENU[1]
      : TYPE_CONTEXT_MENU[2];

  const renderCameraIcon = (cam) => {
    if (cam.source === 1) {
      return cameraGreenIcon.src;
    }
    if (cam.recordingStatus === 0) {
      return cameraRedIcon.src;
    }
    return image.src;
  };

  const rendeAdminisUnitsIcon = (source) => {
    if (source) {
      return cameraRedIcon.src;
    }
    return adminisUinitIcon.src;
  };

  const notifyParent = (event) => {
    const feature = event.features[0];
    if (event.type === "draw.update") {
      feature &&
        feature.properties.isCircle &&
        updateTrackingPoint(feature, feature.id);
    } else if (event.type === "draw.create") {
      feature &&
        feature.properties.isCircle &&
        addTrackingPoint(feature, feature.id);
    }
  };

  //khởi tạo map
  const showViewMap = () => {
    try {
      mapboxgl.accessToken = process.env.REACT_APP_VIETMAP_TOKEN;
      if (!mapboxRef.current) {
        //khởi tạo map
        mapboxRef.current = new mapboxgl.Map({
          container: "map",
          style: MAP_STYLES[selectedMapStyle],
          hash: true,
          center: currentLatLngSelector ? currentLatLngSelector : LAT_LNG,
          zoom: zoom,
          attributionControl: false,
        });

        //thêm phần thanh công cụ zoom
        mapboxRef.current.addControl(
          new mapboxgl.NavigationControl({
            showCompass: false,
            showZoom: true,
          }),
          NAVIGATION_CONTROL
        );

        mapBoxDrawRef.current = new MapboxDraw({
          displayControlsDefault: false,
          userProperties: true,
          // defaultMode: "direct_select ",
          clickBuffer: 10,
          touchBuffer: 10,
          modes: {
            ...MapboxDraw.modes,
            draw_circle: CircleMode,
            simple_select: SimpleSelectMode,
            direct_select: DirectMode,
            drag_circle: DragCircleMode,
          },
        });

        // Add this draw object to the map when map loads
        // thêm phần control cho map: kéo, xoay map
        mapboxRef.current.addControl(mapBoxDrawRef.current);

        mapboxRef.current.on("draw.create", (e) => notifyParent(e));
        mapboxRef.current.on("draw.update", (e) => notifyParent(e));
        mapboxRef.current.on("draw.delete", (e) => notifyParent(e));
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleRemoveContextMenu = () => {
    contextMenuPoppupRef.current && contextMenuPoppupRef.current.remove();
  };

  const handleRemoveTrackingPoint = () => {
    if (selectedTrackPoint) {
      dispatch(deleteOneTrackingPoint(selectedTrackPoint));
      mapBoxDrawRef.current.delete(selectedTrackPoint.id);
      handleRemoveContextMenu();
      setRmTrackingPoint(false);
      const formMapObj = sessionStorage.getItem(FORM_MAP_ITEM)
        ? JSON.parse(sessionStorage.getItem(FORM_MAP_ITEM))
        : formMapSelector;
      sessionStorage.setItem(
        FORM_MAP_ITEM,
        JSON.stringify({ ...formMapObj, selectedPos: false })
      );
      dispatch(
        updateMapObject({
          ...formMapSelector,
          selectedPos: false,
        })
      );
    }
  };

  const onClickFirstItem = (type) => {
    switch (type) {
      case TYPE_CONTEXT_MENU[0]:
        handleAddCamera();
        break;
      case TYPE_CONTEXT_MENU[1]:
        handleRemoveTrackingPoint();
        break;
      case TYPE_CONTEXT_MENU[2]:
        handleAddTrackingPoint();

        break;
      default:
        console.log(type);
    }
  };

  const handleCreateFormObject = (type, data = null) => {
    const initialObject = {
      isOpenForm: true,
      editMode: true,
      actionType: type,
      selectedPos: data ? false : true,
      formEditting: data,
      isEditForm: data ? true : false,
      selectedMapStyle: STYLE_MODE.dark,
    };
    const formMapObj = sessionStorage.getItem(FORM_MAP_ITEM)
      ? JSON.parse(sessionStorage.getItem(FORM_MAP_ITEM))
      : formMapSelector;
    sessionStorage.setItem(
      FORM_MAP_ITEM,
      JSON.stringify({ ...formMapObj, ...initialObject })
    );
    dispatch(
      updateMapObject({
        ...formMapSelector,
        ...initialObject,
      })
    );
    handleRemoveContextMenu();
    handleClosePopup(type, data?.uuid);
  };

  const handleAddCamera = () => {
    handleCreateFormObject(TYPE_FORM_ACTION_ON_MAP.cam);
  };

  const handleAddAdminisUnit = () => {
    handleCreateFormObject(TYPE_FORM_ACTION_ON_MAP.ad_unit);
  };

  const handleAddTrackingPoint = () => {
    mapBoxDrawRef.current.changeMode("draw_circle", { initialRadiusInKm: 1 });
    handleRemoveContextMenu();
  };

  const handleRemoveAllTrackingPoint = () => {
    mapBoxDrawRef.current.deleteAll();
    dispatch(deleteAllTrackingPoint(selectedTrackPoint));
    handleRemoveContextMenu();
    setRmTrackingPoint(false);
    const formMapObj = sessionStorage.getItem(FORM_MAP_ITEM)
      ? JSON.parse(sessionStorage.getItem(FORM_MAP_ITEM))
      : formMapSelector;

    sessionStorage.setItem(
      FORM_MAP_ITEM,
      JSON.stringify({ ...formMapObj, selectedPos: false })
    );
    dispatch(
      updateMapObject({
        ...formMapSelector,
        selectedPos: false,
      })
    );
  };

  const onClickSecondItem = (type) => {
    switch (type) {
      case TYPE_CONTEXT_MENU[0]:
        handleAddAdminisUnit();
        break;
      case TYPE_CONTEXT_MENU[1]:
        handleRemoveAllTrackingPoint();
        break;
      case TYPE_CONTEXT_MENU[2]:
        handleRemoveAllTrackingPoint();
        break;
      default:
        console.log(type);
    }
  };

  const handleEditCam = (camInfo) => {
    handleCreateFormObject(TYPE_FORM_ACTION_ON_MAP.cam, camInfo);
  };

  const handleEditAdmisUnit = (adUnitInfo) => {
    handleCreateFormObject(TYPE_FORM_ACTION_ON_MAP.ad_unit, adUnitInfo);
  };

  const handleClosePopup = (type, slotId) => {
    type === TYPE_FORM_ACTION_ON_MAP.cam && CameraService.closeCamera(slotId);
    popupAttachMarkerRef.current && popupAttachMarkerRef.current.remove();
  };

  const handlePinCam = (type, camera) => {
    const allCamLive = sessionStorage.getItem(CAM_LIVE_ITEMS)
      ? JSON.parse(sessionStorage.getItem(CAM_LIVE_ITEMS))
      : [];
    const isCamExist = allCamLive.find(
      (camLive) => camLive.uuid === camera.uuid
    );
    if (!isCamExist) {
      dispatch(setCamsLiveOnMap({ ...camera, isPlay: false }));
    }
  };

  const showContextMenuPopup = (lngLat) => {
    const mapCardNode = document.createElement("div");
    mapCardNode.className = "map-popup-node";
    ReactDOM.render(
      <ContextMenuPopup
        trans={t}
        onClickFirstItem={onClickFirstItem}
        onClickSecondItem={onClickSecondItem}
        editMode={editMode}
        mapType={showTypeMapPopup}
      />,
      mapCardNode
    );
    contextMenuPoppupRef.current = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      anchor: "left",
      className: "control-popup-content",
    })
      .setLngLat(lngLat)
      .setDOMContent(mapCardNode)
      .addTo(mapboxRef.current);
  };

  const hanldeExposePopup = (el, popup, data = null) => {
    popup.on("open", (e) => {
      liveCameras.forEach((cam) => {
        data && CameraService.closeCamera(cam.uuid);
      });
      popupAttachMarkerRef.current = e.target;
      data &&
        CameraService.playCameraOnline(data, data.uuid).then((res) => {
          console.log(res);
        });
    });

    el.addEventListener("click", (e) => {
      if (markerTargetRef.current && markerTargetRef.current != e.target) {
        handleClosePopup();
      }
      markerTargetRef.current = e.target;
    });
  };

  const createMarkerCam = (listCam, markerRef) => {
    if (listCam.length > 0) {
      listCam.forEach((camera, index) => {
        if (_.inRange(camera.lat_, -90, 90)) {
          const el = document.createElement("div");
          el.className = "map-camera-marker-node";
          const img = document.createElement("img");
          img.setAttribute("data-imgCamId", camera.id);
          img.src = renderCameraIcon(camera);
          el.appendChild(img);
          const mapCardNode = document.createElement("div");
          mapCardNode.className = "map-popup-node  map-camera-popup-node";
          ReactDOM.render(
            <CamInfoPopup
              trans={t}
              type={TYPE_FORM_ACTION_ON_MAP.cam}
              editMode={editMode}
              dataDetailInfo={camera}
              onClosePopup={handleClosePopup}
              handleEditInfo={handleEditCam}
              handlePinCam={handlePinCam}
            />,
            mapCardNode
          );
          const popup = new mapboxgl.Popup({
            offset: 15,
            closeOnClick: false,
            className: "mapboxql-control-popup",
          }).setDOMContent(mapCardNode);
          const marker = new mapboxgl.Marker({ element: el, draggable: true })
            .setLngLat([camera.long_, camera.lat_])
            .setPopup(popup)
            .addTo(mapboxRef.current);
          marker.on("dragend", () =>
            handleDragEndMarker(marker, camera, TYPE_FORM_ACTION_ON_MAP.cam)
          );
          mapCamMarkersRef.current && mapCamMarkersRef.current.push(marker);
          markerRef.current && markerRef.current.push(marker);
          hanldeExposePopup(el, popup, camera);
        }
      });
    }
  };

  const displayMarkerCamOnMap = (listCam) => {
    createMarkerCam(listCam, mapMarkersRef);
  };

  const displayMarkerCamByTrackingPointOnMap = (listCam) => {
    createMarkerCam(listCam, mapMarkerTrackPointsRef);
  };

  const handleDragEndMarker = (marker, data, type) => {
    const lngLat = marker.getLngLat();
    const payload = {
      ...data,
      long_: lngLat.lng,
      lat_: lngLat.lat,
    };
    if (type === TYPE_FORM_ACTION_ON_MAP.ad_unit) {
      dispatch(updateAdminisUnitOnMap(payload));
    } else {
      dispatch(updateCameraOnMapByFilter(payload));
    }
  };

  const displayMarkerUnitsOnMap = () => {
    if (adminisUnitList.length) {
      adminisUnitList.forEach((unit, index) => {
        if (_.inRange(unit.lat_, -90, 90)) {
          const el = document.createElement("div");
          el.className = "map-unit-marker-node";
          const img = document.createElement("img");
          img.setAttribute("data-imgUnitId", unit.id);
          img.src = rendeAdminisUnitsIcon(unit.src);
          el.appendChild(img);
          const mapCardNode = document.createElement("div");
          mapCardNode.className = "map-popup-node map-unit-popup-node";
          ReactDOM.render(
            <CamInfoPopup
              trans={t}
              type={TYPE_FORM_ACTION_ON_MAP.ad_unit}
              editMode={editMode}
              dataDetailInfo={unit}
              onClosePopup={handleClosePopup}
              handleEditInfo={handleEditAdmisUnit}
            />,
            mapCardNode
          );
          let popup = new mapboxgl.Popup({
            offset: 10,
            closeOnClick: false,
            className: "mapboxql-control-popup",
          }).setDOMContent(mapCardNode);
          const marker = new mapboxgl.Marker({ element: el, draggable: true })
            .setLngLat([unit.long_, unit.lat_])
            .setPopup(popup)
            .addTo(mapboxRef.current);
          marker.on("dragend", () =>
            handleDragEndMarker(marker, unit, TYPE_FORM_ACTION_ON_MAP.ad_unit)
          );
          popup.on("open", (e) => {
            popupAttachMarkerRef.current = e.target;
          });
          mapAdUnitMarkersRef.current &&
            mapAdUnitMarkersRef.current.push(marker);
          hanldeExposePopup(el, popup);
        }
      });
    }
  };

  const handleAddLayer = () => {
    try {
      if (trackingPointSelector.length > 0) {
        trackingPointSelector.forEach((point, index) => {
          const FeatureCollection = {
            type: "FeatureCollection",
            features: [point.feature],
          };
          mapBoxDrawRef.current.add(FeatureCollection);
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const displayTrackingPointsOnMap = () => {
    if (mapboxRef.current) {
      if (mapboxRef.current.isStyleLoaded() && mapboxRef.current.loaded()) {
        handleAddLayer();
      } else {
        mapboxRef.current.on("load", function () {
          handleAddLayer();
        });
      }
    }
  };

  const calRatioZoom = (marker, currentZoom) => {
    const scalePercent = 1 + (currentZoom - 8) * 0.4;
    const svgElement = marker.getElement().children[0];
    svgElement.style.transform = `scale(${scalePercent})`;
    svgElement.style.transformOrigin = "bottom";
  };

  const handleControlZoomMarker = () => {
    const currentZoom = mapboxRef.current.getZoom();
    mapCamMarkersRef.current &&
      mapCamMarkersRef.current.forEach((marker) => {
        calRatioZoom(marker, currentZoom);
      });
    mapAdUnitMarkersRef.current &&
      mapAdUnitMarkersRef.current.forEach((marker) => {
        calRatioZoom(marker, currentZoom);
      });
  };
  useEffect(() => {
    showViewMap();
    mapboxRef.current &&
      mapboxRef.current.on("zoom", function () {
        handleControlZoomMarker();
      });
  }, []);

  useEffect(() => {
    mapboxRef.current.setStyle(MAP_STYLES[selectedMapStyle]);
  }, [selectedMapStyle]);

  const resetMarker = (marker) => {
    marker &&
      marker.forEach((data) => {
        data.remove();
      });
    marker = [];
  };

  useEffect(() => {
    resetMarker(mapMarkersRef.current);
    displayMarkerCamOnMap(liveCameras);
  }, [liveCameras]);

  useEffect(() => {
    resetMarker(mapMarkerTrackPointsRef.current);
    displayMarkerCamByTrackingPointOnMap(camsByTrackPointSelector);
  }, [camsByTrackPointSelector]);

  useEffect(() => {
    resetMarker(mapAdUnitMarkersRef.current);
    displayMarkerUnitsOnMap();
  }, [adminisUnitList]);

  useEffect(() => {
    displayTrackingPointsOnMap();
  });

  // const getDistanceBetweenPoint = (e) => {
  //   const options = {steps: 50, units: "kilometers", properties: {foo: "bar"}};
  //   const to = [e.lngLat.lng, e.lngLat.lat];
  //   const from = currentLatLngSelector;
  //   const distance = turf.distance(to ,from, options);
  // }

  const handleCheckDuplicate = (e, trackPointId) => {
    let isCheck = false;
    const trackingPointItems = localStorage.getItem(TRACKING_POINTS)
      ? JSON.parse(localStorage.getItem(TRACKING_POINTS))
      : [];
    isCheck = trackingPointItems.find((point) => point.id === trackPointId);
    if (isCheck) {
      dispatch(setSelectedTrackingPoint(isCheck));
      setRmTrackingPoint(true);
    } else {
      setRmTrackingPoint(false);
    }
    handleRemoveContextMenu();
    onContextMenuCallback(e);
  };

  useEffect(() => {
    if (contextMenuPoppupRef.current) {
      handleRemoveContextMenu();
      showContextMenuPopup(currentLatLngSelector);
    }
    mapboxRef.current &&
      mapboxRef.current.on("contextmenu", (e) => {
        const trackPointId = mapBoxDrawRef.current.getSelectedIds();
        handleCheckDuplicate(e, trackPointId[0]);
      });
  }, [showTypeMapPopup]);

  useEffect(() => {
    handleRemoveContextMenu();
    if (selectedPos) {
      showContextMenuPopup(currentLatLngSelector);
      mapboxRef.current.flyTo({
        center: currentLatLngSelector,
      });
    }
  }, [currentLatLngSelector, selectedPos]);

  useEffect(() => {
    mapboxRef.current.flyTo({
      center: currentLatLngSelector,
    });
  }, [currentLatLngSelector]);

  return <div key="map" id="map" className="view-map-offline"></div>;
};

export default ViewMapOffline;
