import { notification } from 'antd';
import React from 'react';

const Notifi = (type, message, description) => {
  notification[type]({
    message: message,
    description: description
  });
};
export default Notifi;
