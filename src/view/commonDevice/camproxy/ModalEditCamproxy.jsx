import { Button, Col, Form, Input, Modal, Row, Spin } from 'antd';
import { isEmpty } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CamproxyApi from '../../../actions/api/camproxy/CamproxyApi';
import trimObjValues from '../../../actions/function/MyUltil/CheckDataTrim';
import Notification from '../../../components/vms/notification/Notification';
import './../../commonStyle/commonForm.scss';
import './../../commonStyle/commonInput.scss';
import './../../commonStyle/commonModal.scss';
import './ModalEditCamproxy.scss';

const formItemLayout = {
  wrapperCol: { span: 24 },
  labelCol: { span: 24 }
};

// const DATA_FAKE_CAMPROXY = {
//   name: '',
//   note: '',
//   description: ''
// };

const ModalEditCamproxy = (props) => {
  const { t } = useTranslation();
  const { handleShowModalEdit, selectedCamproxyIdEdit } = props;

  const [selectedCamproxyEdit, setSelectedCamproxyEdit] = useState(null);

  const [isModalVisible, setIsModalVisible] = useState(
    !isEmpty(selectedCamproxyIdEdit)
  );

  const [form] = Form.useForm();

  useEffect(() => {
    CamproxyApi.getCamproxyByUuid(selectedCamproxyIdEdit).then(
      setSelectedCamproxyEdit
    );
  }, []);

  const handleSubmit = async (value) => {
    const payload = trimObjValues(value);

    try {
      const isEdit = await CamproxyApi.editCamproxy(
        props.selectedCamproxyIdEdit,
        payload
      );

      if (isEdit) {
        const notifyMess = {
          type: 'success',
          title: '',
          description: `${t('noti.successfully_edit_camproxy')}`
        };
        Notification(notifyMess);
      }
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
  if (isEmpty(selectedCamproxyEdit)) {
    return <Spin />;
  }

  console.log('selectedCamproxyEdit:', selectedCamproxyEdit);

  return (
    <>
      <Modal
        title={t('view.common_device.edit_camproxy')}
        visible={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleShowModalEdit}
        style={{ top: 40 }}
        footer={null}
        className="modal--camproxy"
        maskStyle={{ background: 'rgba(51, 51, 51, 0.9)' }}

      >
        <Form
          className="bg-grey"
          form={form}
          {...formItemLayout}
          onFinish={handleSubmit}
          initialValues={selectedCamproxyEdit}
        >
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item
                label={t('view.common_device.camproxy_name')}
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
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label={t('view.common_device.note')}
                name={['note']}
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
                      note: e.target.value.trim()
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
                  {
                    max: 255,
                    message: `${t('noti.255_characters_limit')}`
                  }
                ]}
              >
                <Input
                  onBlur={(e) => {
                    form.setFieldsValue({
                      description: e.target.value.trim()
                    });
                  }}
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

export default ModalEditCamproxy;
