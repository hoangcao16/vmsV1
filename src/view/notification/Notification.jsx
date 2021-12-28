import { ExclamationOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import { connect } from 'react-redux';
// import { renderText } from "../user/dataListUser/components/TableListUser";
import './Notification.scss';
import { loadNotification } from './redux/actions';

const { Text } = Typography;

const Notification = (props) => {
  const { t } = useTranslation();
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    props.handleFetchData();
  }, []);

  const formatDate = (date) => {
    let formatted_date =
      date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
    return formatted_date;
  };

  const fetchMoreData = () => {
    if (props?.notif.length >= props?.total) {
      setHasMore(false);
      return;
    }
    props.handleFetchData();
  };

  const renderText = (cellValue) => {
    if (isEmpty(cellValue)) {
      return <Text type="warning">{t('noti.no_information')}</Text>;
    }
    return (
      <Text style={{ maxWidth: '100%' }}>
        {cellValue}
      </Text>
    );
  };
  const listItems = props?.notif.map((n, index) => (
    <li key={index} className={`notif_list ${n?.isSeen ? 'seen' : ''}`}>
      <div className="notif_list__content--header">
        <div className='notif__description'>
          <div className="notif__title">
            {n?.type === 'WARNING_DISK'
              ? renderText(`${t('noti.warning_hard_drive_is_full')}`)
              : renderText(`${t('noti.warning_camera')}`)}
          </div>
          <div className="notif__day">
            {isEmpty(n.createdTime)
              ? formatDate(new Date(n?.createdTime))
              : `${t('noti.donot_have')}`}
          </div>
          <div className="notif__time">
            {isEmpty(n.createdTime)
              ? new Date(n?.createdTime).toLocaleTimeString()
              : `${t('noti.donot_have')}`}
          </div>
        </div>

        <div className="notif__icon">
          <div className={`yellow ${n?.type === 'WARNING_DISK' ? 'red' : ''}`}>
            <ExclamationOutlined />
          </div>
        </div>
      </div>

      <div className="notif_list__content--body">
        {n?.type === 'WARNING_DISK'
          ? `  ${t('noti.hard_drive')} ${!isEmpty(n?.name) ? n?.name : `${t('noti.donot_have')}`} ${t('noti.is_used')}
        ${!isEmpty(n?.percentUsed) ? `${n?.percentUsed}%` : `${t('noti.donot_have')}`
          }. ${t('noti.estimated_remaining_usable_time_is')}
        ${!isEmpty(n?.estimatedTime) ? n?.estimatedTime : `${t('noti.donot_have')}`}.`
          : `Camera ${n?.name} ${n?.status ? `${t('noti.active')}` : `${t('noti.inactive')}`} `}
      </div>
    </li>
  ));

  const handleParentClick = () => {
    props.onHiddenNotification();
  };
  const handleChildClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className='notification__scroll--infinite__wrapper' onClick={handleParentClick}>
      <div className="notification__scroll--infinite" >
        <div onClick={(e) => handleChildClick(e)}>

          <InfiniteScroll
            className="notifi"
            onClick={(e) => {
              e.stopPropagation();
            }}
            dataLength={props?.notif.length}
            next={fetchMoreData}
            hasMore={hasMore}


            // loader={<h4>Loading...</h4>}
            height={400}
            endMessage={
              <p style={{ textAlign: 'center' }}>
                <b>{t('noti.watched_all_notifications')}</b>
              </p>
            }
          >
            {props?.notif ?
              <ul className='list__notification'>
                {listItems}
              </ul> :
              <p style={{
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '1.8rem'
              }}>
                <b>{t('noti.error_loading_notifications')}</b>
              </p>}

          </InfiniteScroll>
        </div>
      </div>
    </div>

  );
};

const mapStateToProps = (state) => ({
  isLoading: state.notification.isLoading,
  notif: state.notification.notif,
  error: state.notification.error,
  total: state.notification.total
});

const mapDispatchToProps = (dispatch) => {
  return {
    handleFetchData: (params) => {
      dispatch(loadNotification(params));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Notification);
