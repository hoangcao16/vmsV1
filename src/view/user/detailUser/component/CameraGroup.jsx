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
import "./CameraGroup.scss";
import ModalAddCameraGroup from "./ModalAddCameraGroup";

export default function CameraGroup(props) {
  const { handleRefreshCameraPage } = props;
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [reload, setReload] = useState(false);
  const [cameraGroup, setCameraGroup] = useState([]);
  const [selectedAdd, setSelectedAdd] = useState(false);
  const [reloadPage, setReloadPage] = useState(props?.reload);

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(5);

  useEffect(() => {
    CameraApi.getAllGroupCamera({ name: "" }).then(setCameraGroup);
    UserApi.getGroupByUser({ uuid: props?.id }).then(setData);
  }, [reloadPage]);

  useEffect(() => {
    UserApi.getGroupByUser({ uuid: props?.id }).then(setData);
    setReloadPage(props?.reload);
  }, [reload, reloadPage, props?.reload]);

  useEffect(() => {}, [selectedAdd]);

  const convertData = (data) => {
    //Nhóm tất cả các bản ghi có cùng cam_group_uuid sau dó merge role name trong p_role_camera_groups
    var arr = [];
    var group_to_values1 = data.p_role_camera_groups.reduce(function (
      obj,
      item
    ) {
      var data = {
        uuid: "",
        name_role: [],
        code_role: [],
        cam_group_uuid: "",
        cam_group_name: "",
        permissions: [],
      };

      obj[item.cam_group_uuid] = obj[item.cam_group_uuid] || data;

      obj[item.cam_group_uuid].uuid = item.uuid;

      obj[item.cam_group_uuid].cam_group_name = item.cam_group_name;

      obj[item.cam_group_uuid].name_role.push(item.name);
      obj[item.cam_group_uuid].code_role.push(item.code);

      item.permissions.forEach(function (e) {
        obj[item.cam_group_uuid].permissions.push(e);
      });

      return obj;
    },
    {});

    Object.entries(group_to_values1).forEach(([key, value]) =>
      arr.push({
        cam_group_uuid: key,
        uuid: value.uuid,
        code_role: value.code_role,
        name_role: value.name_role,
        cam_group_name: value.cam_group_name,
        permissions: value.permissions,
      })
    );

    //Nhóm tất cả các bản ghi có cùng cam_group_uuid sau dó merge role name trong p_user_g_camera_groups
    var arr2 = [];

    var group_to_values2 = data.p_user_g_camera_groups.reduce(function (
      obj,
      item
    ) {
      var data = {
        uuid: "",
        name_group: [],
        code_group: [],
        cam_group_uuid: "",
        cam_group_name: "",
        permissions: [],
      };

      obj[item.cam_group_uuid] = obj[item.cam_group_uuid] || data;

      obj[item.cam_group_uuid].uuid = item.uuid;

      obj[item.cam_group_uuid].cam_group_name = item.cam_group_name;

      obj[item.cam_group_uuid].name_group.push(item.name);
      obj[item.cam_group_uuid].code_group.push(item.code);

      item.permissions.forEach(function (e) {
        obj[item.cam_group_uuid].permissions.push(e);
      });

      return obj;
    },
    {});
    Object.entries(group_to_values2).forEach(([key, value]) =>
      arr2.push({
        cam_group_uuid: key,
        uuid: value.uuid,
        name_group: value.name_group,
        code_group: value.code_group,
        cam_group_name: value.cam_group_name,
        permissions: value.permissions,
      })
    );

    //lặp qua 2 mảng để lấy ra data hiển thị

    let dataValue;

    //cả 2 mảng đều có giá trị

    if (!isEmpty(arr2) && !isEmpty(arr)) {
      dataValue = [];

      //nhóm 2 mảng lại với nhau()

      const arrayData = arr2.concat(arr);

      var group_to_values3 = arrayData.reduce(function (obj, item) {
        var data = {
          uuid: "",
          code_role: [],
          name_role: [],
          name_group: [],
          code_group: [],
          cam_group_uuid: "",
          cam_group_name: "",
          permissions: [],
        };

        obj[item.cam_group_uuid] = obj[item.cam_group_uuid] || data;

        obj[item.cam_group_uuid].uuid = item.uuid;

        obj[item.cam_group_uuid].cam_group_name = item.cam_group_name;

        obj[item.cam_group_uuid].name_group.push(item.name_group);
        obj[item.cam_group_uuid].code_group.push(item.code_group);

        obj[item.cam_group_uuid].code_role.push(item.code_role);
        obj[item.cam_group_uuid].name_role.push(item.name_role);

        item.permissions.forEach(function (e) {
          obj[item.cam_group_uuid].permissions.push(e);
        });

        return obj;
      }, {});
      Object.entries(group_to_values3).forEach(([key, value]) =>
        dataValue.push({
          cam_group_uuid: key,
          uuid: value.uuid,
          name_group: value.name_group.flat().filter((el) => el !== undefined),
          code_group: value.code_group.flat().filter((el) => el !== undefined),
          name_role: value.name_role.flat().filter((el) => el !== undefined),
          code_role: value.code_role.flat().filter((el) => el !== undefined),
          cam_group_name: value.cam_group_name,
          permissions: [...new Set([...value.permissions])].map((p) => {
            return {
              [p]: 1,
            };
          }),
        })
      );
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
        cam_group_uuid: camG.cam_group_uuid,
        cam_group_name: camG.cam_group_name,
        user_cam_group: camG.name_group,
        role_cam_group: camG.name_role,

        isDisableRow: true,
      };

      return t;
    });
  };

  const convertDataTest = (data) => {
    const result = data.p_camera_groups.filter((p) => isEmpty(p.parent));
    return result.map((camG) => {
      const permision = camG?.permissions.map((p) => {
        return {
          [p]: 1,
        };
      });

      const permisionConvert = Object.assign({}, ...permision);
      return {
        ...permisionConvert,
        cam_group_uuid: camG?.cam_group_uuid,
        cam_group_name: camG?.cam_group_name,
        isDisableRow: false,
      };
    });
  };

  let group = [];
  let group1 = [];

  if (!isEmpty(data) && !isEmpty(cameraGroup)) {
    group1 = convertDataTest(data);

    let group2 = convertData(data);
    group = [...group2, ...group1];
  }

  const checkedGroup = group1.map((t) => t.cam_group_uuid);

  const handleShowModalAdd = async (selectedRowKeys) => {
    setSelectedAdd(false);

    if (isEmpty(selectedRowKeys)) {
      return;
    }

    const group = selectedRowKeys?.map((s) => {
      const cam = data.p_camera_groups.find((c) => c.cam_group_uuid === s);

      const camG = cameraGroup.find((c) => c.uuid === s);

      if (cam) {
        return cam;
      }

      return {
        ...camG,
        cam_group_uuid: camG.uuid,
        cam_group_name: camG.name,
        permissions: ["view_online"],
      };
    });

    const dataAfter = {
      ...data,
      p_camera_groups: group,
    };

    setData(dataAfter);
    // setData(!reload);
    await handleRefreshCameraPage();
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

  const onShowSizeChange = (current, pageSize, pagination) => {
    setPage(current);
    setSize(pageSize);
  };

  async function onChange(e, name, idGr) {
    const data = {
      subject: `user@${props.id}`,
      object: `cam_g@${idGr}`,
      action: name,
    };

    if (e.target.checked) {
      const isAdd = await CameraApi.setPermisionCamGroup(data);

      if (isAdd) {
        const notifyMess = {
          type: "success",
          title: "",
          description: `${t("noti.successfully_add_permission")}`,
        };
        Notification(notifyMess);

        setReload(!reload);
        // thêm 2 bản ghi lúc cập nhập sẽ mất 1 bản ---> không cho chọn nhiều, nếu không reload sẽ không xóa đc luôn, phải reload sau đó mới xóa đc.
        await handleRefreshCameraPage();
      }
      return;
    }

    const dataRemove = {
      policies: [data],
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
      await handleRefreshCameraPage();
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
    const index = data?.p_camera_groups.findIndex(
      (x) => x.uuid === record.cam_group_uuid
    );

    if (index < 0) return;

    let new_p_camera_groups = [...data?.p_camera_groups];
    new_p_camera_groups.splice(index, 1);
    setData({ ...data, p_camera_groups: new_p_camera_groups });
  };

  const removeAllPermmision = async (record) => {
    let data = [];

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

      let dataRemove = [];

      dataRemove.push({
        subject: `user@${props?.id}`,
        object: `cam_g@${record?.cam_group_uuid}`,
        action: "view_online",
      });

      await CameraApi.removePermisionCamGroup({
        policies: dataRemove,
      });

      Notification(notifyMess);

      setReload(!reload);
      await handleRefreshCameraPage();
      removeItem(record);

      return;
    }

    if (record?.view_online) {
      data.push({
        subject: `user@${props?.id}`,
        object: `cam_g@${record?.cam_group_uuid}`,
        action: "view_online",
      });
    }

    if (record?.view_offline) {
      data.push({
        subject: `user@${props?.id}`,
        object: `cam_g@${record?.cam_group_uuid}`,
        action: "view_offline",
      });
    }

    if (record?.setup_preset) {
      data.push({
        subject: `user@${props?.id}`,
        object: `cam_g@${record?.cam_group_uuid}`,
        action: "setup_preset",
      });
    }

    if (record?.ptz_control) {
      data.push({
        subject: `user@${props?.id}`,
        object: `cam_g@${record?.cam_group_uuid}`,
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
      await handleRefreshCameraPage();
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
        onChange={(e) => onChange(e, "view_online", record.cam_group_uuid)}
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
        onChange={(e) => onChange(e, "view_offline", record.cam_group_uuid)}
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
        onChange={(e) => onChange(e, "setup_preset", record.cam_group_uuid)}
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
        onChange={(e) => onChange(e, "ptz_control", record.cam_group_uuid)}
        checked={defaultChecked}
        disabled={record.isDisableRow}
      ></Checkbox>
    );
  };

  const renderHeader = () => {
    return (
      <>
        <h4>{t("view.user.detail_list.grant_permission_by_camera_group")}</h4>

        {permissionCheck("assign_user_permission") && !props?.isMyInfor && (
          <div>
            <Tooltip
              placement="topRight"
              title={t(
                "view.user.detail_list.add_camera_group_choose_permission"
              )}
            >
              <Button
                type="primary"
                className="btnAdd"
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
      title: `${t("view.user.detail_list.group_name", {
        G: t("G"),
        g: t("g"),
      })}`,
      dataIndex: "cam_group_name",
      className: "headerUserColums",
      fixed: "left",
      width: "15%"
    },
    {
      title: `${t("R")}`,
      dataIndex: "role_cam_group",
      className: "headerUserColums",
      render: renderRole,
      width: "15%"
    },
    {
      title: `${t("G")}`,
      dataIndex: "user_cam_group",
      className: "headerUserColums",
      render: userGroup,
      width: "15%"
    },
    {
      title: `${t("view.user.detail_list.view_online")}`,
      dataIndex: "view_online",
      className: "headerUserColums",
      render: (text, record) => {
        return <Space>{viewOnline(record)}</Space>;
      },
    },
    {
      title: `${t("view.user.detail_list.view_offline")}`,
      dataIndex: "view_offline",
      className: "headerUserColums",
      render: (text, record) => {
        return <Space>{viewOffline(record)}</Space>;
      },
    },
    {
      title: `${t("view.user.detail_list.preset_setting")}`,
      dataIndex: "setup_preset",
      className: "headerUserColums",
      render: (text, record) => {
        return <Space>{setupPreset(record)}</Space>;
      },
    },
    {
      title: `${t("view.user.detail_list.control")}`,
      dataIndex: "ptz_control",
      className: "headerUserColums",
      render: (text, record) => {
        return <Space>{ptzControl(record)}</Space>;
      },
    },

    {
      title: `${t("view.user.detail_list.action")}`,
      className: "headerUserColums",
      fixed: "right",
      width: "12%",
      render: (text, record) => {
        return (
          <Space>
            {!record.isDisableRow && (
              <Popconfirm
                cancelText={t("view.user.detail_list.cancel")}
                okText={t("view.user.detail_list.confirm")}
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

  return (
    <div>
      <Table
        className="detail-user__table-camera-group"
        rowKey="uuid"
        columns={columns}
        dataSource={group}
        title={renderHeader}
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
          pageSizeOptions: [5, 10, 20, 50, 100],
          onShowSizeChange: (current, size) => {
            onShowSizeChange(current, size);
          },

          hideOnSinglePage: false,
          current: page,
          total: group.length,
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
        <ModalAddCameraGroup
          selectedAdd={selectedAdd}
          handleShowModalAdd={handleShowModalAdd}
          checkedGroups={checkedGroup}
          id={props?.id}
        />
      )}
    </div>
  );
}
