import { Button, Col, Form, Input, Modal, Row, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import TagApi from "../../actions/api/tag";
import Notification from "../../components/vms/notification/Notification";
const formItemLayout = {
  wrapperCol: { span: 24 },
  labelCol: { span: 24 },
};
const initialValues = {
  key: ""
};
const ModalUpdateTag = (props) => {
    const { t } = useTranslation();
  let { setShowModal, selectedCategoryId } = props;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getTagById = async () => {
      if (selectedCategoryId !== null) {
        const response = await TagApi.getTagById(selectedCategoryId);
        if(response) {
            form.setFieldsValue({key: response.key})
        }
      }
    };
    getTagById();
  }, [selectedCategoryId]);
  const showMessage = (selectedCategoryId, response) => {
    const notifyMess = {
        type: 'success',
        title: '',
        description: `${t('noti.successfully_add_tag_category', {
          add: t('add')
        })}`
      };
      if (selectedCategoryId) {
        notifyMess.description = response ? `${t('noti.successfully_update_tag_category', {
            add: t('update')
          })}` : `${t('noti.fail_update_tag_category', {
            add: t('update')
          })}`
      } else {
        notifyMess.description = response ? `${t('noti.successfully_add_tag_category', {
            add: t('add')
          })}` : `${t('noti.fail_add_tag_category', {
            add: t('add')
          })}`
      }
      Notification(notifyMess);
  }
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      let response;
      if(selectedCategoryId) {
         response = await TagApi.updateTagById(selectedCategoryId, values);
      } else {
         response = await TagApi.addTag(values);
      }
      if(response) {
        setShowModal(false);
      } 
      showMessage(selectedCategoryId, response);
    } catch (error) {
    } finally {
        setLoading(false);
    }
  };
  return (
    <>
      <Modal
        title={selectedCategoryId ? "Sửa tag" : "Thêm mới tag"}
        visible={true}
        // onOk={handleSubmit}
        onCancel={() => {
          setShowModal(false);
        }}
        className="modal__update-tag modal__edit--category"
        footer={null}
      >
        <Spin tip="Loading..." spinning={loading}>
          <Form
            className="bg-grey"
            form={form}
            {...formItemLayout}
            onFinish={handleSubmit}
            initialValues={initialValues}
          >
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item
                  label="Nhập key"
                  name={["key"]}
                  rules={[
                    {
                      required: true,
                      message: "Trường này bắt buộc",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
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
        </Spin>
      </Modal>
    </>
  );
};

export default ModalUpdateTag;
