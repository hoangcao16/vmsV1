import { Col, Modal, Row, Typography, Button, Tag, Avatar, Upload } from 'antd';
import { isEmpty } from 'lodash-es';
import React, { useState } from 'react';
import { useEffect } from 'react';
import CameraApi from '../../actions/api/camera/CameraApi';
import './ModalViewDetail.scss';
import { useTranslation } from 'react-i18next';
import Loading from '../common/element/Loading';
import ExportEventFileApi from './../../actions/api/exporteventfile/ExportEventFileApi';

const { Paragraph } = Typography;

const ModalViewDetail = (props) => {
  const { t } = useTranslation();
  const { handleShowModal, selectedCameraId } = props;

  const [avatarUrl, setAvatarUrl] = useState('');

  const [isModalVisible, setIsModalVisible] = useState(
    !isEmpty(selectedCameraId)
  );

  const [selectedCamera, setSelectedCamera] = useState(null);

  useEffect(() => {
    CameraApi.getCameraByUuid(selectedCameraId).then(async (result) => {
      setSelectedCamera(result);
      await ExportEventFileApi.getAvatar(result.avatarFileName).then(
        (result) => {
          if (result.data) {
            let blob = new Blob([result.data], { type: 'octet/stream' });
            let url = window.URL.createObjectURL(blob);
            setAvatarUrl(url);
          } else {
            setAvatarUrl('');
          }
        }
      );
    });
  }, []);

  console.log('selectedCamera:', selectedCamera);

  if (isEmpty(selectedCamera)) {
    return <Loading />;
  }

  return (
    <>
      <Modal
        title={t('view.camera.camera_detail', { cam: t('camera') })}
        visible={isModalVisible}
        onOk={handleShowModal}
        onCancel={handleShowModal}
        footer={null}
        className="modal--detail-camera"
        maskStyle={{ background: 'rgba(51, 51, 51, 0.9)' }}

      >
        <Row gutter={24}>
          <Col span={12}>
            <Row gutter={24}>
              <Col span={24}>
                <Paragraph>
                  <p style={{ fontWeight: 600, fontSize: 14 }}>
                    {t('view.camera.camera_name', { cam: t('camera') })}
                  </p>
                  <p>{selectedCamera?.name}</p>
                </Paragraph>
              </Col>
              <Col span={24}>
                <Paragraph>
                  <p style={{ fontWeight: 600, fontSize: 14 }}>
                    {t('view.map.camera_id', { cam: t('camera') })}
                  </p>
                  <p>{selectedCamera?.code}</p>
                </Paragraph>
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Avatar
                src={avatarUrl}
                style={{ borderRadius: '50%' }}
                size={{
                  xs: 24,
                  sm: 32,
                  md: 40,
                  lg: 64,
                  xl: 80,
                  xxl: 130
                }}
              />
            </div>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Paragraph>
              <p style={{ fontWeight: 600, fontSize: 14 }}>
                {t('view.camera.camera_type', { cam: t('camera') })}
              </p>
              <p>{selectedCamera?.cameraTypeName}</p>
            </Paragraph>
          </Col>
          <Col span={12}>
            <Paragraph>
              <p style={{ fontWeight: 600, fontSize: 14 }}>
                {t('view.camera.active_stt', { cam: t('camera') })}
              </p>
              <p>
                {selectedCamera?.recordingStatus === 0
                  ? `${t('view.camera.inactive')}`
                  : `${t('view.camera.active')}`}
              </p>
            </Paragraph>
          </Col>
          <Col span={24}>
            <Paragraph>
              <p style={{ fontWeight: 600, fontSize: 14 }}>
                {t('view.map.vendor')}
              </p>
              <p>{selectedCamera?.vendorName}</p>
            </Paragraph>
          </Col>
          <Col span={8}>
            <Paragraph>
              <p style={{ fontWeight: 600, fontSize: 14 }}>
                {t('view.map.province_id')}
              </p>
              <p>{selectedCamera?.provinceName}</p>
            </Paragraph>
          </Col>
          <Col span={8}>
            <Paragraph>
              <p style={{ fontWeight: 600, fontSize: 14 }}>
                {t('view.map.district_id')}
              </p>
              <p>{selectedCamera?.districtName}</p>
            </Paragraph>
          </Col>
          <Col span={8}>
            <Paragraph>
              <p style={{ fontWeight: 600, fontSize: 14 }}>
                {t('view.map.ward_id')}
              </p>
              <p>{selectedCamera?.wardName}</p>
            </Paragraph>
          </Col>
          <Col span={12}>
            <Paragraph>
              <p style={{ fontWeight: 600, fontSize: 14 }}>
                {t('view.map.location')}
              </p>
              <p>{selectedCamera?.address}</p>
            </Paragraph>
          </Col>
          <Col span={12}>
            <Paragraph>
              <p style={{ fontWeight: 600, fontSize: 14 }}>
                {t('view.map.administrative_unit')}
              </p>
              <p>{selectedCamera?.administrativeUnitName}</p>
            </Paragraph>
          </Col>

          <Col span={12}>
            <Paragraph>
              <p style={{ fontWeight: 600, fontSize: 14 }}>
                {t('view.map.longitude')}
              </p>
              <p>{selectedCamera?.long_}</p>
            </Paragraph>
          </Col>
          <Col span={12}>
            <Paragraph>
              <p style={{ fontWeight: 600, fontSize: 14 }}>
                {t('view.map.latitude')}
              </p>
              <p>{selectedCamera?.lat_}</p>
            </Paragraph>
          </Col>

          <Col span={24}>
            <Paragraph>
              <p style={{ fontWeight: 600, fontSize: 14 }}>
                {t('view.map.port')}
              </p>
              <p>{selectedCamera?.port}</p>
            </Paragraph>
          </Col>
          <Col span={24}>
            <Paragraph>
              <p style={{ fontWeight: 600, fontSize: 14 }}>
                {t('view.map.zone')}
              </p>
              <p>{selectedCamera?.zoneName}</p>
            </Paragraph>
          </Col>
          <Col span={24}>
            <Paragraph>
              <p style={{ fontWeight: 600, fontSize: 14 }}>IP</p>
              <p>{selectedCamera?.ip}</p>
            </Paragraph>
          </Col>
          <Col span={24}>
            <Paragraph>
              <p style={{ fontWeight: 600, fontSize: 14 }}>
                {t('view.map.original_url')}
              </p>
              <p>{selectedCamera?.cameraUrl}</p>
            </Paragraph>
          </Col>

          <div style={{ display: 'flex' }}>
            {!isEmpty(selectedCamera.tags) && (
              <>
                {selectedCamera.tags.map((t) => {
                  return (
                    <Col span={24}>
                      <div className="renderTag">
                        <p style={{ fontWeight: 600, fontSize: 14 }}>
                          {t.key}:
                        </p>
                        <p>
                          {' '}
                          {t.value.map((v) => {
                            return <Tag>{v}</Tag>;
                          })}
                        </p>
                      </div>
                    </Col>
                  );
                })}
              </>
            )}
          </div>
        </Row>
        <div className="btn--submit">
          <Button type="primary" onClick={handleShowModal}>
            {t('view.camera.close')}
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default ModalViewDetail;
