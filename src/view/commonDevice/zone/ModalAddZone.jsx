import { Button, Col, Form, Input, Modal, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AddressApi from '../../../actions/api/address/AddressApi';
import CamproxyApi from '../../../actions/api/camproxy/CamproxyApi';
import NVRApi from '../../../actions/api/nvr/NVRApi';
import PlaybackApi from '../../../actions/api/playback/PlaybackApi';
import ZoneApi from '../../../actions/api/zone/ZoneApi';
import Notification from '../../../components/vms/notification/Notification';
import {
  filterOption,
  normalizeOptions
} from '../../common/select/CustomSelect';
import './ModalAddZone.scss';

const { TextArea } = Input;
const formItemLayout = {
  wrapperCol: { span: 24 },
  labelCol: { span: 24 }
};

export const DATA_FAKE_ZONE = {
  provinces: [{ name: '', provinceId: '' }],
  campoxy: [{ name: '', uuid: '' }],
  nvr: [{ name: '', uuid: '' }],
  playback: [{ name: '', uuid: '' }]
};

const ModalAddZone = (props) => {
  const { t } = useTranslation();
  const { handleShowModalAdd, selectedAdd } = props;

  const [isModalVisible, setIsModalVisible] = useState(selectedAdd);

  const [filterOptions, setFilterOptions] = useState(DATA_FAKE_ZONE);

  const [provinceId, setProvinceId] = useState(null);

  const [districts, setDistrict] = useState([]);

  const [districtId, setDistrictId] = useState(null);

  const [wards, setWard] = useState([]);

  const [form] = Form.useForm();

  useEffect(() => {
    fetchSelectOptions().then(setFilterOptions);
  }, []);

  useEffect(() => {
    setDistrict([]);

    if (provinceId) {
      AddressApi.getDistrictByProvinceId(provinceId).then(setDistrict);
    }
  }, [provinceId]);

  useEffect(() => {
    setWard([]);

    if (districtId) {
      AddressApi.getWardByDistrictId(districtId).then(setWard);
    }
  }, [districtId]);

  const { provinces, playback, nvr, campoxy } = filterOptions;

  const onChangeCity = async (cityId) => {
    setProvinceId(cityId);

    await resetDistrictAndWardData();
  };

  function resetDistrictAndWardData() {
    form.setFieldsValue({ districtId: null, wardId: null });
  }

  const onChangeDistrict = async (districtId) => {
    setDistrictId(districtId);
    await resetWardData();
  };

  function resetWardData() {
    form.setFieldsValue({ wardId: null });
  }

  // if (isEmpty(provinces) || isEmpty(nvr) || isEmpty(playback) || isEmpty(campoxy)) {
  //   return <Loading />;
  // }

  const handleSubmit = async (value) => {
    const payload = { ...value };
    const isAdd = await ZoneApi.addZone(payload);
    if (isAdd) {
      const notifyMess = {
        type: 'success',
        title: '',
        description: `${t('noti.successfully_add_zone')}`
      };
      Notification(notifyMess);
      setIsModalVisible(false);
      handleShowModalAdd();
    }
  };

  return (
    <>
      <div>
        <Modal
          title={t('view.common_device.add_zone', { add: t('add') })}
          visible={isModalVisible}
          onOk={handleShowModalAdd}
          onCancel={handleShowModalAdd}
          style={{ top: 40 }}
          footer={null}
          className="modal--zone"
          maskStyle={{ background: 'rgba(51, 51, 51, 0.9)' }}

        >
          <Form
            className="bg-grey"
            form={form}
            {...formItemLayout}
            onFinish={handleSubmit}
          >
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item
                  label={t('view.common_device.zone_name')}
                  name={['name']}
                  rules={[
                    {
                      required: true,
                      message: `${t('view.map.required_field')}`
                    },

                    {
                      max: 255,
                      message: `${t('noti.255_characters_limit')}`
                    }
                  ]}
                >
                  <Input
                    onBlur={(e) => {
                      form.setFieldsValue({
                        name: e.target.value.trim()
                      });
                    }}
                  ></Input>
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name={['provinceId']}
                  label={t('view.map.province_id')}
                  rules={[
                    {
                      required: true,
                      message: `${t('view.map.required_field')}`
                    }
                  ]}
                >
                  <Select
                    showSearch
                    dataSource={provinces}
                    onChange={(cityId) => onChangeCity(cityId)}
                    filterOption={filterOption}
                    options={normalizeOptions('name', 'provinceId', provinces)}
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name={['districtId']}
                  label={t('view.map.district_id')}
                  rules={[
                    {
                      required: true,
                      message: `${t('view.map.required_field')}`
                    }
                  ]}
                >
                  <Select
                    showSearch
                    dataSource={districts}
                    onChange={(districtId) => onChangeDistrict(districtId)}
                    filterOption={filterOption}
                    options={normalizeOptions('name', 'districtId', districts)}
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name={['wardId']}
                  label={t('view.map.ward_id')}
                // rules={[{ required: true, message: `${t('view.map.required_field')}`, }]}
                >
                  <Select
                    showSearch
                    dataSource={wards}
                    filterOption={filterOption}
                    options={normalizeOptions('name', 'id', wards)}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label={t('view.map.address')}
                  name={['address']}
                  rules={[
                    {
                      required: true,
                      message: `${t('view.map.required_field')}`
                    },
                    { transform: (value) => value.trim() },
                    {
                      max: 255,
                      message: `${t('noti.255_characters_limit')}`
                    }
                  ]}
                >
                  <Input
                    onBlur={(e) => {
                      form.setFieldsValue({
                        address: e.target.value.trim()
                      });
                    }}
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  label={t('view.common_device.desc')}
                  name={['description']}
                  rules={[
                    {
                      required: true,
                      message: `${t('view.map.required_field')}`
                    },
                    { transform: (value) => value.trim() },
                    {
                      max: 255,
                      message: `${t('noti.255_characters_limit')}`
                    }
                  ]}
                >
                  <TextArea
                    onBlur={(e) => {
                      form.setFieldsValue({
                        description: e.target.value.trim()
                      });
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label={t('view.common_device.choose_nvr')}
                  name={['nvrUuidList']}
                >
                  <Select
                    mode="multiple"
                    showArrow
                    style={{ width: '100%' }}
                    options={nvr.map((r) => ({
                      value: r.uuid,
                      label: r.name
                    }))}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label={t('view.common_device.choose_playback')}
                  name={['playbackUuidList']}
                >
                  <Select
                    mode="multiple"
                    showArrow
                    style={{ width: '100%' }}
                    options={playback.map((s) => ({
                      value: s.uuid,
                      label: s.name
                    }))}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label={t('view.common_device.choose_camproxy')}
                  name={['campUuidList']}
                >
                  <Select
                    mode="multiple"
                    showArrow
                    style={{ width: '100%' }}
                    options={campoxy.map((c) => ({
                      value: c.uuid,
                      label: c.name
                    }))}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row className="row--submit">
              <div className="submit">
                <Button type="primary" htmlType="submit ">
                  {t('view.user.detail_list.confirm')}
                </Button>
              </div>
            </Row>
          </Form>
        </Modal>
      </div>
    </>
  );
};

async function fetchSelectOptions() {
  const provinces = await AddressApi.getAllProvinces();
  const playback = await PlaybackApi.getAllPlayback();
  const nvr = await NVRApi.getAllNVR();
  const campoxy = await CamproxyApi.getAllCamproxy();
  return {
    provinces,
    playback,
    nvr,
    campoxy
  };
}

export default ModalAddZone;
