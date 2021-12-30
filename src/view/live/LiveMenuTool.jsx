import {
  DownOutlined,
  LeftOutlined,
  MinusOutlined,
  PlusOutlined,
  RightOutlined,
  UpOutlined,
} from "@ant-design/icons";

import { Button, Tooltip, Select } from "antd";
import { isEmpty } from "lodash-es";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { reactLocalStorage } from "reactjs-localstorage";
import ptzControllerApi from "../../api/ptz/ptzController";
import "./LiveMenuTool.scss";
import permissionCheck from "../../actions/function/MyUltil/PermissionCheck";
import permissionCheckByCamera from "../../actions/function/MyUltil/PermissionCheckByCamera";
const LiveMenuTool = (props) => {
  const { t } = useTranslation();
  const { idCamera, reloadLiveMenuTool } = props;
  const [presetLists, setPresetLists] = useState([]);
  const [presetTourLists, setPresetTourLists] = useState([]);
  const { Option } = Select;
  const getPreset = async (params) => {
    console.log("params", params)
    if (!permissionCheckByCamera("setup_preset", params.cameraUuid)) {
      return;
    }
    if (idCamera) {
      const payload = await ptzControllerApi.getPreset(params);
      if (payload == null) {
        return;
      }
      if (payload) {
        setPresetLists(payload.data);
      }
    }
  };
  const getPresetTour = async (params) => {
    if (!permissionCheckByCamera("setup_preset", params.cameraUuid)) {
      return;
    }
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
  //get all preset
  useEffect(() => {
    if (checkPermissionViewCamera(idCamera)) {
      let params = {
        cameraUuid: idCamera,
        sortType: "asc",
        sortField: "name",
      };
      getPreset(params);
    }
  }, [idCamera, reloadLiveMenuTool]);

  //get all preset tour
  useEffect(() => {
    if (checkPermissionViewCamera(idCamera)) {
      let params = {
        cameraUuid: idCamera,
        sortType: "asc",
        sortField: "name",
      };
      getPresetTour(params);
    }
  }, [idCamera, reloadLiveMenuTool]);

  const onPanLeftStart = async () => {
    const payload = {
      cameraUuid: idCamera,
      direction: "left",
      isStop: 0,
      speed: 1,
    };
    try {
      await ptzControllerApi.postPan(payload);
    } catch (error) {
      console.log(error);
    }
  };

  const onPanLeftEnd = async () => {
    const payload = {
      cameraUuid: idCamera,
      direction: "left",
      isStop: 1,
      speed: 1,
    };
    try {
      await ptzControllerApi.postPan(payload);
    } catch (error) {
      console.log(error);
    }
  };

  const onPanRightStart = async () => {
    const payload = {
      cameraUuid: idCamera,
      direction: "right",
      isStop: 0,
      speed: 1,
    };
    try {
      await ptzControllerApi.postPan(payload);
    } catch (error) {
      console.log(error);
    }
  };

  const onPanRightEnd = async () => {
    const payload = {
      cameraUuid: idCamera,
      direction: "right",
      isStop: 1,
      speed: 1,
    };
    try {
      await ptzControllerApi.postPan(payload);
    } catch (error) {
      console.log(error);
    }
  };

  const onTiltUpStart = async () => {
    const payload = {
      cameraUuid: idCamera,
      direction: "up",
      isStop: 0,
      speed: 1,
    };
    try {
      await ptzControllerApi.postTilt(payload);
    } catch (error) {
      console.log(error);
    }
  };

  const onTiltUpEnd = async () => {
    const payload = {
      cameraUuid: idCamera,
      direction: "up",
      isStop: 1,
      speed: 1,
    };
    try {
      await ptzControllerApi.postTilt(payload);
    } catch (error) {
      console.log(error);
    }
  };

  const onTiltDownStart = async () => {
    const payload = {
      cameraUuid: idCamera,
      direction: "down",
      isStop: 0,
      speed: 1,
    };
    try {
      await ptzControllerApi.postTilt(payload);
    } catch (error) {
      console.log(error);
    }
  };

  const onTiltDownEnd = async () => {
    const payload = {
      cameraUuid: idCamera,
      direction: "down",
      isStop: 1,
      speed: 1,
    };
    try {
      await ptzControllerApi.postTilt(payload);
    } catch (error) {
      console.log(error);
    }
  };

  const onZoomInStart = async () => {
    const payload = {
      cameraUuid: idCamera,
      direction: "in",
      isStop: 0,
      speed: 1,
    };
    try {
      await ptzControllerApi.postZoom(payload);
    } catch (error) {
      console.log(error);
    }
  };

  const onZoomInEnd = async () => {
    const payload = {
      cameraUuid: idCamera,
      direction: "in",
      isStop: 1,
      speed: 1,
    };
    try {
      await ptzControllerApi.postZoom(payload);
    } catch (error) {
      console.log(error);
    }
  };

  const onZoomOutStart = async () => {
    const payload = {
      cameraUuid: idCamera,
      direction: "out",
      isStop: 0,
      speed: 1,
    };
    try {
      await ptzControllerApi.postZoom(payload);
    } catch (error) {
      console.log(error);
    }
  };

  const onZoomOutEnd = async () => {
    const payload = {
      cameraUuid: idCamera,
      direction: "out",
      isStop: 1,
      speed: 1,
    };
    try {
      await ptzControllerApi.postZoom(payload);
    } catch (error) {
      console.log(error);
    }
  };

  const onChangeSelectPreset = async (e, option) => {
    const value = option.value;
    const body = {
      cameraUuid: idCamera,
      idPreset: value,
    };
    try {
      await ptzControllerApi.postCallPreset(body);
    } catch (error) {
      console.log(error);
    }
  };

  const onChangeSelectPresetTour = async (e, option) => {
    const value = option.value;
    const body = {
      cameraUuid: idCamera,
      idPresetTour: value,
    };
    try {
      await ptzControllerApi.postCallPresetTour(body);
    } catch (error) {
      console.log(error);
    }
  };

  const renderOptionPreset = () => {
    return presetLists?.map((item, index) => (
      <Option key={index} value={item?.idPreset}>
        {item?.name}
      </Option>
    ));
  };

  const renderOptionPresetTour = () => {
    return presetTourLists?.map((item, index) => (
      <Option key={index} value={item?.idPresetTour}>
        {item?.name}
      </Option>
    ));
  };

  const checkPermissionViewCamera = (idCamera) => {
    const permissionUser = reactLocalStorage.getObject("permissionUser");
    if (!isEmpty(permissionUser?.roles)) {
      const roles = permissionUser?.roles;
      for (const role of roles) {
        if (role.role_code === "superadmin") return true;
      }
    }
    if (!isEmpty(permissionUser?.p_cameras)) {
      const p_cameras = permissionUser.p_cameras;
      for (const camera of p_cameras) {
        if (idCamera == camera.cam_uuid) {
          const permissions = camera.permissions;
          for (const permission of permissions) {
            if (permission == "view_online") {
              return true;
            }
          }
        }
      }
    }
    return false;
  };
  return (
    <div className="toolbar__ptz--control">
      <div className="toolbar__ptz--direction">
        <div className="toolbar__ptz toolbar__ptz-pan">
          <Tooltip
            placement="top"
            title={t("view.user.detail_list.left")}
            arrowPointAtCenter={true}
          >
            <Button
              className="toolbar__link"
              size="small"
              disabled={!idCamera}
              onMouseDown={onPanLeftStart}
              onMouseUp={onPanLeftEnd}
              icon={<LeftOutlined className="toolbar__link-icon" />}
            ></Button>
          </Tooltip>

          <Tooltip
            placement="top"
            title={t("view.user.detail_list.right")}
            arrowPointAtCenter={true}
          >
            <Button
              className="toolbar__link"
              size="small"
              onMouseDown={onPanRightStart}
              onMouseUp={onPanRightEnd}
              disabled={!idCamera}
              icon={<RightOutlined className="toolbar__link-icon" />}
            ></Button>
          </Tooltip>
        </div>
        <div className="toolbar__ptz toolbar__ptz-tilt">
          <Tooltip
            placement="top"
            title={t("view.user.detail_list.down")}
            arrowPointAtCenter={true}
          >
            <Button
              className="toolbar__link"
              size="small"
              disabled={!idCamera}
              onMouseDown={onTiltDownStart}
              onMouseUp={onTiltDownEnd}
              icon={<DownOutlined className="toolbar__link-icon" />}
            ></Button>
          </Tooltip>

          <Tooltip
            placement="top"
            title={t("view.user.detail_list.up")}
            arrowPointAtCenter={true}
          >
            <Button
              className="toolbar__link"
              size="small"
              disabled={!idCamera}
              onMouseDown={onTiltUpStart}
              onMouseUp={onTiltUpEnd}
              icon={<UpOutlined className="toolbar__link-icon" />}
            ></Button>
          </Tooltip>
        </div>
        <div className="toolbar__ptz toolbar__ptz-zoom">
          <Tooltip
            placement="top"
            title={t("view.user.detail_list.zoom_in")}
            arrowPointAtCenter={true}
          >
            <Button
              className="toolbar__link"
              size="small"
              disabled={!idCamera}
              onMouseDown={onZoomInStart}
              onMouseUp={onZoomInEnd}
              icon={<PlusOutlined className="toolbar__link-icon" />}
            ></Button>
          </Tooltip>

          <Tooltip
            placement="top"
            title={t("view.user.detail_list.zoom_out")}
            arrowPointAtCenter={true}
          >
            <Button
              className="toolbar__link"
              size="small"
              disabled={!idCamera}
              onMouseDown={onZoomOutStart}
              onMouseUp={onZoomOutEnd}
              icon={<MinusOutlined className="toolbar__link-icon" />}
            ></Button>
          </Tooltip>
        </div>
      </div>
      <div className="toolbar__ptz--call">
        <div className="toolbar__ptz toolbar__preset">
          <Select
            disabled={!checkPermissionViewCamera(idCamera)}
            id="select__preset"
            allowClear
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            onSelect={(e, option) => {
              onChangeSelectPreset(e, option);
            }}
            placeholder="Preset"
            notFoundContent={<p color="white"> {t("view.user.detail_list.no_valid_results_found")}</p>}
          >
            {renderOptionPreset()}
          </Select>
        </div>
        <div className="toolbar__ptz toolbar__preset-tour">
          <Select
            allowClear
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            disabled={!checkPermissionViewCamera(idCamera)}
            id="select__preset-tour"
            onSelect={(e, option) => {
              onChangeSelectPresetTour(e, option);
            }}
            placeholder="Preset Tour"
            notFoundContent={<p color="white"> {t("view.user.detail_list.no_valid_results_found")}</p>}
          >
            {renderOptionPresetTour()}
          </Select>
        </div>
      </div>
    </div>
  );
};

export default LiveMenuTool;
