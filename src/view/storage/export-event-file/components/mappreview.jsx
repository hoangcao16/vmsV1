/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import mapboxgl from "vietmaps-gl";
import _ from "lodash";
import {
  CircleMode,
  DirectMode,
  DragCircleMode,
  SimpleSelectMode,
} from "mapbox-gl-draw-circle";
import Notification from "../../../../components/vms/notification/Notification";

import {
  LAT_LNG,
  MAP_STYLES,
  NAVIGATION_CONTROL,
  STYLE_MODE,
} from "../../../common/vms/constans/map";
import { useTranslation } from "react-i18next";
import { NOTYFY_TYPE } from "../../../common/vms/Constant";
import { cameraRedIconSvg } from "../../../map/camera-red.icon";

const PreviewMap = ({ data, fileCurrent, listLongLat }) => {
  const { t } = useTranslation();
  const mapboxRef = useRef(null);
  const mapBoxDrawRef = useRef(null);
  const mapCamMarkersRef = useRef([]);
  const mapAdUnitMarkersRef = useRef([]);
  const [currentLan, setCurrentLan] = useState(null);
  const zoom = 14;
  const cameraRedIcon = new Image();
  cameraRedIcon.src =
    "data:image/svg+xml;charset=utf-8;base64," + btoa(cameraRedIconSvg);
  //Vietmap Api Key
  const vietmapApiKey = process.env.REACT_APP_VIETMAP_APIKEY;
  //Tạo marker tọa độ hiện tại
  const createNewMarker = (data) => {
    if (_.inRange(data.lat_, -90, 90)) {
      var elem = document.querySelector(".map-camera-marker-node");
      if (elem) {
        elem.remove();
      }
      const el = document.createElement("div");
      el.className = "map-camera-marker-node";
      const img = document.createElement("img");
      img.setAttribute("data-imgCamId", data.id);
      img.src = cameraRedIcon.src;
      el.appendChild(img);
      const mapCardNode = document.createElement("div");
      mapCardNode.className = "map-popup-node  map-camera-popup-node";
      const marker = new mapboxgl.Marker({ element: el, draggable: true })
        .setLngLat([data.long_, data.lat_])
        .addTo(mapboxRef.current);
      marker.on("dragend", () => {
        Notification({
          type: NOTYFY_TYPE.warning,
          title: `${t("noti.view_mode")}`,
          description: `${t("noti.cannot_update_in_this_mode")}`,
        });
      });

      mapCamMarkersRef.current && (mapCamMarkersRef.current = marker);
      mapboxRef.current.resize();
      mapboxRef.current.flyTo({
        center: [data?.long_, data?.lat_],
      });
    } else {
      var elem = document.querySelector(".map-camera-marker-node");
      if (elem) {
        elem.remove();
      }
    }
  };
  const showViewMap = () => {
    try {
      //vietmap token
      mapboxgl.accessToken = process.env.REACT_APP_VIETMAP_TOKEN;
      if (!mapboxRef.current) {
        //khởi tạo map
        mapboxRef.current = new mapboxgl.Map({
          container: "map",
          style: MAP_STYLES[STYLE_MODE.normal],
          hash: true,
          center: currentLan ? currentLan : LAT_LNG,
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

        // mapboxRef.current.on('draw.create', (e) => notifyParent(e))
        // mapboxRef.current.on('draw.update', (e) => notifyParent(e))
        // mapboxRef.current.on('draw.delete', (e) => notifyParent(e))
      }
    } catch (error) {
      console.log(error);
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
      calRatioZoom(mapCamMarkersRef.current, currentZoom);
    mapAdUnitMarkersRef.current &&
      mapAdUnitMarkersRef.current.forEach((marker) => {
        calRatioZoom(marker, currentZoom);
      });
  };
  function addRoute(coords, waypoints) {
    // If a route is already loaded, remove it
    if (mapboxRef.current.getSource("route")) {
      mapboxRef.current.removeLayer("route");
      mapboxRef.current.removeSource("route");
    }
    // If a point is already loaded, remove it
    if (mapboxRef.current.getSource("allpoints")) {
      mapboxRef.current.removeLayer("allpoints");
      mapboxRef.current.removeSource("allpoints");
    }
    // add a layer for the route
    mapboxRef.current.addLayer({
      id: "route",
      type: "line",
      source: {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: coords,
        },
      },
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#03AA46",
        "line-width": 8,
        "line-opacity": 0.8,
      },
    });
    // add a layer for the points
    if (waypoints?.coordinates.length > 1) {
      mapboxRef.current.addSource("allpoints", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: waypoints?.coordinates.map((item) => {
            return {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: item,
              },
            };
          }),
        },
      });
      mapboxRef.current.addLayer({
        id: "allpoints",
        type: "circle",
        source: "allpoints",
        paint: {
          "circle-radius": 6,
          "circle-color": "#fff",
          "circle-stroke-color": "#00eb33",
          "circle-stroke-width": 2,
        },
        filter: ["==", "$type", "Point"],
      });
    }
  }
  // Make a Map Matching request
  async function getMatch(coordinates, profile) {
    // Create the query
    // const query = await fetch(
    //   `https://api.mapbox.com/directions/v5/mapbox/${profile}/${coordinates}?geometries=geojson&radiuses=${radiuses}&access_token=${mapboxToken}`,
    //   { method: "GET" }
    // );
    const query = await fetch(
      `https://maps.vietmap.vn/api/route?${coordinates}&instructions=false&type=json&locale=vi&apikey=${vietmapApiKey}&vehicle=${profile}&points_encoded=false&api-version=1.1`,
      { method: "GET" }
    );
    const response = await query.json();
    // Handle errors
    if (response.code !== "OK") {
      console.log(`${response.code} - ${response.message}.`);
      return;
    }
    // Get the coordinates from the response
    const coords = response.paths[0].points;
    const waypoints = response.paths[0].snapped_waypoints;
    // Draw the route on the map
    addRoute(coords, waypoints);
  }
  // Tạo map
  useEffect(() => {
    showViewMap();
    mapboxRef.current &&
      mapboxRef.current.on("zoom", function () {
        handleControlZoomMarker();
      });
  }, []);
  // Tạo marker khi chọn sự kiện
  useEffect(() => {
    setCurrentLan([data.long_, data.lat_]);
    createNewMarker(data);
  }, [data]);
  // Vẽ route khi truy vết sự kiện
  useEffect(() => {
    if (listLongLat.length > 1) {
      const newCoords = listLongLat
        .map((i) => `&point=${i.join(",")}`)
        .join("");
      getMatch(newCoords, "motorcycle");
    } else {
      if (mapboxRef.current.getSource("route")) {
        mapboxRef.current.removeLayer("route");
        mapboxRef.current.removeSource("route");
      }
      if (mapboxRef.current.getSource("allpoints")) {
        mapboxRef.current.removeLayer("allpoints");
        mapboxRef.current.removeSource("allpoints");
      }
    }
  }, [listLongLat]);
  return (
    <>
      <div key="map" id="map" className="view-map-preview"></div>
    </>
  );
};
export default PreviewMap;
