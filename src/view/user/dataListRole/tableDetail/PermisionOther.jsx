import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Space, Table, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CameraApi from '../../../../actions/api/camera/CameraApi';
import UserApi from '../../../../actions/api/user/UserApi';
import { ShowTotal } from '../../../../styled/showTotal';
import '../../../commonStyle/commonAuto.scss';
import '../../../commonStyle/commonSelect.scss';
import Notification from './../../../../components/vms/notification/Notification';
import ModalAddPermissionOthers from './ModalAddPermissionOthers';
import './PermisionOther.scss';

export default function PermisionOther(props) {
  const { t } = useTranslation();
  const [pemissionOthers, setPemissionOthers] = useState([]);
  const [selectedAdd, setSelectedAdd] = useState(false);
  const [reload, setReload] = useState(false);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(5);

  useEffect(() => {
    UserApi.getRoleByUuid(props?.rolesUuid).then(async (result) => {
      const data = await UserApi.getRoleByRoleCode({ code: result?.code });

      setPemissionOthers(data?.p_others);
    });
  }, [reload, selectedAdd]);

  const removePermissionOther = async (perCode) => {
    const data = {
      subject: `role@${props?.rolesCode}`,
      object: `role@${props?.rolesCode}`,
      action: perCode
    };

    const dataRemove = {
      policies: [data]
    };

    const isDelete = await CameraApi.removePermisionCamGroup(dataRemove);

    if (isDelete) {
      const notifyMess = {
        type: 'success',
        title: '',
        description: `${t('noti.successfully_delete_permission')}`,
      };
      Notification(notifyMess);

      setReload(!reload);

      UserApi.getRoleByUuid(props?.rolesUuid).then(async (result) => {
        const data = await UserApi.getRoleByRoleCode({ code: result?.code });

        setPemissionOthers(data?.p_others);
      });
    }
  };

  const renderHeader = () => {
    return (
      <>
        <h4 className="font-weight-700">{t('view.user.detail_list.permission')}</h4>

        <Tooltip placement="top" title={t('view.user.detail_list.add_permission', { add: t('add') })}>
          <Button
            type="primary"
            className="btnAddPermission height-40 mr-1"
            onClick={showModalAdd}
          >
            <PlusOutlined />
          </Button>
        </Tooltip>
      </>
    );
  };

  const handleShowModalAdd = () => {
    setSelectedAdd(false);
  };

  const showModalAdd = () => {
    setSelectedAdd(true);
  };

  const checkedPermission = pemissionOthers.map((po) => po.code);

  const columns = [
    {
      title: `${t('view.user.detail_list.permission_name')}`,
      dataIndex: 'name',
      className: 'headerUserColums'
    },
    {
      title: `${t('view.user.detail_list.desc')}`,
      dataIndex: 'description',
      className: 'headerUserColums'
    },
    {
      title: `${t('view.user.detail_list.action')}`,
      fixed: 'right',
      className: 'headerUserColums',
      width: '15%',
      render: (text, record) => {
        return (
          <Space>
            <Popconfirm
              title={t('noti.delete_permission', { g: t('g'), this: t('this') })}
              onConfirm={() => removePermissionOther(record.code)}
            >
              <CloseOutlined />
            </Popconfirm>
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
      <div>
        <Table
          className="detail-role__permission-role mt-3"
          rowKey="uuid"
          columns={columns}
          dataSource={pemissionOthers}
          title={renderHeader}
          pagination={{
            showSizeChanger: true,
            onShowSizeChange: (current, size) => {
              onShowSizeChange(current, size);
            },
            pageSizeOptions: [5,10,20,50,100],
            hideOnSinglePage: false,
            current: page,
            total: pemissionOthers.length,
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
          <ModalAddPermissionOthers
            selectedAdd={selectedAdd}
            handleShowModalAdd={handleShowModalAdd}
            rolesUuid={props?.rolesUuid}
            rolesCode={props?.rolesCode}
            checkedPermission={checkedPermission}
          />
        )}
      </div>
    </div>
  );
}
