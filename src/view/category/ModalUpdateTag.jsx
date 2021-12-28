import { Button, Col, Form, Input, Modal, Row, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import TagApi from "../../actions/api/tag";
import permissionCheck from "../../actions/function/MyUltil/PermissionCheck";
import Notification from "../../components/vms/notification/Notification";
const formItemLayout = {
  wrapperCol: { span: 24 },
  labelCol: { span: 24 },
};
const initialValues = {
  key: "",
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
        if (response) {
          form.setFieldsValue({ key: response.key });
        }
      }
    };
    getTagById();
  }, [selectedCategoryId]);
  const showMessage = (selectedCategoryId, response) => {
    if (
      permissionCheck("add_category") && !selectedCategoryId
    ) {
      const notifyMess = {
        type: "success",
        title: "",
        description: `${t("noti.successfully_add_tag_category", {
          add: t("add"),
        })}`,
      };
      Notification(notifyMess);
    } 
    
    if (permissionCheck("edit_category") && selectedCategoryId) {
      const notifyMess = {
        type: "success",
        title: "",
        description: `${t("noti.successfully_edit_tag_category")}`,
      };
      Notification(notifyMess);
    }
  };
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      let response;
      if (selectedCategoryId) {
        response = await TagApi.updateTagById(selectedCategoryId, values);
      } else {
        response = await TagApi.addTag(values);
      }
      if (response) {
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
        title={
          selectedCategoryId
            ? `${t("view.camera.edit_tag")}`
            : `${t("view.camera.add_new")}`
        }
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
                  label={t("view.category.enter_key")}
                  name={["key"]}
                  rules={[
                    {
                      required: true,
                      message: `${t("view.map.required_field")}`,
                    },
                  ]}
                >
                  <Input
                    maxLength={255}
                    onBlur={(e) =>
                      form.setFieldsValue({
                        key: e.target.value.trim(),
                      })
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <div className="footer__modal">
              <Button
                onClick={() => {
                  setShowModal(false);
                }}
              >
                {t("view.camera.close")}
              </Button>
              <Button htmlType="submit">{t("view.map.button_save")}</Button>
            </div>
          </Form>
        </Spin>
      </Modal>
    </>
  );
};

export default ModalUpdateTag;
