import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import "../../assets/scss/pages/map.scss";
import { svg } from "../map/camera.icon";
import { buildingIcon } from "../map/adminisUnit.icon";
import { cameraRedIconSvg } from "../map/camera-red.icon";
import MapCameraAdd from "../map/forms/MapCameraAdd";
import { PAGE_SIZE } from "../common/vms/Constant";
import {
    FORM_MAP_ITEM,
    STYLE_MODE,
    TRACKING_POINTS,
    TYPE_FORM_ACTION_ON_MAP,
} from "../common/vms/constans/map";
import { CamType } from "../../@core/common/common";
import MapAdministrativeUnitAdd from "../map/forms/MapAdministrativeUnitAdd";
import mapActions from "../../redux/actions/map";
import ControlMapStyles from "./ControlMapStyles";
import ToggleMapMode from "./ToggleMapMode";
import ViewMapOffline from "./ViewMapOffline";
import LiveAndPlaybackCam from "./LiveAndPlaybackCam";
import {
    addNewTrackingPoint,
    updateCurrentLang,
    updateTrackingPointAction,
} from "../../redux/actions/map/trackingPointActions";
import {
    updateMapObject,
    setMapStyle
} from "../../redux/actions/map/formMapActions";
import {
    addCameraOnMap,
    updateCameraOnMapByFilter,
} from "../../redux/actions/map/cameraActions";

import {
    seekPlaybackOnMap,
} from "../../redux/actions/map/camLiveAction";
import {
    addAdminisUnitOnMap,
    updateAdminisUnitOnMap,
} from "../../redux/actions/map/adminisUnitsAction";
import RightSideBarMap from "../map/forms/RightSideBarMap";
import MapListCamLive from "../map/forms/MapListCamLive";
import PlaybackDateTimeSelection from "./PlaybackDateTimeSelection";
import SearchCamItem from "./SearchCamItem";

const RelativeWrapper = styled.div`
  position: relative;
`;

const Maps = (props) => {
    // Create an image for the Layer`
    const image = new Image();
    const adminisUinitIcon = new Image();
    const cameraRedIcon = new Image();
    image.src = "data:image/svg+xml;charset=utf-8;base64," + btoa(svg);
    adminisUinitIcon.src =
        "data:image/svg+xml;charset=utf-8;base64," + btoa(buildingIcon);
    cameraRedIcon.src =
        "data:image/svg+xml;charset=utf-8;base64," + btoa(cameraRedIconSvg);

    // selector data from store
    const camerasOnMap = useSelector((state) => state.map.camera);
    const adminisUnitsOnMap = useSelector((state) => state.map.adminisUnit);
    const trackingPointSelector = useSelector(
        (state) => state.map.trackingPoint.trackingPoints
    );
    const currentLatLngtSelector = useSelector(
        (state) => state.map.trackingPoint.currentLang
    );
    const formMapSelector = useSelector((state) => state.map.form);
    const {
        editMode,
        selectedMapStyle,
        selectedPos,
        formEditting,
        isOpenForm,
        actionType,
        isEditForm,
    } = formMapSelector;

    // dispatch action
    const {
        fetchAllCameraOnMap,
        fetchAllAdminisUnits,
        updateCameraOnMapByTrackingPoint,
    } = mapActions;
    const dispatch = useDispatch();

    const trackingPointsRef = useRef([])

    // declare state component
    const [liveMode, setLiveMode] = useState(true);
    const [radiusTrackingPoint, setRadiusTrackingPoint] = useState(1);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState({});
    const [filterType, setFilterType] = useState(CamType);
    const metadata = {
        page: 1,
        pageSize: PAGE_SIZE
    }
    const [camMetadata, setCamMetadata] = useState(metadata);
    const [adMetadata, setAdMetadata] = useState(metadata);

    const handleStyleChange = (e) => {
        dispatch(setMapStyle(e.target.value));
        sessionStorage.setItem(
            FORM_MAP_ITEM,
            JSON.stringify({ ...formMapSelector, selectedMapStyle: e.target.value })
        );
    };

    const toggleEditMode = () => {
        const { editMode } = formMapSelector;
        const isEditMode = editMode ? false : true;
        const mapStyle = !isEditMode ? STYLE_MODE.normal : STYLE_MODE.dark;
        const formMapObject = {
            ...formMapSelector,
            editMode: isEditMode,
            selectedMapStyle: mapStyle,
            isEditForm: false,
            isOpenForm: false,
            formEditting: null,
            actionType: "",
        };
        sessionStorage.setItem(FORM_MAP_ITEM, JSON.stringify(formMapObject));
        dispatch(updateMapObject(formMapObject));
    };

    const handleApplyFilterCallback = async (filter, type) => {
        setFilterType(type);
        setFilter(filter);
    };

    const fetchCameras = async (
        filter,
        searchCamera,
        pageSize = PAGE_SIZE,
        currentPage = 1
    ) => {
        if (filter != null) {
            filter.name = searchCamera;
            filter.size = pageSize;
            filter.page = currentPage;
        } else {
            filter = {
                page: currentPage,
                size: pageSize,
                locationOnMap: 1,
            };
        }
        dispatch(fetchAllCameraOnMap({ params: filter }));
    };



    const handleSearch = async (searchQuery) => {
        setSearch(searchQuery);
        if (filterType == CamType) {
            setCamMetadata(metadata)
        } else {
            setAdMetadata(metadata)
        }
    };

    const handleSelectCameraCallback = (cam, _) => {
        if (isOpenForm && actionType === TYPE_FORM_ACTION_ON_MAP.cam) {
            const formMapObj = sessionStorage.getItem(FORM_MAP_ITEM)
                ? JSON.parse(sessionStorage.getItem(FORM_MAP_ITEM))
                : formMapSelector;
            formMapObj.selectedPos = false;
            formMapObj.formEditting = {
                ...cam,
                cameraUrl:
                    isEditForm && formEditting ? formEditting.cameraUrl : cam.cameraUrl,
            };
            sessionStorage.setItem(FORM_MAP_ITEM, JSON.stringify({ ...formMapObj }));
            dispatch(updateMapObject({ ...formMapObj }));
        }
    };

    const handleSelectAdUnitCallback = (adUnit, _) => {
        if (isOpenForm && actionType === TYPE_FORM_ACTION_ON_MAP.ad_unit) {
            const formMapObj = sessionStorage.getItem(FORM_MAP_ITEM)
                ? JSON.parse(sessionStorage.getItem(FORM_MAP_ITEM))
                : formMapSelector;
            formMapObj.selectedPos = false;
            formMapObj.formEditting = {
                ...adUnit,
            };
            sessionStorage.setItem(FORM_MAP_ITEM, JSON.stringify({ ...formMapObj }));
            dispatch(updateMapObject({ ...formMapObj }));
        }
    };

    const handleFocusCameraCallback = (cam) => {
        if (cam) {
            dispatch(updateCurrentLang([cam.long_, cam.lat_]));
        }
    };

    const handleFocusAdUnitCallback = (adUnit) => {
        if (adUnit) {
            dispatch(updateCurrentLang([adUnit.long_, adUnit.lat_]));
        }
    };

    const fetchAdministrativeUnits = async (
        filter,
        searchAdminisUnit,
        pageSize = PAGE_SIZE,
        currentPage = 1
    ) => {
        if (filter != null) {
            filter.name = searchAdminisUnit;
            filter.size = pageSize;
            filter.page = currentPage;
        } else {
            filter = {
                page: currentPage,
                size: pageSize,
                locationOnMap: 1, //all
            };
        }
        dispatch(fetchAllAdminisUnits({ params: filter }));
    };

    const handleSumitCameraCallback = async (payload) => {
        if (isEditForm) {
            dispatch(updateCameraOnMapByFilter(payload));
        } else {
            dispatch(addCameraOnMap(payload));
        }
    }

    const handleSumitAdminisUnitCallback = async (payload) => {
        if (isEditForm) {
            dispatch(updateAdminisUnitOnMap(payload));
        } else {
            dispatch(addAdminisUnitOnMap(payload));
        }
    };

    const handleSubmitCallback = (payload) => {
        if (actionType == TYPE_FORM_ACTION_ON_MAP.cam) {
            handleSumitCameraCallback(payload).then((r) => console.log(r));
        } else {
            handleSumitAdminisUnitCallback(payload).then((r) => console.log(r));
        }
    };

    const handleNextPageCallback = async (currentPage) => {
        if (filterType == CamType) {
            setCamMetadata({
                ...camMetadata,
                page: currentPage
            })
        } else {
            setAdMetadata({
                ...adMetadata,
                page: currentPage
            })
        }
    };


    const handleChaneModePlayCam = (mode) => {
        setLiveMode(mode);
    };

    const fetchCameraByTrackingPoint = async (long, lat, id, type) => {
        const filterTrackingPoint = {
            points: [{
                pointLat: lat,
                pointLong: long
            }],

            minDistance: 0,
            maxDistance: radiusTrackingPoint * 1000,
        };
        dispatch(updateCameraOnMapByTrackingPoint({ body: filterTrackingPoint, id,  type}));
    };

    const addTrackingPoint = (feature, id) => {
        let newTrackingPoints = localStorage.getItem(TRACKING_POINTS)
            ? JSON.parse(localStorage.getItem(TRACKING_POINTS))
            : [];
        const trackingPoint = {
            id: id,
            feature: feature
        }
        newTrackingPoints.push(trackingPoint);
        dispatch(addNewTrackingPoint(trackingPoint));
        localStorage.setItem(TRACKING_POINTS, JSON.stringify(newTrackingPoints));
        const formMapObj = sessionStorage.getItem(FORM_MAP_ITEM)
            ? JSON.parse(sessionStorage.getItem(FORM_MAP_ITEM))
            : formMapSelector;
        formMapObj.selectedPos = false;
        dispatch(
            updateMapObject({
                ...formMapSelector,
                selectedPos: false,
            })
        );
        sessionStorage.setItem(FORM_MAP_ITEM, JSON.stringify({ ...formMapObj }));
        fetchCameraByTrackingPoint(
            feature.properties.center[0],
            feature.properties.center[1],
            id,
            'create'
        );
    };

    const updateTrackingPoint = (feature, id) => {
        const trackingPoint = {
            id: id,
            feature: feature
        }
        dispatch(updateTrackingPointAction(trackingPoint));
        fetchCameraByTrackingPoint(
            feature.properties.center[0],
            feature.properties.center[1],
            id,
            'update'
        );
    };

    const onContextMenuCallback = (e) => {
        const formMapObj = sessionStorage.getItem(FORM_MAP_ITEM)
            ? JSON.parse(sessionStorage.getItem(FORM_MAP_ITEM))
            : formMapSelector;
        dispatch(updateCurrentLang([e.lngLat.lng, e.lngLat.lat]));
        if (!formMapObj.selectedPos) {
            dispatch(
                updateMapObject({
                    ...formMapSelector,
                    ...formMapObj,
                    selectedPos: true,
                })
            );
            formMapObj.selectedPos = true;
            sessionStorage.setItem(FORM_MAP_ITEM, JSON.stringify({ ...formMapObj }));
        }
    };

    useEffect(() => {
        if(filterType === CamType) {
            fetchCameras(filter, search, PAGE_SIZE, camMetadata.page);
        } else {
            fetchAdministrativeUnits(filter, search, PAGE_SIZE, adMetadata.page)
        }
    }, [filter, search, filterType, camMetadata, adMetadata]);


    useEffect(() => {
        for (const trackPoint of trackingPointSelector) {
            if (trackingPointsRef.current.indexOf(trackPoint.id) < 0 && trackPoint.feature && trackPoint.feature.properties && trackPoint.feature.properties.center) {
                fetchCameraByTrackingPoint(
                    trackPoint.feature.properties.center[0],
                    trackPoint.feature.properties.center[1],
                    'create'
                );
                trackingPointsRef.current.push(trackPoint.id);
            }
        }
    }, [])

    const playbackCameraSeekTimeCallback = (seekTime) => {
        dispatch(seekPlaybackOnMap(seekTime))
    }
    return (
        <RelativeWrapper className="map-wrapper overflow-hiddens">
            <div className="map__setting-map">
                {!editMode && <ControlMapStyles onChange={handleStyleChange} />}
                <ToggleMapMode editMode={editMode} toggleEditMode={toggleEditMode} />
                <SearchCamItem />
            </div>
            <ViewMapOffline
                addTrackingPoint={addTrackingPoint}
                updateTrackingPoint={updateTrackingPoint}
                onContextMenuCallback={onContextMenuCallback}
                liveMode={liveMode}
            />
            {isOpenForm && actionType === TYPE_FORM_ACTION_ON_MAP.cam && (
                <>
                    <MapCameraAdd
                        initialLatLgn={currentLatLngtSelector}
                        editCam={formEditting}
                        handleSubmitCallback={handleSubmitCallback}
                        selectNewPosition={selectedPos}
                        isEditForm={isEditForm}
                    />
                </>
            )}
            {isOpenForm && actionType === TYPE_FORM_ACTION_ON_MAP.ad_unit && (
                <>
                    <MapAdministrativeUnitAdd
                        initialLatLgn={currentLatLngtSelector}
                        editAdminisUnit={formEditting}
                        handleSubmitCallback={handleSubmitCallback}
                        selectNewPosition={selectedPos}
                    />
                </>
            )}
            <RightSideBarMap
                filterType={filterType}
                handleSearch={handleSearch}
                searchValue={search}
                handleApplyFilterCallback={handleApplyFilterCallback}
                handleSelectCameraCallback={handleSelectCameraCallback}
                handleSelectAdUnitCallback={handleSelectAdUnitCallback}
                handleFocusAdUnitCallback={handleFocusAdUnitCallback}
                handleNextPage={handleNextPageCallback}
                isEditMode={editMode}
                handleFocusCameraCallback={handleFocusCameraCallback}
                selectedMapStyle={selectedMapStyle}
                isOpenForm={isOpenForm}
            />

            <MapListCamLive liveMode={liveMode} />

            <div className="mode-container">
                {!liveMode && <PlaybackDateTimeSelection
                    playbackCameraSeekTimeCallback={playbackCameraSeekTimeCallback} />}
                <LiveAndPlaybackCam
                    onChaneModePlayCam={handleChaneModePlayCam}
                    liveMode={liveMode}
                />
            </div>

        </RelativeWrapper>
    );
};

export default Maps;
