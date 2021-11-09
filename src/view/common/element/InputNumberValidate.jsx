import { InputNumber } from 'antd';
import React from 'react';

export default function InputPosition(props) {
  return (
    <InputNumber
      formatter={(value) =>
        value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
      }
      parser={(value) => value.replace(/ /g, '')}
      {...props}
    />
  );
}
