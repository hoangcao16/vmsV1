import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Checkbox, Popconfirm, Space, Table, Tooltip } from 'antd';
import { isEmpty } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import CameraApi from '../../../../actions/api/camera/CameraApi';
import GroupApi from '../../../../actions/api/group/GroupApi';
import UserApi from '../../../../actions/api/user/UserApi';
import { ShowTotal } from '../../../../styled/showTotal';
import '../../../commonStyle/commonAuto.scss';
import '../../../commonStyle/commonSelect.scss';
import Notification from './../../../../components/vms/notification/Notification';
import ModalAddCameraGroup from './ModalAddCameraGroup';
import './TableCameraGroupPermission.scss';
import { useTranslation } from "react-i18next";


export default function TableCameraGroupPermission(props) {
  const { handleRefreshCameraPage } = props;
  const { t } = useTranslation(); 
  const [reload, setReload] = useState(false);
  const [cameraGroup, setCameraGroup] = useState([]);
  const [cameraGroupPermision, setCameraGroupPermision] = useState([]);
  const [selectedAdd, setSelectedAdd] = useState(false);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(5);

  useEffect(() => {
    CameraApi.getAllGroupCamera({ name: '' }).then(setCameraGroup);
    setCameraGroupPermision(props?.cameraGroupPermision);
  }, [props?.cameraGroupPermision]);

  useEffect(() => {
    GroupApi.getGroupByUuid(props?.groupUuid).then(async (result) => {
      const data = await UserApi.getUserByGroupUuid(result?.code);

      setCameraGroupPermision(data?.p_camera_groups);
    });
  }, [reload]);

  const convertDataTest = (data) => {
    const result = data.filter((p) => isEmpty(p.parent));

    return result.map((camG) => {
      const permision = camG?.permissions.map((p) => {
        return {
          [p]: 1
        };
      });

      const permisionConvert = Object.assign({}, ...permision);

      return {
        ...permisionConvert,
        cam_group_uuid: camG?.cam_group_uuid,
        cam_group_name: camG?.cam_group_name,
        isDisableRow: false
      };
    });
  };

  let group = [];

  if (!isEmpty(cameraGroupPermision)) {
    group = convertDataTest(cameraGroupPermision);
  }

  const handleShowModalAdd = async (selectedRowKeys) => {
    setSelectedAdd(false);

    if (isEmpty(selectedRowKeys)) {
      return;
    }

    const group = selectedRowKeys?.map((s) => {
      const cam = cameraGroupPermision.find((c) => c.cam_group_uuid === s);

      const camG = cameraGroup.find((c) => c.uuid === s);

      if (cam) {
        return cam;
      }

      return {
        ...camG,
        cam_group_uuid: camG.uuid,
        cam_group_name: camG.name,
        permissions: ['view_online']
      };
    });

    setCameraGroupPermision(group);
    setReload(!reload);

    await handleRefreshCameraPage();

  };

  const checkedGroup = group.map((t) => t.cam_group_uuid);

  async function onChange(e, name, idGr) {
    const data = {
      subject: `user_g@${props?.groupCode}`,
      object: `cam_g@${idGr}`,
      action: name
    };
    if (e.target.checked) {
      const isAdd = await CameraApi.setPermisionCamGroup(data);

      if (isAdd) {
        const notifyMess = {
          type: 'success',
          title: '',
          description: 'Thêm quyền thành công'
        };
        Notification(notifyMess);

        setReload(!reload);
        await handleRefreshCameraPage();
      }
      return;
    }

    const dataRemove = {
      policies: [data]
    };

    const isRemove = await CameraApi.removePermisionCamGroup(dataRemove);

    if (isRemove) {
      const notifyMess = {
        type: 'success',
        title: '',
        description: 'Xóa quyền thành công'
      };
      Notification(notifyMess);

      setReload(!reload);
      await handleRefreshCameraPage();
    } else {
      const notifyMess = {
        type: 'error',
        title: '',
        description: 'Xóa quyền thất bại'
      };
      Notification(notifyMess);
    }
  }

  const removeItem = (record) => {
    const index = cameraGroupPermision.findIndex(
      (x) => x.uuid === record.cam_group_uuid
    );

    if (index < 0) return;

    let new_p_camera_groups = [...cameraGroupPermision];
    new_p_camera_groups.splice(index, 1);
    setCameraGroupPermision(new_p_camera_groups);
  };

  const removeAllPermmision = async (record) => {
    if (
      record?.view_online &&
      !record?.view_offline &&
      !record?.setup_preset &&
      !record?.ptz_control
    ) {
      const notifyMess = {
        type: 'success',
        title: '',
        description: 'Đã xóa dữ liệu thành công !'
      };
      Notification(notifyMess);

      let dataRemove = [];

      dataRemove.push({
        subject: `user_g@${props?.groupCode}`,
        object: `cam_g@${record.cam_group_uuid}`,
        action: 'view_online'
      });
      await CameraApi.removePermisionCamGroup({
        policies: dataRemove
      });

      setReload(!reload);
      await handleRefreshCameraPage();
      removeItem(record);

      return;
    }
    let data = [];

    if (record?.view_online) {
      data.push({
        subject: `user_g@${props?.groupCode}`,
        object: `cam_g@${record.cam_group_uuid}`,
        action: 'view_online'
      });
    }
    if (record?.view_offline) {
      data.push({
        subject: `user_g@${props?.groupCode}`,
        object: `cam_g@${record.cam_group_uuid}`,
        action: 'view_offline'
      });
    }
    if (record?.setup_preset) {
      data.push({
        subject: `user_g@${props?.groupCode}`,
        object: `cam_g@${record.cam_group_uuid}`,
        action: 'setup_preset'
      });
    }
    if (record?.ptz_control) {
      data.push({
        subject: `user_g@${props?.groupCode}`,
        object: `cam_g@${record.cam_group_uuid}`,
        action: 'ptz_control'
      });
    }

    const dataRemove = {
      policies: data
    };

    const isRemove = await CameraApi.removePermisionCamGroup(dataRemove);

    if (isRemove) {
      const notifyMess = {
        type: 'success',
        title: '',
        description: 'Xóa quyền thành công'
      };
      Notification(notifyMess);
      setReload(!reload);
      await handleRefreshCameraPage();
    } else {
      const notifyMess = {
        type: 'error',
        title: '',
        description: 'Xóa quyền thất bại'
      };
      Notification(notifyMess);
    }
  };

  // const handleShowModalAdd = () => {
  //   setSelectedAdd(false);
  // };

  const showModalAdd = () => {
    setSelectedAdd(true);
  };

  const viewOnline = (record) => {
    let defaultChecked = true;

    if (record.view_online === undefined) {
      defaultChecked = false;
    }

    return (
      <Checkbox
        onChange={(e) => onChange(e, 'view_online', record.cam_group_uuid)}
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
        onChange={(e) => onChange(e, 'view_offline', record.cam_group_uuid)}
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
        onChange={(e) => onChange(e, 'setup_preset', record.cam_group_uuid)}
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
        onChange={(e) => onChange(e, 'ptz_control', record.cam_group_uuid)}
        checked={defaultChecked}
        disabled={record.isDisableRow}
      ></Checkbox>
    );
  };

  // const viewOnline = (record) => {
  //   let defaultChecked = true;

  //   if (record.view_online === undefined) {
  //     defaultChecked = false;
  //   }

  //   return (
  //     <Checkbox
  //       onChange={(e) => onChange(e, 'view_online', record.cam_uuid)}
  //       checked={defaultChecked}
  //       disabled={record.isDisableRow}
  //     ></Checkbox>
  //   );
  // };

  // const viewOffline = (record) => {
  //   let defaultChecked = true;

  //   if (record.view_offline === undefined) {
  //     defaultChecked = false;
  //   }

  //   return (
  //     <Checkbox
  //       onChange={(e) => onChange(e, 'view_offline', record.cam_uuid)}
  //       checked={defaultChecked}
  //       disabled={record.isDisableRow}
  //     ></Checkbox>
  //   );
  // };

  // const setupPreset = (record) => {
  //   let defaultChecked = true;

  //   if (record.setup_preset === undefined) {
  //     defaultChecked = false;
  //   }

  //   return (
  //     <Checkbox
  //       onChange={(e) => onChange(e, 'setup_preset', record.cam_uuid)}
  //       checked={defaultChecked}
  //       disabled={record.isDisableRow}
  //     ></Checkbox>
  //   );
  // };

  // const ptzControl = (record) => {
  //   let defaultChecked = true;

  //   if (record.ptz_control === undefined) {
  //     defaultChecked = false;
  //   }

  //   return (
  //     <Checkbox
  //       onChange={(e) => onChange(e, 'ptz_control', record.cam_uuid)}
  //       checked={defaultChecked}
  //       disabled={record.isDisableRow}
  //     ></Checkbox>
  //   );
  // };

  const renderHeader = () => {
    return (
      <>
        <h4>{t('view.user.detail_list.grant_permission_by_camera_group')}</h4>

        <Tooltip placement="top" title={t('view.user.detail_list.add_camera_group_choose_permission')}>
          <Button
            type="primary"
            className="btnAddGroupPermission height-40 mr-1"
            style={{ borderRadius: '6px' }}
            onClick={showModalAdd}
          >
            <PlusOutlined className="d-flex justify-content-between align-center" />
          </Button>
        </Tooltip>
      </>
    );
  };
  const columns = [
    {
      title: `${t('view.map.camera_group', { cam: t('camera') })}`,
      dataIndex: 'cam_group_name',
      className: 'headerUserColums'
    },

    {
      title: `${t('view.user.detail_list.view_online')}`,
      dataIndex: 'view_online',
      className: 'headerUserColums',
      render: (text, record) => {
        return <Space>{viewOnline(record)}</Space>;
      }
    },
    {
      title: `${t('view.user.detail_list.view_offline')}`,
      dataIndex: 'view_offline',
      className: 'headerUserColums',
      render: (text, record) => {
        return <Space>{viewOffline(record)}</Space>;
      }
    },
    {
      title: `${t('view.user.detail_list.preset_setting')}`,
      dataIndex: 'setup_preset',
      className: 'headerUserColums',
      render: (text, record) => {
        return <Space>{setupPreset(record)}</Space>;
      }
    },
    {
      title: `${t('view.user.detail_list.control')}`,
      dataIndex: 'ptz_control',
      className: 'headerUserColums',
      render: (text, record) => {
        return <Space>{ptzControl(record)}</Space>;
      }
    },
    {
      title: `${t('view.user.detail_list.action')}`,
      className: 'headerUserColums',
      fixed: 'right',
      width: '15%',
      render: (text, record) => {
        return (
          <Space>
            {!record.isDisableRow && (
              <Popconfirm
                title={t('noti.delete_all_permission')}
                onConfirm={() => removeAllPermmision(record)}
              >
                <CloseOutlined style={{ fontSize: '10px', color: '#6E6B7B' }} />
              </Popconfirm>
            )}
          </Space>
        );
      }
    }
  ];

  const onShowSizeChange = (current, pageSize, pagination) => {
    setPage(current);
    setSize(pageSize);
  };

  return (
    <div>
      <Table
        className="detail-group-user__permission-by-camera-group mt-3"
        rowKey="cam_group_uuid"
        columns={columns}
        dataSource={group}
        title={renderHeader}
        pagination={{
          showSizeChanger: true,
          onShowSizeChange: (current, size) => {
            onShowSizeChange(current, size);
          },
          pageSizeOptions: [5,10,20,50,100],
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
                {t('view.user.detail_list.viewing')} {range[0]} {t('view.user.detail_list.to')} {range[1]} {t('view.user.detail_list.out_of')} {total} {t('view.user.detail_list.indexes')}
              </ShowTotal>
            );
          }
        }}
      />
      {selectedAdd && (
        <ModalAddCameraGroup
          selectedAdd={selectedAdd}
          handleShowModalAdd={handleShowModalAdd}
          checkedGroups={checkedGroup}
          id={props?.id}
          groupCode={props?.groupCode}
        />
      )}
    </div>
  );
}
