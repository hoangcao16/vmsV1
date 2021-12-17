import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Space, Table, Tag, Tooltip } from 'antd';
import { isEmpty } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import GroupApi from '../../../../actions/api/group/GroupApi';
import UserApi from '../../../../actions/api/user/UserApi';
import Notification from '../../../../components/vms/notification/Notification';
import { ShowTotal } from '../../../../styled/showTotal';
import '../../../commonStyle/commonAuto.scss';
import '../../../commonStyle/commonSelect.scss';
import { renderText } from '../../dataListUser/components/TableListUser';
import './MemberInGroup.scss';
import ModalAddMemberInGroup from './ModalAddMemberInGroup';
import { useTranslation } from "react-i18next";

export default function MemberInGroup(props) {
  const { t } = useTranslation();
  const [member, setMember] = useState([]);

  const [selectedAdd, setSelectedAdd] = useState(false);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(5);

  const showModalAdd = () => {
    setSelectedAdd(true);
  };

  useEffect(() => {
    GroupApi.getGroupByUuid(props?.groupUuid).then(async (result) => {
      const data = await UserApi.getUserByGroupUuid(result?.code);
      setMember(data?.users);
    });
  }, [selectedAdd]);

  const renderHeader = () => {
    return (
      <>
        <h4>{t('view.user.detail_list.member')}</h4>
        <div className="d-flex">
          <Tooltip placement="top" title={t('view.user.detail_list.add_member', { add: t('add') })}>
            <Button
              type="primary"
              className="btnAddMember height-40 mr-1"
              style={{ borderRadius: '6px' }}
              onClick={showModalAdd}
            >
              <PlusOutlined />
            </Button>
          </Tooltip>
        </div>
      </>
    );
  };

  const removeUser = async (userUuid) => {
    let dataRemove = {
      user_uuid: userUuid,
      group_uuid: props.groupUuid
    };

    const isDelete = await UserApi.removeUserInGroup(dataRemove);
    if (isDelete) {
      const notifyMess = {
        type: 'success',
        title: '',
        description: `${t('noti.successfully_delete_menber')}`
      };
      Notification(notifyMess);
      const dataAfterRemove = await UserApi.getUserByGroupUuid(
        props?.groupCode
      );

      setMember(dataAfterRemove?.users);
    }
  };

  const renderRoles = (cell) => {
    if (isEmpty(cell)) {
      return;
    }

    return cell.map((c) => {
      return (
        <Tag className="tableTag" color="rgba(108, 117, 125, 0.12)">
          {c}
        </Tag>
      );
    });
  };

  let checkedGroup = [];

  if (!isEmpty(member)) {
    checkedGroup = member.map((c) => c.uuid);
  }

  const handleShowModalAdd = () => {
    setSelectedAdd(false);
  };

  const columns = [
    {
      title: `${t('view.user.detail_list.member_name')}`,
      dataIndex: 'name',
      className: 'headerUserColums',
      render: renderText,
      width: '15%'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      className: 'headerUserColums',
      render: renderText,
      width: '15%'
    },
    {
      title: `${t('R')}`,
      dataIndex: 'roles',
      className: 'headerUserColums',
      render: renderRoles
    },

    {
      title: `${t('components.bookmark.action')}`,
      fixed: 'right',
      className: 'headerUserColums',
      width: '15%',
      render: (text, record) => {
        return (
          <Space>
            <Popconfirm
              title={t('noti.remove_member')}
              onConfirm={() => removeUser(record.uuid)}
            >
              <CloseOutlined style={{ fontSize: '10px', color: '#6E6B7B' }} />
            </Popconfirm>
          </Space>
        );
      }
    }
  ];

  // if (isEmpty(member)) {
  //   return <Spin />;
  // }
  const onShowSizeChange = (current, pageSize) => {
    setPage(current);
    setSize(pageSize);
  };

  return (
    <div>
      <div>
        <Table
          className="detail-group-user__member"
          rowKey="uuid"
          columns={columns}
          dataSource={member}
          title={renderHeader}
          pagination={{
            showSizeChanger: true,
            onShowSizeChange: (current, size) => {
              onShowSizeChange(current, size);
            },
            pageSizeOptions: [5,10,20,50,100],
            hideOnSinglePage: false,
            current: page,
            total: member.length,
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
          <ModalAddMemberInGroup
            selectedAdd={selectedAdd}
            handleShowModalAdd={handleShowModalAdd}
            checkedGroup={checkedGroup}
            groupUuid={props?.groupUuid}
          />
        )}
      </div>
    </div>
  );
}
