import { Spin } from 'antd';
import React from 'react';

export default function Loading() {
  return (
    <div className="w-100 text-center p-5">
      <Spin size="large" />
    </div>
  );
}
