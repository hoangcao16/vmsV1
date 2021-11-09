import { Col, Row } from 'antd';

import React from 'react';
import Breadcrumds from '../breadcrumds/Breadcrumds';

import DetaiUser from '../user/detailUser/component/DetailUser';
import './InforUserDetail.scss';
import { useTranslation } from "react-i18next";

export default function InforUserDetails() {
  const { t } = useTranslation();
  return (
    <Row className="InforUserDetails">
      <Col span={5}></Col>
      <Col span={14}>
        <Breadcrumds url="/app/setting" nameParent={t('breadcrumd.info')} />

        <DetaiUser isMyInfor />
      </Col>
      <Col span={5}></Col>
    </Row>
  );
}
