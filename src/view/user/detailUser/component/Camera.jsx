import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Checkbox, Popconfirm, Space, Table, Tag, Tooltip } from "antd";
import { isEmpty } from "lodash-es";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CameraApi from "../../../../actions/api/camera/CameraApi";
import UserApi from "../../../../actions/api/user/UserApi";
import permissionCheck from "../../../../actions/function/MyUltil/PermissionCheck";
import { ShowTotal } from "../../../../styled/showTotal";
import "../../../commonStyle/commonAuto.scss";
import "../../../commonStyle/commonSelect.scss";
import Notification from "./../../../../components/vms/notification/Notification";
import "./Camera.scss";
import ModalAddCamera from "./ModalAddCamera";

export default function Camera(props) {
  const [data, setData] = useState([]);
  const [cameraGroup, setCameraGroup] = useState([]);
  const [camera, setCamera] = useState([]);
  const [selectedAdd, setSelectedAdd] = useState(false);
  const [reloadCameraPage, setReloadCameraPage] = useState(
    props?.reloadCameraPage
  );
  const [reloadPage, setReloadPage] = useState(props?.reload);
  const [reload, setReload] = useState(false);
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(5);

  useEffect(() => {
    let data = {
      name: "",
      provinceId: "",
      districtId: "",
      id: "",
      administrativeUnitUuid: "",
      vendorUuid: "",
      status: "",
    };

    setReloadCameraPage(props?.reloadCameraPage);
    setReloadPage(props?.reload);

    CameraApi.getAllCamera(data).then(setCamera);

    CameraApi.getAllGroupCamera({ name: "" }).then(setCameraGroup);

    UserApi.getGroupByUser({ uuid: props?.id }).then(async (result) => {
      setData(result);
    });
  }, [reloadCameraPage, reload, reloadPage]);

  useEffect(() => {
    setReloadCameraPage(props?.reloadCameraPage);
    setReloadPage(props?.reload);
    UserApi.getGroupByUser({ uuid: props?.id }).then(async (result) => {
      setData({ ...result });
    });
  }, [props?.reloadCameraPage, reload, props?.reload]);

  useEffect(() => {}, [selectedAdd]);

  const convertData = (data) => {
    //Nhóm tất cả các bản ghi có cùng cam_uuid sau dó merge role name trong p_role_camera_groups
    var arr = [];
    var group_to_values1 = data.p_role_cameras.reduce(function (obj, item) {
      var data = {
        uuid: "",
        name_role: [],
        code_role: [],
        cam_uuid: "",
        cam_name: "",
        permissions: [],
      };

      obj[item.cam_uuid] = obj[item.cam_uuid] || data;

      obj[item.cam_uuid].uuid = item.uuid;

      obj[item.cam_uuid].cam_name = item.cam_name;

      obj[item.cam_uuid].name_role.push(item.name);
      obj[item.cam_uuid].code_role.push(item.code);

      item.permissions.forEach(function (e) {
        obj[item.cam_uuid].permissions.push(e);
      });

      return obj;
    }, {});
    Object.entries(group_to_values1).forEach(([key, value]) =>
      arr.push({
        cam_uuid: key,
        uuid: value.uuid,
        code_role: value.code_role,
        name_role: value.name_role,
        cam_name: value.cam_name,
        permissions: value.permissions,
      })
    );

    //Nhóm tất cả các bản ghi có cùng cam_uuid sau dó merge role name trong p_user_g_camera_groups
    var arr2 = [];

    var group_to_values2 = data.p_user_g_cameras.reduce(function (obj, item) {
      var data = {
        uuid: "",
        name_group: [],
        code_group: [],
        cam_uuid: "",
        cam_name: "",
        permissions: [],
      };

      obj[item.cam_uuid] = obj[item.cam_uuid] || data;

      obj[item.cam_uuid].uuid = item.uuid;

      obj[item.cam_uuid].cam_name = item.cam_name;

      obj[item.cam_uuid].name_group.push(item.name);
      obj[item.cam_uuid].code_group.push(item.code);

      item.permissions.forEach(function (e) {
        obj[item.cam_uuid].permissions.push(e);
      });

      return obj;
    }, {});
    Object.entries(group_to_values2).forEach(([key, value]) =>
      arr2.push({
        cam_uuid: key,
        uuid: value.uuid,
        name_group: value.name_group,
        code_group: value.code_group,
        cam_name: value.cam_name,
        permissions: value.permissions,
      })
    );

    //lặp qua 2 mảng để lấy ra data hiển thị

    let dataValue;

    //cả 2 mảng đều có giá trị

    if (!isEmpty(arr2) && !isEmpty(arr)) {
      if (!isEmpty(arr2) && !isEmpty(arr)) {
        dataValue = [];

        //nhóm 2 mảng lại với nhau

        const arrayData = arr2.concat(arr);

        var group_to_values3 = arrayData.reduce(function (obj, item) {
          var data = {
            uuid: "",
            code_role: [],
            name_role: [],
            name_group: [],
            code_group: [],
            cam_uuid: "",
            cam_name: "",
            permissions: [],
          };

          obj[item.cam_uuid] = obj[item.cam_uuid] || data;

          obj[item.cam_uuid].uuid = item.uuid;

          obj[item.cam_uuid].cam_name = item.cam_name;

          obj[item.cam_uuid].name_group.push(item.name_group);
          obj[item.cam_uuid].code_group.push(item.code_group);

          obj[item.cam_uuid].code_role.push(item.code_role);
          obj[item.cam_uuid].name_role.push(item.name_role);

          item.permissions.forEach(function (e) {
            obj[item.cam_uuid].permissions.push(e);
          });

          return obj;
        }, {});
        Object.entries(group_to_values3).forEach(([key, value]) =>
          dataValue.push({
            cam_uuid: key,
            uuid: value.uuid,
            name_group: value.name_group
              .flat()
              .filter((el) => el !== undefined),
            code_group: value.code_group
              .flat()
              .filter((el) => el !== undefined),
            name_role: value.name_role.flat().filter((el) => el !== undefined),
            code_role: value.code_role.flat().filter((el) => el !== undefined),
            cam_name: value.cam_name,
            permissions: [...new Set([...value.permissions])].map((p) => {
              return {
                [p]: 1,
              };
            }),
          })
        );
      }
    }

    //cả  mảng có mảng không giá trị
    if (!isEmpty(arr2) && isEmpty(arr)) {
      dataValue = arr2.map((a2) => {
        return {
          ...a2,
          permissions: [...new Set([...a2.permissions])].map((p) => {
            return {
              [p]: 1,
            };
          }),
        };
      });
    }

    //cả  mảng có mảng không giá trị
    if (isEmpty(arr2) && !isEmpty(arr)) {
      dataValue = arr.map((a2) => {
        return {
          ...a2,
          permissions: [...new Set([...a2.permissions])].map((p) => {
            return {
              [p]: 1,
            };
          }),
        };
      });
    }

    //cả 2 mảng không có giá trị

    if (isEmpty(arr2) && isEmpty(arr)) {
      dataValue = [];
    }

    return dataValue.map((camG) => {
      const permisionConvert = Object.assign({}, ...camG.permissions);

      const t = {
        ...permisionConvert,
        cam_uuid: camG.cam_uuid,
        cam_name: camG.cam_name,
        user_cam_group: camG.name_group,
        role_cam_group: camG.name_role,

        isDisableRow: true,
      };
      return t;
    });
  };

  const convertDataTest = (data) => {
    return data.p_cameras.map((pc) => {
      const permision = pc.permissions.map((p) => {
        return {
          [p]: 1,
        };
      });

      const permisionConvert = Object.assign({}, ...permision);

      return {
        ...permisionConvert,
        cam_name: pc?.cam_name,
        cam_uuid: pc?.cam_uuid,
        isDisableRow: checkDisable(pc.cam_group_uuid, data?.p_camera_groups), // đk để hiển thị là
      };
    });
  };

  const checkDisable = (id, data) => {
    if (isEmpty(data)) {
      return false;
    }

    const dataFilter = data.filter((x) => x.cam_group_uuid === id);

    return !isEmpty(dataFilter);
  };

  let dataCameras = [];

  let camera1 = [];

  if (!isEmpty(data) && !isEmpty(cameraGroup) && !isEmpty(camera)) {
    camera1 = convertDataTest(data);
    let camera2 = convertData(data);
    dataCameras = [...camera2, ...camera1];
  }

  const checkedGroup = camera1.map((c) => c.cam_uuid);

  const handleShowModalAdd = (selectedRowKeys) => {
    setSelectedAdd(false);

    if (isEmpty(selectedRowKeys)) {
      return;
    }

    const cameraAdd = selectedRowKeys.map((s) => {
      const cam = data.p_cameras.find((c) => c.cam_uuid === s); // cái nào có sẵn trong p_cameras thì lấy

      const cam2 = camera.find((c) => c.uuid === s); // không có trong p_cameras == > bảng camera mà tìm

      if (cam) {
        return cam;
      }

      return {
        ...cam2,
        cam_name: cam2?.name,
        cam_uuid: cam2?.uuid,
        permissions: ["view_online"],
        isDisableRow: false,
      };
    });

    const dataAfter = {
      ...data,
      p_cameras: cameraAdd,
    };

    setData(dataAfter);
  };

  const showModalAdd = () => {
    setSelectedAdd(true);
  };

  const renderRole = (cell) => {
    if (isEmpty(cell)) {
      return;
    }

    return cell.map((c, index) => {
      return (
        <Tag key={index} className="tableTag" color="rgba(108, 117, 125, 0.12)">
          {c}
        </Tag>
      );
    });
  };
  const userGroup = (cell) => {
    if (isEmpty(cell)) {
      return;
    }

    return cell.map((c, index) => {
      return (
        <Tag key={index} className="tableTag" color="rgba(108, 117, 125, 0.12)">
          {c}
        </Tag>
      );
    });
  };

  async function onChange(e, name, id) {
    // setReload(!reloadCameraPage);
    const data = {
      subject: `user@${props.id}`,
      object: `cam@${id}`,
      action: name,
    };

    if (e.target.checked) {
      const isAdd = await CameraApi.setPermisionCamGroup(data);

      if (isAdd) {
        setReload(!reload);
        const notifyMess = {
          type: "success",
          title: "",
          description: `${t("noti.successfully_add_permission")}`,
        };
        Notification(notifyMess);
      }

      return;
    }

    const dataRemove = {
      policies: [data],
    };

    const isRemove = await CameraApi.removePermisionCamGroup(dataRemove);
    // setReloadCameraPage(!reloadCameraPage);

    if (isRemove) {
      setReload(!reload);
      const notifyMess = {
        type: "success",
        title: "",
        description: `${t("noti.successfully_delete_permission")}`,
      };
      Notification(notifyMess);
    } else {
      const notifyMess = {
        type: "error",
        title: "",
        description: `${t("noti.fail_delete_permission")}`,
      };
      Notification(notifyMess);
    }
  }

  const removeItem = (record) => {
    const index = data?.p_cameras.findIndex((x) => x.uuid === record.cam_uuid);

    if (index < 0) return;

    let new_p_cameras = [...data?.p_cameras];
    new_p_cameras.splice(index, 1);
    setData({ ...data, p_cameras: new_p_cameras });
  };

  const removeAllPermmision = async (record) => {
    if (
      record?.view_online &&
      !record?.view_offline &&
      !record?.setup_preset &&
      !record?.ptz_control
    ) {
      const notifyMess = {
        type: "success",
        title: "",
        description: `${t("noti.successfully_delete_data")}`,
      };
      Notification(notifyMess);

      let dataRemove = [];

      dataRemove.push({
        subject: `user@${props.id}`,
        object: `cam@${record.cam_uuid}`,
        action: "view_online",
      });

      await CameraApi.removePermisionCamGroup({
        policies: dataRemove,
      });

      removeItem(record);
      setReload(!reload);
      return;
    }
    let data = [];

    if (record?.view_online) {
      data.push({
        subject: `user@${props.id}`,
        object: `cam@${record.cam_uuid}`,
        action: "view_online",
      });
    }
    if (record?.view_offline) {
      data.push({
        subject: `user@${props.id}`,
        object: `cam@${record.cam_uuid}`,
        action: "view_offline",
      });
    }
    if (record?.setup_preset) {
      data.push({
        subject: `user@${props.id}`,
        object: `cam@${record.cam_uuid}`,
        action: "setup_preset",
      });
    }
    if (record?.ptz_control) {
      data.push({
        subject: `user@${props.id}`,
        object: `cam@${record.cam_uuid}`,
        action: "ptz_control",
      });
    }

    const dataRemove = {
      policies: data,
    };

    const isRemove = await CameraApi.removePermisionCamGroup(dataRemove);

    if (isRemove) {
      const notifyMess = {
        type: "success",
        title: "",
        description: `${t("noti.successfully_delete_permission")}`,
      };
      Notification(notifyMess);
      setReload(!reload);
    } else {
      const notifyMess = {
        type: "error",
        title: "",
        description: `${t("noti.fail_delete_permission")}`,
      };
      Notification(notifyMess);
    }
  };

  const viewOnline = (record) => {
    let defaultChecked = true;

    if (record.view_online === undefined) {
      defaultChecked = false;
    }

    return (
      <Checkbox
        onChange={(e) => onChange(e, "view_online", record.cam_uuid)}
        checked={defaultChecked}
        disabled={record.isDisableRow}
      ></Checkbox>
    );
  };

  const viewOffline = (record) => {
    let defaultChecked = true;

    if (record.view_offline === undefined) {
      defaultChecked = false;
    }

    return (
      <Checkbox
        onChange={(e) => onChange(e, "view_offline", record.cam_uuid)}
        checked={defaultChecked}
        disabled={record.isDisableRow}
      ></Checkbox>
    );
  };

  const setupPreset = (record) => {
    let defaultChecked = true;

    if (record.setup_preset === undefined) {
      defaultChecked = false;
    }

    return (
      <Checkbox
        onChange={(e) => onChange(e, "setup_preset", record.cam_uuid)}
        checked={defaultChecked}
        disabled={record.isDisableRow}
      ></Checkbox>
    );
  };

  const ptzControl = (record) => {
    let defaultChecked = true;

    if (record.ptz_control === undefined) {
      defaultChecked = false;
    }

    return (
      <Checkbox
        onChange={(e) => onChange(e, "ptz_control", record.cam_uuid)}
        checked={defaultChecked}
        disabled={record.isDisableRow}
      ></Checkbox>
    );
  };

  const renderHeader = () => {
    return (
      <>
        <h4>{t("view.user.detail_list.grant_permission_by_camera")}</h4>
        {permissionCheck("assign_user_permission") && !props?.isMyInfor && (
          <div className="d-flex">
            <Tooltip
              placement="topRight"
              title={t("view.user.detail_list.add_camera_choose_permission")}
            >
              <Button
                type="primary"
                className="btnAdd "
                style={{ borderRadius: "6px" }}
                onClick={showModalAdd}
              >
                <PlusOutlined />
              </Button>
            </Tooltip>
            {/* <Tooltip placement="topRight" title="Chi tiết">
          <Button
            className="btnInfo height-40"
            style={{ borderRadius: '6px' }}
          >
            <QuestionCircleOutlined className="d-flex justify-content-between align-center" />
          </Button>
        </Tooltip> */}
          </div>
        )}
      </>
    );
  };

  const columns = [
    {
      title: "Camera",
      className: "headerUserColums",
      dataIndex: "cam_name",
      fixed: "left",
    },
    {
      title: `${t("view.map.camera_group", { cam: t("camera") })}`,
      className: "headerUserColums",
      dataIndex: "cam_name_group",
    },
    {
      title: `${t("R")}`,
      className: "headerUserColums",
      dataIndex: "role_cam_group",
      render: renderRole,
    },
    {
      title: `${t("G")}`,
      className: "headerUserColums",
      dataIndex: "user_cam_group",
      render: userGroup,
    },
    {
      title: `${t("view.user.detail_list.view_online")}`,
      className: "headerUserColums",
      dataIndex: "view_online",

      render: (text, record) => {
        return <Space>{viewOnline(record)}</Space>;
      },
    },
    {
      title: `${t("view.user.detail_list.view_offline")}`,
      className: "headerUserColums",
      dataIndex: "view_offline",

      render: (text, record) => {
        return <Space>{viewOffline(record)}</Space>;
      },
    },
    {
      title: `${t("view.user.detail_list.preset_setting")}`,
      className: "headerUserColums",
      dataIndex: "setup_preset",

      render: (text, record) => {
        return <Space>{setupPreset(record)}</Space>;
      },
    },
    {
      title: `${t("view.user.detail_list.control")}`,
      className: "headerUserColums",
      dataIndex: "ptz_control",

      render: (text, record) => {
        return <Space>{ptzControl(record)}</Space>;
      },
    },

    {
      title: `${t("view.user.detail_list.action")}`,
      className: "headerUserColums",
      fixed: "right",
      render: (text, record) => {
        return (
          <Space>
            {!record.isDisableRow && (
              <Popconfirm
                title={t("noti.delete_all_permission")}
                onConfirm={() => removeAllPermmision(record)}
              >
                <CloseOutlined />
              </Popconfirm>
            )}
          </Space>
        );
      },
    },
  ];
  const onShowSizeChange = (current, pageSize) => {
    setPage(current);
    setSize(pageSize);
  };

  return (
    <div>
      <Table
        className="detail-user__table-camera"
        rowKey="uuid"
        columns={columns}
        dataSource={dataCameras}
        title={renderHeader}
        // rowClassName={(record) => record.isDisableRow && 'disabled-row'}
        rowClassName={(record) => {
          let classAdd = [];
          if (record.isDisableRow) {
            classAdd.push("disabled-row");
          }
          if (permissionCheck("assign_user_permission") && props?.isMyInfor) {
            classAdd.push("disableCard");
          }
          let finalClassAdd = classAdd.join(" ");
          return finalClassAdd;
        }}
        scroll={{ x: 1500 }}
        pagination={{
          showSizeChanger: true,
          onShowSizeChange: (current, size) => {
            onShowSizeChange(current, size);
          },
          pageSizeOptions: [5, 10, 20, 50, 100],
          hideOnSinglePage: false,
          current: page,
          total: dataCameras.length,
          pageSize: size,
          onChange: (value) => {
            setPage(value);
          },
          showTotal: (total, range) => {
            return (
              <ShowTotal className="show--total">
                {t("view.user.detail_list.viewing")} {range[0]}{" "}
                {t("view.user.detail_list.to")} {range[1]}{" "}
                {t("view.user.detail_list.out_of")} {total}{" "}
                {t("view.user.detail_list.indexes")}
              </ShowTotal>
            );
          },
        }}
      />
      {selectedAdd && (
        <ModalAddCamera
          selectedAdd={selectedAdd}
          handleShowModalAdd={handleShowModalAdd}
          checkedGroups={checkedGroup}
          id={props?.id}
        />
      )}
    </div>
  );
}
