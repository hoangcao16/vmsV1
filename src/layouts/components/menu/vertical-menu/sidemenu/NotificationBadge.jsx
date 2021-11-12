import { NotificationOutlined } from '@ant-design/icons';
import { Badge, Image, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import permissionCheck from '../../../../../actions/function/MyUltil/PermissionCheck';
import { loadMessageUnread } from '../../../../../view/notification/redux/actions/handleMessageUnread';
import { loadMessageCount } from '../../../../../view/notification/redux/actions/messageCount';
import { loadPage } from '../../../../../view/notification/redux/actions/page';
import Notification from './../../../../../../src/view/notification/Notification';
import notificationInActive from '../../../../../assets/img/icons/menu-bar/inactive/notification.png'
import notificationActive from '../../../../../assets/img/icons/menu-bar/active/notification.png'
import { reactLocalStorage } from 'reactjs-localstorage';
import { useTranslation } from "react-i18next";

const NotificationBadge = (props) => {
  const { t } = useTranslation();
  const language = reactLocalStorage.get('language');
  const [isHidden, setIshidden] = useState(false);

  useEffect(() => {
    props.handleFetchData({ page: 0, pageSize: 20 });
  }, []);


  useEffect(() => {
    //Xử lí đánh dấu

    if (!isHidden) {
      props.handleSetPage();
    }
  }, [isHidden]);

  const onHiddenNotification = () => {
    setIshidden(!isHidden);
    props.handleMakeMessageUnread();
  };

  return (
    <>
      {permissionCheck('warning_message') ? (
        <div>
          {console.log('bye')}
          <Badge count={props?.messageCount}>
            <Tooltip
              placement="right"
              title={t('components.bookmark.notification')}
              arrowPointAtCenter={true}
              overlayStyle={{ position: 'fixed' }}

            >
              <Image src={isHidden ? notificationActive :
                notificationInActive}
                sizes={25} onClick={onHiddenNotification} preview={false}></Image>
            </Tooltip>
            {/* <NotificationOutlined
              style={{ fontSize: 25 }}
              onClick={onHiddenNotification}
            /> */}
          </Badge>
          {isHidden && (
            // <></>
            <Notification onHiddenNotification={onHiddenNotification} />
          )}
        </div>
      ) : null}
    </>
  );
};

const mapStateToProps = (state) => ({
  messageCount: state.notification.messageCount
});

const mapDispatchToProps = (dispatch) => {
  return {
    handleFetchData: (params) => {
      dispatch(loadMessageCount(params));
    },
    handleMakeMessageUnread: () => {
      dispatch(loadMessageUnread());
    },
    handleSetPage: () => {
      dispatch(loadPage());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NotificationBadge);
