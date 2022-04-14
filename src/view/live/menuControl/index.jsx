import { AutoComplete, Modal } from "antd";
import { debounce, isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { ChevronRight } from "react-feather";
import { useTranslation } from "react-i18next";
import { connect, useDispatch } from "react-redux";
import permissionCheckByCamera from "../../../actions/function/MyUltil/PermissionCheckByCamera";
import ptzControllerApi from "../../../api/ptz/ptzController";
import Notification from "../../../components/vms/notification/Notification";
import { openModalPresetSetting } from "../../../redux/actions/live/openModalPresetSetting";
import { NOTYFY_TYPE } from "../../common/vms/Constant";
import Preset from "../../preset/Preset";
import ItemControl from "./ItemControl";
// import { Modal, Button } from 'antd';
import ModalControlPanel from "./ModalControlPanel";
import "./ModalPresetSetting.scss";
import cameraAIApi from "../../../actions/api/live/CameraAIApi";
import { reactLocalStorage } from "reactjs-localstorage";
import { UPDATE_DATA } from "../../../redux/types/live";

const language = reactLocalStorage.get("language");

const LIST_TYPES = {
  preset: "preset",
  presetTour: "presetTour",
  viewSetting: "viewSetting",
  other: "other",
};

const Index = (props) => {
  const {
    isOpenModal,
    setCurrentMenuControl,
    slotId,
    idCamera,
    setReloadLiveMenuTool,
    reloadLiveMenuTool,
    isOpenModalControlPanel,
    setIsOpenModalControlPanel,
    changeLiveMode,
    setTypeAICamera,
  } = props;
  const { t } = useTranslation();
  let CONTROL_TYPES = [];
  if (
    permissionCheckByCamera("setup_preset", idCamera) &&
    permissionCheckByCamera("ptz_control", idCamera)
  ) {
    CONTROL_TYPES = [
      {
        name: "Preset",
        type: 1,
        icon: <ChevronRight />,
      },
      {
        name: "Preset tour",
        type: 2,
        icon: <ChevronRight />,
      },
      {
        name: `${t("view.live.preset_setting")}`,
        type: 3,
      },
      { name: `${t("view.live.open_control_panel")}`, type: 4 },
      { name: `${t("view.live.view_by_setting")}`, type: 5 },
    ];
  } else if (!permissionCheckByCamera("setup_preset", idCamera)) {
    CONTROL_TYPES = [
      {
        name: "Preset",
        type: 1,
        icon: <ChevronRight />,
      },
      {
        name: "Preset tour",
        type: 2,
        icon: <ChevronRight />,
      },
      { name: `${t("view.live.open_control_panel")}`, type: 4 },
      { name: `${t("view.live.view_by_setting")}`, type: 5 },
    ];
  } else if (!permissionCheckByCamera("ptz_control", idCamera)) {
    CONTROL_TYPES = [
      {
        name: "Preset",
        type: 1,
        icon: <ChevronRight />,
      },
      {
        name: "Preset tour",
        type: 2,
        icon: <ChevronRight />,
      },
      {
        name: `${t("view.live.preset_setting")}`,
        type: 3,
      },
      { name: `${t("view.live.view_by_setting")}`, type: 5 },
    ];
  }
  const dispatch = useDispatch();
  const [typeActive, setTypeActive] = useState(1);
  const [openModalPresetSetting, setOpenModalPresetSetting] = useState(false);
  const [listType, setListType] = useState(LIST_TYPES.preset);
  const [presetTourLists, setPresetTourLists] = useState([]);
  const [search, setSearch] = useState("");
  const [presetLists, setPresetLists] = useState([]);
  const [cameraInfoLists, setCameraInfoLists] = useState([]);
  const [recallPresetAndPresetTourList, setRecallPresetAndPresetTourList] =
    useState(false);
  const getPreset = async (params) => {
    if (idCamera) {
      const payload = await ptzControllerApi.getPreset(params);
      if (isEmpty(payload)) {
        return;
      }
      if (payload) {
        setPresetLists(payload.data);
      }
    }
  };
  const getCameraInfo = async (params) => {
    if (idCamera) {
      const payload = await cameraAIApi.getCameraInfoByUuid(params);
      if (isEmpty(payload)) {
        return;
      }
      if (payload) {
        let data = [];
        data.push({
          cameraUuid: idCamera,
          type: "live",
          rtspStatus: "valid",
          title: `${t("view.live.live_mode")}`,
        });
        payload.forEach((p) => {
          if (p.rtspStatus === "valid") {
            data.push({
              ...p,
              title: t(`AI.${p.type}`),
            });
          }
        });
        setCameraInfoLists(data);
      }
    }
  };
  const getPresetTour = async (params) => {
    if (idCamera) {
      const payload = await ptzControllerApi.getPresetTour(params);
      if (payload == null) {
        return;
      }
      if (payload) {
        setPresetTourLists(payload.data);
      }
    }
  };
  //get preset data
  useEffect(() => {
    const params = {
      cameraUuid: idCamera,
      name: "",
    };
    getPreset(params);
    getPresetTour(params);
  }, [recallPresetAndPresetTourList]);

  const onClickCallPreset = async (idPreset) => {
    const body = {
      cameraUuid: idCamera,
      idPreset: idPreset,
    };
    try {
      await ptzControllerApi.postCallPreset(body);
    } catch (error) {
      const warnNotyfi = {
        type: NOTYFY_TYPE.warning,
        description: `${t("noti.ERROR")}`,
        duration: 2,
      };
      Notification(warnNotyfi);
      console.log(error);
    }
  };

  const onClickCallPresetTour = async (idPresetTour) => {
    const body = {
      cameraUuid: idCamera,
      idPresetTour: idPresetTour,
    };
    try {
      await ptzControllerApi.postCallPresetTour(body);
    } catch (error) {
      const warnNotyfi = {
        type: NOTYFY_TYPE.warning,
        description: `${t("noti.ERROR")}`,
        duration: 2,
      };
      Notification(warnNotyfi);
      console.log(error);
    }
  };

  const onClickChangeLiveMode = async (type) => {
    setTypeAICamera(type);
    changeLiveMode(slotId, type);
    dispatch({
      type: UPDATE_DATA.LOAD_SUCCESS,
      dataBody: { reset: true, cameraUuid: idCamera },
    });
  };

  const handleSelectType = (type) => {
    setTypeActive(type);
    if (type === 4) {
      setIsOpenModalControlPanel(true);
      setCurrentMenuControl(slotId);
      setListType(LIST_TYPES.other);
    }
    if (type === 3) {
      setIsOpenModalControlPanel(false);
      setOpenModalPresetSetting(true);
      props.openModalPresetSetting(true);
      setListType(LIST_TYPES.other);
    }
    if (type === 2) {
      setListType(LIST_TYPES.presetTour);
      setSearch("");
      const params = {
        cameraUuid: idCamera,
        name: "",
      };

      getPresetTour(params);
    }
    if (type === 1) {
      setListType(LIST_TYPES.preset);
      setSearch("");
      const params = {
        cameraUuid: idCamera,
        name: "",
      };

      getPreset(params);
    }
    if (type === 5) {
      setListType(LIST_TYPES.viewSetting);
      setSearch("");
      const params = {
        cameraUuid: idCamera,
        name: "",
      };
      getCameraInfo(params);
    }
  };

  const handleCloseModalControPanel = () => {
    setIsOpenModalControlPanel(false);
    setTypeActive(null);
  };
  const handleCloseModalPresetSetting = () => {
    setReloadLiveMenuTool(!reloadLiveMenuTool);
    setRecallPresetAndPresetTourList(!recallPresetAndPresetTourList);
    setOpenModalPresetSetting(false);
    props.openModalPresetSetting(false);
    setTypeActive(1);
    setListType(LIST_TYPES.preset);
  };

  // const handleCloseModal = () => {
  //   setOpenModalControlPanel(false);
  //   setTypeActive(null);
  // };
  const renderListPreset = () => {
    return presetLists?.map((item, index) => (
      <button
        key={index}
        className="menu-control-container__right__result__item"
        title={item.name}
        onClick={() => onClickCallPreset(item.idPreset)}
      >
        {item?.name}
      </button>
    ));
  };

  const renderListPresetTour = () => {
    return presetTourLists?.map((item, index) => (
      <button
        key={index}
        className="menu-control-container__right__result__item "
        title={item.name}
        onClick={() => onClickCallPresetTour(item.idPresetTour)}
      >
        {item?.name}
      </button>
    ));
  };

  const renderListCameraInfo = () => {
    return cameraInfoLists?.map((item, index) => (
      <button
        key={index}
        className="menu-control-container__right__result__item"
        title={item.title}
        onClick={() => onClickChangeLiveMode(item.type)}
      >
        {item?.title}
      </button>
    ));
  };

  const handleSearch = async (value) => {
    setSearch(value);
    const params = {
      cameraUuid: idCamera,
      name: value,
    };

    if (typeActive === 1) {
      getPreset(params);
    } else {
      getPresetTour(params);
    }
  };
  const handleBlur = (event) => {
    const value = event.target.value.trim();
    setSearch(value);
  };

  return (
    <>
      <div className="menu-control-container">
        <div className="menu-control-container__left">
          <div className="menu-control-container__left__back" />
          {CONTROL_TYPES.map((item, _) => {
            return (
              <ItemControl
                typeActive={typeActive}
                item={item}
                onSelectType={handleSelectType}
                key={item.type}
              />
            );
          })}
        </div>
        <div className="menu-control-container__right">
          {/* <div className="menu-control-container__right__search"> */}
          {listType !== LIST_TYPES.viewSetting && (
            <AutoComplete
              onSearch={debounce(handleSearch, 1000)}
              onBlur={handleBlur}
              maxLength={100}
              className=" full-width height-40 read search__camera-group"
              placeholder={t("view.map.search")}
            />
          )}
          {/* </div> */}
          <div className="menu-control-container__right__result">
            {listType === LIST_TYPES.preset
              ? renderListPreset()
              : listType === LIST_TYPES.presetTour
              ? renderListPresetTour()
              : listType === LIST_TYPES.viewSetting
              ? renderListCameraInfo()
              : ""}
          </div>
        </div>
      </div>
      {isOpenModal && (
        <ModalControlPanel
          isOpen={isOpenModalControlPanel}
          onCloseModal={handleCloseModalControPanel}
          idCamera={idCamera}
        />
      )}
      {/* {openModalPresetSetting && isOpenModal && ( */}
      <Modal
        wrapClassName="preset--setting"
        visible={openModalPresetSetting}
        title={t("view.live.preset_setting")}
        footer={null}
        closable={true}
        onCancel={handleCloseModalPresetSetting}
        destroyOnClose={true}
        maskStyle={{ background: "rgba(51, 51, 51, 0.9)" }}
      >
        <Preset idCamera={idCamera} />
      </Modal>
      {/* )} */}
    </>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => {
  return {
    openModalPresetSetting: (states) => {
      dispatch(openModalPresetSetting(states));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Index);
