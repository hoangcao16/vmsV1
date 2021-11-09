import { Button, Col, Modal, Row, Typography } from 'antd';
import { isEmpty } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import ZoneApi from '../../../actions/api/zone/ZoneApi';
import './ModalViewDetail.scss';
import { useTranslation } from 'react-i18next';

const { Paragraph } = Typography;

const ModalViewDetail = (props) => {
  const { t } = useTranslation();
  const { handleShowModal, selectedZoneId } = props;

  const [isModalVisible, setIsModalVisible] = useState(
    !isEmpty(selectedZoneId)
  );
  const [selectedZone, setSelectedZone] = useState(null);

  useEffect(() => {
    ZoneApi.getZoneByUuid(selectedZoneId).then(setSelectedZone);
  }, []);

  console.log(selectedZone);

  return (
    <>
      <Modal
        title={t('view.common_device.zone_detail')}
        visible={isModalVisible}
        onOk={handleShowModal}
        onCancel={handleShowModal}
        style={{ top: 20 }}
        footer={null}
        className="modal--detail-zone"
        maskStyle={{ background: 'rgba(51, 51, 51, 0.9)' }}

      >
        <Row gutter={24}>
          <Col span={12}>
            <Paragraph className="mt-1">
              <p style={{ fontWeight: 600, fontSize: 14 }}>{t('view.common_device.zone_name')}</p>
              <p>{selectedZone?.name}</p>
            </Paragraph>
          </Col>

          <Col span={12}>
            <Paragraph className="mt-1">
              <p style={{ fontWeight: 600, fontSize: 14 }}>{t('view.map.province_id')}</p>
              <p>{selectedZone?.provinceName}</p>
            </Paragraph>
          </Col>
          <Col span={12}>
            <Paragraph className="mt-1">
              <p style={{ fontWeight: 600, fontSize: 14 }}>{t('view.map.district_id')}</p>
              <p>{selectedZone?.districtName}</p>
            </Paragraph>
          </Col>
          <Col span={12}>
            <Paragraph className="mt-1">
              <p style={{ fontWeight: 600, fontSize: 14 }}>{t('view.map.ward_id')}</p>
              <p>{selectedZone?.wardName}</p>
            </Paragraph>
          </Col>
          <Col span={12}>
            <Paragraph className="mt-1">
              <p style={{ fontWeight: 600, fontSize: 14 }}>{t('view.map.location')}</p>
              <p>{selectedZone?.address}</p>
            </Paragraph>
          </Col>
        </Row>
        <Row className="row--submit">
          <div className="submit">
            <Button type="primary" htmlType="button" onClick={handleShowModal}>
              {t('view.camera.close')}
            </Button>
          </div>
        </Row>
      </Modal>
    </>
  );
};

export default ModalViewDetail;
