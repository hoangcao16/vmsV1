import 'antd/dist/antd.css';
import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';

const TableClearSetting = () => {
  useEffect(() => {
    document.title = 'CCTV | Cấu hình dọn dẹp';
  }, []);

  return (
    <>
      <h1>Quản lý cấu hình dọn dẹp</h1>
    </>
  );
};

export default withRouter(TableClearSetting);
