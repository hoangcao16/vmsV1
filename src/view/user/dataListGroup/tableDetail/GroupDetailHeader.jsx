import { ArrowLeftOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Card, Divider, Modal, Tooltip } from 'antd';
import React from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { reactLocalStorage } from 'reactjs-localstorage';
import UserApi from '../../../../actions/api/user/UserApi';
import permissionCheck from '../../../../actions/function/MyUltil/PermissionCheck';
import Notification from '../../../../components/vms/notification/Notification';
import './GroupDetailHeader.scss';
import { useTranslation } from "react-i18next";

export default function GroupDetailHeader(props) {
  const { t } = useTranslation();
  let { path } = useRouteMatch();
  const his = useHistory();
  function warning() {
    Modal.warning({
      title: `${t('noti.deleting')}`,
      content: `${t('noti.remove_all_info')}`,
      closable: true,
      onOk: () => {
        UserApi.deleteGroup(props?.groupUuid).then((result) => {
          if (result) {
            const notifyMess = {
              type: 'success',
              title: '',
              description: `${t('noti.successfully_delete_group')}`,
            };
            Notification(notifyMess);
            reactLocalStorage.setObject('tabIndex', 2);
            // history.push(`${path}`);
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
            <h4 className=" titleUserDetail">
              <ArrowLeftOutlined className="mr-1" onClick={goBack} />
              {t('view.user.user_group', { G: t('G'), U: t('U'), u: t('u') })}
            </h4>
          </>
        }
        extra={
          permissionCheck('delete_user_group') ? (
            <Tooltip placement="top" title={t('view.user.detail_list.delete_user_group', { delete: t('delete'), g: t('g'), u: t('u') })}>
              <Button
                className="btnDelete"
                onClick={warning}
                type="primary"
              >
                <DeleteOutlined />
              </Button>
            </Tooltip>
          ) : null
        }
        style={{ width: '100%' }}
        className="detail-group-user__info"
      >
        <p className="name__group-user">{props?.name}</p>
        <p className="description__group-user">{props?.description}</p>
      </Card>
    </div>
  );
}
