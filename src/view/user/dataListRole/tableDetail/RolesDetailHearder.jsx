import { ArrowLeftOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Card, Modal, Tooltip } from 'antd';
import React from 'react';
import { useTranslation } from "react-i18next";
import { useHistory } from 'react-router-dom';
import { reactLocalStorage } from 'reactjs-localstorage';
import UserApi from '../../../../actions/api/user/UserApi';
import permissionCheck from '../../../../actions/function/MyUltil/PermissionCheck';
import Notification from '../../../../components/vms/notification/Notification';
import './ModalWarning.scss';
import './RolesDetailHearder.scss';


export default function RolesDetailHearder(props) {
  const { t } = useTranslation();
  const his = useHistory();
  function warning() {
    Modal.warning({
      title: `${t('noti.deleting')}`,
      content: `${t('noti.remove_all_info')}`,
      closable: true,
      onOk: async () => {
        UserApi.deleteRoles(props?.rolesUuid).then((result) => {
          if (result) {
            const notifyMess = {
              type: 'success',
              title: '',
              description: `${t('noti.successfully_delete_role')}`,
            };
            Notification(notifyMess);
            reactLocalStorage.setObject('tabIndex', 3);
            his.go(-1);
          }
        });
      }
    });
  }

  const goBack = () => {
    his.go(-1);
  };
  return (
    <div>
      <Card
        title={
          <>
            <h4 className="font-weight-700 titleUserDetail d-flex align-item-center">
              <ArrowLeftOutlined onClick={goBack} />
                {t('R')}
            </h4>
          </>
        }
        extra={
          permissionCheck('delete_user_group') ? (
            <Tooltip placement="top" title={t('view.user.detail_list.delete_user_role', { delete: t('delete'), g: t('g'), u: t('u') })}>
              <Button
                className="btnDelete mr-1"
                onClick={warning}
                type="primary"
              >
                <DeleteOutlined />
              </Button>
            </Tooltip>
          ) : null
        }
        style={{ width: '100%' }}
        className="detail-role__info"
      >
        <p className="name__role">{props?.name}</p>
        <p className="description__role">{props?.description}</p>
      </Card>
    </div>
  );
}
