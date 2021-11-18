import { Col, Form, Input, Modal, Row, Spin, Button } from 'antd';
import { isEmpty } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import CameraApi from '../../actions/api/camera/CameraApi';
import VendorApi from '../../actions/api/vendor/VendorApi';
import FieldApi from '../../actions/api/field/FieldApi';
import Event from '../../actions/api/event/EventApi';
import Notification from '../../components/vms/notification/Notification';
import './../commonStyle/commonAuto.scss';
import './../commonStyle/commonForm.scss';
import './../commonStyle/commonInput.scss';
import './../commonStyle/commonModal.scss';
import './../commonStyle/commonSelect.scss';
import './ModalEditCategory.scss';

import { CATEGORY_NAME } from './TableCategory';
import EventApi from '../../actions/api/event/EventApi';

const formItemLayout = {
  wrapperCol: { span: 24 },
  labelCol: { span: 24 }
};

const ModalViewEditCategory = (props) => {
  let { setShowModal, selectedCategoryId, dataType } = props;
  const [fieldData, setFieldData] = useState();
  const [name, setName] = useState('');
  const [form] = Form.useForm();
  const [selectedCategoryEdit, setSelectedCategoryEdit] = useState(null);

  useEffect(() => {
    if (selectedCategoryId !== null) {
      getCategoryByUuid(dataType, selectedCategoryId).then(async (data) => {
        setSelectedCategoryEdit(data);
      });
    }

    if (CATEGORY_NAME.CAMERA_TYPE === dataType) {
      setName('Loại camera');
    }
    if (CATEGORY_NAME.VENDOR === dataType) {
      setName('Hãng camera');
    }
    if (CATEGORY_NAME.FIELD === dataType) {
      setName('Lĩnh vực');
    }
    if (CATEGORY_NAME.EVENT_TYPE === dataType) {
      setName('Loại sự kiện');
    }
  }, [selectedCategoryId]);

  const renderOptionSelectField = () =>
    fieldData?.map((item) => <option value={item.uuid}>{item.name}</option>);

  const getAllField = async (params) => {
    const data = await FieldApi.getAllFeild(params);
    setFieldData(data);
  };

  useEffect(() => {
    const params = {
      name: ''
    };
    getAllField(params);
  }, []);

  const handleSubmit = async (value) => {
    const payload = {
      ...value
    };

    try {
      if (selectedCategoryEdit !== null) {
        let isEdit = false;

        if (CATEGORY_NAME.CAMERA_TYPE === dataType) {
          isEdit = await CameraApi.editCameraTypesByUuid(
            selectedCategoryId,
            payload
          );
        }

        if (CATEGORY_NAME.VENDOR === dataType) {
          isEdit = await VendorApi.editVendor(selectedCategoryId, payload);
        }

        if (CATEGORY_NAME.FIELD === dataType) {
          isEdit = await FieldApi.putEditField(selectedCategoryId, payload);
        }

        if (CATEGORY_NAME.EVENT_TYPE === dataType) {
          isEdit = await EventApi.putEditEvent(selectedCategoryId, payload);
        }

        if (isEdit) {
          const notifyMess = {
            type: 'success',
            title: 'Thành công',
            description: `Bạn đã sửa thành công tên ${name}`
          };
          Notification(notifyMess);
        }
        setShowModal(false);
      } else {
        let isPost = false;
        switch (dataType) {
          case CATEGORY_NAME.CAMERA_TYPE:
            isPost = await CameraApi.addCameraType(payload);
            break;
          case CATEGORY_NAME.VENDOR:
            isPost = await VendorApi.addVendor(payload);
            break;
          case CATEGORY_NAME.FIELD:
            isPost = await FieldApi.postNewField(payload);
            break;
          case CATEGORY_NAME.EVENT_TYPE:
            isPost = await EventApi.postNewEvent(payload);
            break;
          default:
            return;
        }
        if (isPost) {
          const notifyMess = {
            type: 'success',
            title: 'Thành công',
            description: `Bạn đã thêm thành công ${name}`
          };
          Notification(notifyMess);
          setShowModal(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (selectedCategoryId !== null) {
    // console.log('selectedCategoryIdspin', selectedCategoryId)
    // console.log('selectedCategoryEditspin', selectedCategoryEdit)

    if (isEmpty(selectedCategoryEdit)) {

      return <Spin />;
    }
  }

  return (
    <>
      <Modal
        title={selectedCategoryId ? `Sửa ${name}` : 'Thêm mới'}
        visible={true}
        onCancel={() => {
          setShowModal(false);
        }}
        className="modal__edit--category"
        footer={null}
        maskStyle={{ background: 'rgba(51, 51, 51, 0.9)' }}
      >
        <Form
          className="bg-grey"
          form={form}
          {...formItemLayout}
          onFinish={handleSubmit}
          initialValues={selectedCategoryEdit}
        >
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item
                label={`${name}`}
                name={['name']}
                rules={[
                  {
                    required: true,
                    message: 'Trường này bắt buộc'
                  }
                ]}
              >
                <Input
                  maxLength={255}
                  onBlur={(e) => {
                    form.setFieldsValue({
                      name: e.target.value.trim()
                    });
                  }}
                />
              </Form.Item>
              {dataType === CATEGORY_NAME.EVENT_TYPE ? (
                <Form.Item
                  label={`Lĩnh vực`}
                  name={['fieldUuid']}
                  rules={[
                    {
                      required: true,
                      message: 'Trường này bắt buộc'
                    }
                  ]}
                >
                  <select>
                    <option value="" selected hidden disabled>
                      Chọn lĩnh vực cho sự kiện
                    </option>
                    {renderOptionSelectField()}
                  </select>
                </Form.Item>
              ) : (
                <></>
              )}
            </Col>
          </Row>
          <div className="footer__modal">
            <Button
              onClick={() => {
                setShowModal(false);
              }}
            >
              Đóng
            </Button>
            <Button htmlType="submit">Lưu</Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

async function getCategoryByUuid(dataType, selectedCategoryId) {
  let dataEdit;

  if (CATEGORY_NAME.CAMERA_TYPE === dataType) {
    dataEdit = await CameraApi.getCameraTypesByUuid(selectedCategoryId);
  }

  if (CATEGORY_NAME.VENDOR === dataType) {
    dataEdit = await VendorApi.getVendorByUuid(selectedCategoryId);
  }

  if (CATEGORY_NAME.FIELD === dataType) {
    dataEdit = await FieldApi.getFieldByUuid(selectedCategoryId);
  }

  if (CATEGORY_NAME.EVENT_TYPE === dataType) {
    dataEdit = await Event.getEventByUuid(selectedCategoryId);
  }

  return dataEdit;
}

export default ModalViewEditCategory;
