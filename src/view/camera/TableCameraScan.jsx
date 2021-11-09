import { ArrowLeftOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, List, Row, Select, Space, Spin } from 'antd';
import 'antd/dist/antd.css';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import ZoneApi from '../../actions/api/zone/ZoneApi';
import rest_api from '../../actions/rest_api';
import { normalizeOptions } from '../common/select/CustomSelect';
import './../commonStyle/commonTable.scss';
import ModalAddCamera, { DATA_FAKE_CAMERA } from './ModalAddCamera';
import './styleCamera.scss';
import './TableCamera.scss';
import './TableCameraScan.scss';

const formItemLayout = {
  wrapperCol: { span: 24 },
  labelCol: { span: 24 }
};

const TableCameraScan = (props) => {
  const { t } = useTranslation();
  const [listCamera, setListCamera] = useState([]);
  const [selectedAdd, setSelectedAdd] = useState(false);
  const [filterOptions, setFilterOptions] = useState(DATA_FAKE_CAMERA);
  const [data, setData] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchSelectOptions().then(setFilterOptions);
  }, []);

  const goBack = () => {
    props.history.goBack();
  };

  const renderItem = (item) => {
    return (
      <div className={`camera__detail `}>
        <div className="camera__header ">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h4>{item?.ip}</h4>

            <h5 style={{ marginLeft: '150px' }}>
              {item.type == 'camera' ? 'Camera' : 'Thiết bị không xác định'}
            </h5>
          </div>

          <Space>
            <PlusCircleOutlined
              style={{ fontSize: '16px', color: '#6E6B7B' }}
              onClick={() => showModalAdd(item)}
            />
          </Space>
        </div>
      </div>
    );
  };

  const showModalAdd = (item) => {
    setSelectedAdd(true);
    if (!isEmpty(item)) {
      setData(item);
    }
  };

  const handleShowModalAdd = () => {
    setSelectedAdd(false);
    setData(null);
    // goBack();
  };

  const renderHeader = () => {
    return (
      <div>
        <h4 className="font-weight-700">{t('view.camera.scannable_camera')}</h4>
      </div>
    );
  };

  const { zones } = filterOptions;

  const handleSubmit = async (value) => {
    setListCamera(null);

    const payload = {
      ...value
    };

    const payloadConverted = {
      ipStrip: `${payload.p1}-${payload.p2}`,
      zoneUuid: payload?.zoneUuid,
      page: 0,
      size: 10
    };

    rest_api
      .get('/ptz-ctrl/api/v1/scan-camera', payloadConverted, null)
      .then((result) => {
        if (result && result.payload.data) {
          setListCamera(result.payload.data);
        }
      });
  };

  return (
    <>
      <div
        className="CameraScan"
        style={{
          marginTop: 40,
          background: '#333333',
          borderRadius: '10px',
          padding: '10px'
        }}
      >
        <div className="d-flex " style={{ padding: 10 }}>
          <div>
            <ArrowLeftOutlined className="mr-1" onClick={goBack} />
          </div>
          <h4 className="font-weight-700">{t('view.camera.camera_scan')}</h4>
        </div>

        <p>{t('view.camera.filter_camera_by')}</p>

        <Form
          className=""
          form={form}
          onFinish={handleSubmit}
          {...formItemLayout}
        >
          <Row gutter={24}>
            <Col span={7}>
              <Row gutter={24}>
                <Col span={24}>
                  <Form.Item
                    name={['p1']}
                    label={<p>{t('view.camera.IP1_range')}</p>}
                    rules={[
                      {
                        required: true,
                        message: `${t('view.map.required_field')}`
                      },
                      ({ getFieldValue }) => ({
                        validator(rule, value) {
                          const data = getFieldValue(['p1']);
                          var ipformat =
                            /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
                          if (!data.match(ipformat)) {
                            return Promise.reject(
                              'Bạn nhập chưa đúng địa chỉ IP1'
                            );
                          } else {
                            return Promise.resolve();
                          }
                        }
                      })
                    ]}
                  >
                    <Input placeholder={t('view.camera.IP1_range')} />
                  </Form.Item>
                </Col>
              </Row>
            </Col>

            <Col span={7}>
              <Form.Item
                name={['p2']}
                label={<p>{t('view.camera.IP2_range')}</p>}
                rules={[
                  {
                    required: true,
                    message: `${t('view.map.required_field')}`
                  },
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      const data = getFieldValue(['p2']);
                      var ipformat =
                        /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
                      if (!data.match(ipformat)) {
                        return Promise.reject('Bạn nhập chưa đúng địa chỉ IP2');
                      } else {
                        return Promise.resolve();
                      }
                    }
                  })
                ]}
              >
                <Input placeholder={t('view.camera.IP2_range')} />
              </Form.Item>
            </Col>

            <Col span={7}>
              <Form.Item
                name={['zoneUuid']}
                label={<p>{t('view.camera.choose_zone')}</p>}
                rules={[
                  { required: true, message: `${t('view.map.required_field')}` }
                ]}
              >
                <Select
                  showSearch
                  dataSource={zones}
                  filterOption={filterOptions}
                  options={normalizeOptions('name', 'uuid', zones)}
                  placeholder={t('view.camera.choose_zone')}
                />
              </Form.Item>
            </Col>
            <Col span={3} style={{ display: 'flex', alignItems: 'flex-end' }}>
              <div className="btn--submit" style={{ height: 40 }}>
                <Button type="primary" htmlType="submit ">
                  {t('view.user.detail_list.confirm')}
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </div>

      {!isEmpty(listCamera) ? (
        <List
          className="listCameraScan"
          header={renderHeader()}
          bordered
          dataSource={listCamera}
          renderItem={(item) => {
            return (
              <List.Item className={`${item?.type == 'other' ? 'other' : ''} `}>
                {renderItem(item)}
              </List.Item>
            );
          }}
        />
      ) : (
        <List />
      )}

      {selectedAdd && (
        <ModalAddCamera
          selectedAdd={selectedAdd}
          handleShowModalAdd={handleShowModalAdd}
          data={data}
        />
      )}
    </>
  );
};

async function fetchSelectOptions() {
  const data = {
    name: '',
    id: '',
    provinceId: '',
    districtId: ''
  };

  let  zones = await ZoneApi.getAllZones(data);


  if(isEmpty(zones)){
    zones = DATA_FAKE_CAMERA.zones
  }


  return {
    zones
  };
}

export default withRouter(TableCameraScan);
