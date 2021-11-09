import {
  CheckOutlined,
  ExclamationOutlined,
  PicRightOutlined
} from '@ant-design/icons';
import { notification } from 'antd';
import React from 'react';
import './Notification.scss';

const renderIconNotify = (type) => {
  if (type == 'success') return <CheckOutlined />;
  else if (type == 'warning') return <ExclamationOutlined />;
  else return <PicRightOutlined />;
};

const Notification = ({ type, title, description, duration = 3 }) => {
  return notification[`${type}`]({
    message: title,
    description: description,
    duration: duration,
    icon: renderIconNotify(type)
  });
};

export default Notification;
