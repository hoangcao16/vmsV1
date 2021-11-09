import { Button, Col, Form, Input, Modal, Row, Select, Spin } from 'antd';
import { isEmpty } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AddressApi from '../../../actions/api/address/AddressApi';
import CamproxyApi from '../../../actions/api/camproxy/CamproxyApi';
import NVRApi from '../../../actions/api/nvr/NVRApi';
import PlaybackApi from '../../../actions/api/playback/PlaybackApi';
import ZoneApi from '../../../actions/api/zone/ZoneApi';
import Notification from '../../../components/vms/notification/Notification';
import Loading from '../../common/element/Loading';
import {
  filterOption,
  normalizeOptions
} from '../../common/select/CustomSelect';
import { DATA_FAKE_ZONE } from './ModalAddZone';
import './ModalAddZone.scss';

const { TextArea } = Input;
const formItemLayout = {
  wrapperCol: { span: 24 },
  labelCol: { span: 24 }
};

const ModalEditZone = (props) => {
  const { t } = useTranslation();
  const { handleShowModalEdit, selectedZoneEditId } = props;

  const [isModalVisible, setIsModalVisible] = useState(
    !isEmpty(selectedZoneEditId)
  );

  const [selectedZoneEdit, setSelectedZoneEdit] = useState(DATA_FAKE_ZONE);

  const [filterOptions, setFilterOptions] = useState({});

  const [provinceId, setProvinceId] = useState(
    selectedZoneEdit?.provinceId || null
  );

  const [districts, setDistrict] = useState([]);

  const [districtId, setDistrictId] = useState(
    selectedZoneEdit?.districtId || null
  );

  const [wards, setWard] = useState([]);

  const [form] = Form.useForm();

  useEffect(() => {
    ZoneApi.getZoneByUuid(selectedZoneEditId).then(async (data) => {
      let convertedData = await convertedDataZone(data);
      setSelectedZoneEdit(convertedData);
      setProvinceId(convertedData.provinceId);
      setDistrictId(convertedData.districtId);
      return;
    });
  }, []);

  useEffect(() => {
    fetchSelectOptions().then(setFilterOptions);
  }, []);

  useEffect(() => {
    if (null === provinceId) {
      return;
    }

    setDistrict([]);

    if (provinceId) {
      AddressApi.getDistrictByProvinceId(provinceId).then(setDistrict);
    }
  }, [provinceId]);

  useEffect(() => {
    if (null === districtId) {
      return;
    }

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

  if (isEmpty(provinces)) {
    return <Loading />;
  }

  const handleSubmit = async (value) => {
    const payload = {
      ...value
    };

    try {
      const isEdit = await ZoneApi.editZone(props.selectedZoneEditId, payload);
      if (isEdit) {
        const notifyMess = {
          type: 'success',
          title: '',
          description: `${t('noti.successfully_edit_zone')}`
        };
        Notification(notifyMess);
      }
      handleShowModalEdit();
    } catch (error) {
      // message.warning(
      //   'Đã xảy ra lỗi trong quá trình chỉnh sửa, hãy kiểm tra lại'
      // );
      console.log(error);
    }

    setTimeout(() => {
      setIsModalVisible(false);
      handleShowModalEdit();
    }, 500);
  };

  if (isEmpty(selectedZoneEdit)) {
    return <Spin />;
  }

  return (
    <>
      <Modal
        title={t('view.common_device.edit_zone')}
        visible={isModalVisible}
        onOk={handleShowModalEdit}
        onCancel={handleShowModalEdit}
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
          initialValues={selectedZoneEdit}
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
                  { required: true, message: `${t('view.map.required_field')}` }
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
                  { required: true, message: `${t('view.map.required_field')}` }
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
              // rules={[{ required: true, message: `${t('view.map.required_field')}` }]}
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
                label={t('view.map.location')}
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

async function convertedDataZone(data) {
  // if (isEmpty(data)) {
  //   return;
  // }

  const camListConverted = data?.campList?.map((c) => {
    return c.uuid;
  });
  const nvrListConverted = data?.nvrList?.map((r) => {
    return r.uuid;
  });
  const playbackListConverted = data?.playbackList?.map((s) => {
    return s.uuid;
  });

  return {
    ...data,
    campUuidList: camListConverted,
    nvrUuidList: nvrListConverted,
    playbackUuidList: playbackListConverted
  };
}

export default ModalEditZone;
