import { Button, Form, Input, Modal } from 'antd';
import 'antd/dist/antd.css';
import { isEmpty } from 'lodash-es';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CameraApi from '../../actions/api/camera/CameraApi';
import Notification from './../../components/vms/notification/Notification';
import './../commonStyle/commonForm.scss';
import './../commonStyle/commonInput.scss';
import './../commonStyle/commonModal.scss';
import './../commonStyle/commonSelect.scss';
import './ModalAddCameraGroup.scss';
import './UploadFile.scss';

const formItemLayout = {
  wrapperCol: { span: 24 },
  labelCol: { span: 24 }
};

export default function ModalAddCameraGroup(props) {
  const { t } = useTranslation();
  const { handleShowModalAdd, isAdd, dataAdd } = props;

  const [isModalVisible, setIsModalVisible] = useState(isAdd);
  const [form] = Form.useForm();

  const handleSubmitAdd = async (value) => {
    const payload = {
      ...value,
      parent: dataAdd
    };

    if (isEmpty(payload?.parent)) {
      delete payload.parent;
    }

    const isAdd = await CameraApi.addCameraGroup(payload);

    if (isAdd) {
      const notifyMess = {
        type: 'success',
        title: '',
        description: `${t('noti.successfully_add_camera_group')}`
      };
      Notification(notifyMess);
    }
    setIsModalVisible(false);
    handleShowModalAdd();
  };

  return (
    <div>
      <Modal
        title={t('view.camera.add_new_camera_group', {
          add: t('add'),
          cam: t('camera')
        })}
        visible={isModalVisible}
        onOk={handleShowModalAdd}
        onCancel={handleShowModalAdd}
        footer={null}
        className="modal__add--cameraGroup"
        maskStyle={{ background: 'rgba(51, 51, 51, 0.9)' }}

      >
        <Form
          className="bg-grey"
          form={form}
          {...formItemLayout}
          onFinish={handleSubmitAdd}
        >
          <Form.Item
            name={['name']}
            rules={[
              {
                required: true,
                message: `${t('view.map.required_field')}`
              },
              { max: 255, message: `${t('noti.255_characters_limit')}` }
            ]}
            label={t("view.camera.camera_group_name")}
          >
            <Input
              placeholder={t('view.camera.please_enter_new_camera_group_name', {
                plsEnter: t('please_enter'),
                cam: t('camera')
              })}
              onBlur={(e) => {
                form.setFieldsValue({
                  name: e.target.value.trim()
                });
              }}
            />
          </Form.Item>
          <Form.Item
            style={{ paddingTop: 20 }}
            name={['description']}
            rules={[
              {
                required: true,
                message: `${t('view.map.required_field')}`
              },
              { max: 255, message: `${t('noti.255_characters_limit')}` }
            ]}
            label={t("view.common_device.desc")}
          >
            <Input 
              placeholder={t('view.user.detail_list.desc')} 
              onBlur={(e) => {
                form.setFieldsValue({
                  description: e.target.value.trim()
                });
              }}
            />
          </Form.Item>
          <div className="btn--submit">
            <Button type="primary" htmlType="submit">
              {t('view.user.detail_list.confirm')}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
