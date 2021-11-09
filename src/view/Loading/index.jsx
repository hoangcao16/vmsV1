import React from 'react';
import { CoverModal, CoverPage, Row } from './styled';
import { Spin } from 'antd';
const Loading = ({ type = 'fullpage', style = {} }) => {
  if (type === 'inline') {
    return (
      <Row style={style}>
        <Spin />
      </Row>
    );
  }
  if (type === 'modal') {
    return (
      <CoverModal style={{ ...style, position: 'absolute' }}>
        <Spin />
      </CoverModal>
    );
  }
  return (
    <CoverPage style={{ ...style, position: 'fixed' }}>
      <Spin />
    </CoverPage>
  );
};
export default Loading;
