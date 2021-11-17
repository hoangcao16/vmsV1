import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Checkbox, Popconfirm, Space, Table, Tooltip } from 'antd';
import { isEmpty } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CameraApi from '../../../../actions/api/camera/CameraApi';
import GroupApi from '../../../../actions/api/group/GroupApi';
import UserApi from '../../../../actions/api/user/UserApi';
import { ShowTotal } from '../../../../styled/showTotal';
import '../../../commonStyle/commonAuto.scss';
import '../../../commonStyle/commonSelect.scss';
import Notification from './../../../../components/vms/notification/Notification';
import ModalAddCamera from './ModalAddCamera';
import './TableCameraPermission.scss';

export default function TableCameraPermission(props) {
  const { t } = useTranslation();
  const [reload, setReload] = useState(false);
  const [camera, setCamera] = useState([]);
  const [selectedAdd, setSelectedAdd] = useState(false);
  const [cameraPermission, setCameraPermission] = useState([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(5);

  useEffect(() => {
    setCameraPermission(props?.cameraPermission);
  }, [props?.cameraPermission]);

  const [reloadCameraPage, setReloadCameraPage] = useState(
    props?.reloadCameraPage
  );

  useEffect(() => {
    GroupApi.getGroupByUuid(props?.groupUuid).then(async (result) => {
      const data = await UserApi.getUserByGroupUuid(result?.code);
      setCameraPermission(data?.p_cameras);
    });
  }, [reload]);

  useEffect(() => {
    let data = {
      name: '',
      provinceId: '',
      districtId: '',
      id: '',
      administrativeUnitUuid: '',
      vendorUuid: '',
      status: '',
      page: 0,
      size: 1000000
    };

    setReloadCameraPage(props?.reloadCameraPage);

    CameraApi.getAllCamera(data).then(setCamera);
    GroupApi.getGroupByUuid(props?.groupUuid).then(async (result) => {
      const data = await UserApi.getUserByGroupUuid(result?.code);
      setCameraPermission(data?.p_cameras);
    });
  }, [props?.reloadCameraPage, reload]);

  const convertDatacameras = (data) => {
    return data.map((pc) => {
      const cam = camera.find((c) => c.uuid === pc.cam_uuid);

      const permision = pc.permissions.map((p) => {
        return {
          [p]: 1
        };
      });

      const permisionConvert = Object.assign({}, ...permision);

      return {
        ...permisionConvert,
        cam_name: cam?.name,
        cam_uuid: pc?.cam_uuid,
        // isDisableRow: checkDisable(pc.cam_group_uuid, groups) // đk để hiển thị là
        isDisableRow: false // đk để hiển thị là
      };
    });
  };

  // const checkDisable = (id, data) => {
  //   if (isEmpty(data)) {
  //     return false;
  //   }

  //   const dataFilter = data.filter((x) => x.cam_group_uuid === id);

  //   return !isEmpty(dataFilter);
  // };

  let cameras = [];

  if (!isEmpty(cameraPermission)) {
    cameras = convertDatacameras(cameraPermission);
  }

  const checkedGroup = cameras.map((c) => c.cam_uuid);

  const handleShowModalAdd = (selectedRowKeys) => {
    setSelectedAdd(false);

    if (isEmpty(selectedRowKeys)) {
      return;
    }

    const cameraAdd = selectedRowKeys.map((s) => {
      const cam = cameraPermission.find((c) => c.cam_uuid === s); // cái nào có sẵn trong p_cameras thì lấy

      const cam2 = camera.find((c) => c.uuid === s); // không có trong p_cameras == > bảng camera mà tìm

      if (cam) {
        return cam;
      }

      return {
        ...cam2,
        cam_name: cam2?.name,
        cam_uuid: cam2?.uuid,
        cam_group_uuid: cam2?.cam_group_uuid,
        permissions: ['view_online'],
        isDisableRow: false
      };
    });
    setCameraPermission(cameraAdd);
  };

  const showModalAdd = () => {
    setSelectedAdd(true);
  };

  async function onChange(e, name, id) {
    const data = {
      subject: `user_g@${props?.groupCode}`,
      object: `cam@${id}`,
      action: name
    };

    if (e.target.checked) {
      const isAdd = await CameraApi.setPermisionCamGroup(data);

      if (isAdd) {
        setReload(!reload);
        const notifyMess = {
          type: 'success',
          title: '',
          description: 'Thêm quyền thành công'
        };
        Notification(notifyMess);
      }
      return;
    }

    const dataRemove = {
      policies: [data]
    };

    const isRemove = await CameraApi.removePermisionCamGroup(dataRemove);

    if (isRemove) {
      setReload(!reload);
      const notifyMess = {
        type: 'success',
        title: '',
        description: 'Xóa quyền thành công'
      };
      Notification(notifyMess);
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
    const index = cameraPermission.findIndex((x) => x.uuid === record.cam_uuid);

    if (index < 0) return;

    let new_p_cameras = [...cameraPermission];
    new_p_cameras.splice(index, 1);
    setCameraPermission(new_p_cameras);
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
        object: `cam@${record.cam_uuid}`,
        action: 'view_online'
      });
      await CameraApi.removePermisionCamGroup({
        policies: dataRemove
      });

      removeItem(record);
      setReload(!reload);

      return;
    }
    let data = [];

    if (record?.view_online) {
      data.push({
        subject: `user_g@${props?.groupCode}`,
        object: `cam@${record.cam_uuid}`,
        action: 'view_online'
      });
    }

    if (record?.view_offline) {
      data.push({
        subject: `user_g@${props?.groupCode}`,
        object: `cam@${record.cam_uuid}`,
        action: 'view_offline'
      });
    }

    if (record?.setup_preset) {
      data.push({
        subject: `user_g@${props?.groupCode}`,
        object: `cam@${record.cam_uuid}`,
        action: 'setup_preset'
      });
    }

    if (record?.ptz_control) {
      data.push({
        subject: `user_g@${props?.groupCode}`,
        object: `cam@${record.cam_uuid}`,
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
        description: 'Đã xóa dữ liệu thành công !'
      };
      Notification(notifyMess);
      setReload(!reload);
      // await handleRefreshCameraPage();
    } else {
      const notifyMess = {
        type: 'error',
        title: '',
        description: 'Xóa quyền thất bại'
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
        onChange={(e) => onChange(e, 'view_online', record.cam_uuid)}
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
        onChange={(e) => onChange(e, 'view_offline', record.cam_uuid)}
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
        onChange={(e) => onChange(e, 'setup_preset', record.cam_uuid)}
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
        onChange={(e) => onChange(e, 'ptz_control', record.cam_uuid)}
        checked={defaultChecked}
        disabled={record.isDisableRow}
      ></Checkbox>
    );
  };

  const renderHeader = () => {
    return (
      <>
        <h4 className="font-weight-700">
          {t('view.user.detail_list.grant_permission_by_camera')}
        </h4>

        <Tooltip
          placement="top"
          title={t('view.user.detail_list.add_camera_choose_permission')}
        >
          <Button
            type="primary"
            className="btnAddCameraPermission"
            style={{ borderRadius: '6px' }}
            onClick={showModalAdd}
          >
            <PlusOutlined />
          </Button>
        </Tooltip>
      </>
    );
  };
  const columns = [
    {
      title: 'Camera',
      dataIndex: 'cam_name',
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

  const onShowSizeChange = (current, pageSize) => {
    setPage(current);
    setSize(pageSize);
  };

  return (
    <div>
      <Table
        className="detail-group-user__permission-by-camera mt-3"
        rowKey="uuid"
        columns={columns}
        dataSource={cameras}
        title={renderHeader}
        rowClassName={(record) => record.isDisableRow && 'disabled-row'}
        pagination={{
          showSizeChanger: true,
          onShowSizeChange: (current, size) => {
            onShowSizeChange(current, size);
          },
          pageSizeOptions: [5, 10, 20, 50, 100],
          hideOnSinglePage: false,
          current: page,
          total: cameras.length,
          pageSize: size,
          onChange: (value) => {
            setPage(value);
          },
          showTotal: (total, range) => {
            return (
              <ShowTotal className="show--total">
                {t('view.user.detail_list.viewing')} {range[0]}{' '}
                {t('view.user.detail_list.to')} {range[1]}{' '}
                {t('view.user.detail_list.out_of')} {total}{' '}
                {t('view.user.detail_list.indexes')}
              </ShowTotal>
            );
          }
        }}
      />
      {selectedAdd && (
        <ModalAddCamera
          selectedAdd={selectedAdd}
          handleShowModalAdd={handleShowModalAdd}
          checkedGroups={checkedGroup}
          id={props?.id}
          groupCode={props.groupCode}
        />
      )}
    </div>
  );
}
