import { Form, Input, Modal, Spin, Button } from 'antd';
import { isEmpty } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import CameraApi from '../../actions/api/camera/CameraApi';
import Notification from '../../components/vms/notification/Notification';
import './../commonStyle/commonForm.scss';
import './../commonStyle/commonInput.scss';
import './../commonStyle/commonModal.scss';
import './../commonStyle/commonSelect.scss';
import './ModalEditCameraGroup.scss';
import './UploadFile.scss';
import { useTranslation } from 'react-i18next';

const formItemLayout = {
  wrapperCol: { span: 24 },
  labelCol: { span: 24 }
};

export default function ModalEditCameraGroup(props) {
  const { t } = useTranslation();
  const { handleShowModalEdit, dataEdit } = props;

  const [isModalVisible, setIsModalVisible] = useState(!isEmpty(dataEdit));

  const [dataCameraGroup, setDataCameraGroup] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    CameraApi.getGroupCameraById(dataEdit).then(setDataCameraGroup);
  }, []);

  const handleSubmitEdit = async (value) => {
    const cameraUuidList = dataCameraGroup?.cameraUuidList?.map((c) => c.uuid);

    const payload = {
      ...value,
      cameraUuidList: cameraUuidList
    };

    const isUpdate = await CameraApi.updateCameraGroup(dataEdit, payload);

    if (isUpdate) {
      const notifyMess = {
        type: 'success',
        title: '',
        description: 'Sửa nhóm Camera thành công'
      };
      Notification(notifyMess);
      setIsModalVisible(false);
      handleShowModalEdit();
    }
  };

  if (isEmpty(dataCameraGroup)) {
    return <Spin />;
  }

  return (
    <div>
      <Modal
        title={t('view.camera.edit_camera_group', {
          G: t('G'),
          g: t('g'),
          cam: t('camera')
        })}
        visible={isModalVisible}
        onOk={handleShowModalEdit}
        onCancel={handleShowModalEdit}
        footer={null}
        className="modal__edit--cameraGroup"
        maskStyle={{ background: 'rgba(51, 51, 51, 0.9)' }}

      >
        <Form
          className="bg-grey"
          form={form}
          {...formItemLayout}
          onFinish={handleSubmitEdit}
          initialValues={dataCameraGroup}
        >
          <Form.Item
            name={['name']}
            // label="Tên nhóm Camera "
            rules={[
              {
                required: true,
                message: `${t('view.map.required_field')}`
              },
              { max: 255, message: `${t('noti.255_characters_limit')}` }
            ]}
          >
            <Input
              placeholder={t('view.camera.please_enter_camera_group_name', {
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
            // label="Tên nhóm Camera "
            rules={[
              {
                required: true,
                message: `${t('view.map.required_field')}`
              },
              { max: 255, message: `${t('noti.255_characters_limit')}` }
            ]}
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
