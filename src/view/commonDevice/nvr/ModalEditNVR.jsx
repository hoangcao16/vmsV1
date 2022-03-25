import { Button, Col, Form, Input, Modal, Row, Spin } from "antd";
import { isEmpty } from "lodash-es";
import React, { useEffect, useState } from "react";
import NVRApi from "../../../actions/api/nvr/NVRApi";
import Notification from "../../../components/vms/notification/Notification";
import "./ModalEditNVR.scss";
import { useTranslation } from "react-i18next";
import trimObjValues from "../../../actions/function/MyUltil/CheckDataTrim";

const { TextArea } = Input;

const formItemLayout = {
  wrapperCol: { span: 24 },
  labelCol: { span: 24 },
};

const ModalEditNVR = (props) => {
  const { t } = useTranslation();
  const { handleShowModalEdit, selectedNVRIdEdit } = props;

  const [isModalVisible, setIsModalVisible] = useState(
    !isEmpty(selectedNVRIdEdit)
  );

  const [form] = Form.useForm();

  const [selectedNVREdit, setSelectedNVREdit] = useState([]);

  useEffect(() => {
    NVRApi.getNVRByUuid(selectedNVRIdEdit).then(setSelectedNVREdit);
  }, []);

  const handleSubmit = async (value) => {
    const payload = trimObjValues(value);

    try {
      const isEdit = await NVRApi.editNVR(props.selectedNVRIdEdit, payload);

      if (isEdit) {
        const notifyMess = {
          type: "success",
          title: "",
          description: `${t("noti.successfully_edit_nvr")}`,
        };
        Notification(notifyMess);
      } else {
        const notifyMess = {
          type: "error",
          title: "",
          description:
            "Đã xảy ra lỗi trong quá trình chỉnh sửa, hãy kiểm tra lại",
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

  if (isEmpty(selectedNVREdit)) {
    return <Spin />;
  }

  console.log("a", selectedNVREdit);

  return (
    <>
      <Modal
        title={t("view.common_device.edit_nvr")}
        visible={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleShowModalEdit}
        style={{ top: 40 }}
        footer={null}
        className="modal--nvr"
        maskStyle={{ background: "rgba(51, 51, 51, 0.9)" }}
      >
        <Form
          className="bg-grey"
          form={form}
          {...formItemLayout}
          onFinish={handleSubmit}
          initialValues={selectedNVREdit}
        >
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item
                label={t("view.common_device.nvr_name")}
                name={["name"]}
                rules={[
                  {
                    required: true,
                    message: `${t("view.map.required_field")}`,
                  },
                  {
                    max: 255,
                    message: `${t("noti.255_characters_limit")}`,
                  },
                ]}
              >
                <Input
                  onBlur={(e) => {
                    form.setFieldsValue({
                      name: e.target.value.trim(),
                    });
                  }}
                  onPaste={(e) => {
                    form.setFieldsValue({
                      name: e.target.value.trimStart(),
                    });
                  }}
                ></Input>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label={t("view.common_device.note")}
                name={["note"]}
                rules={[
                  {
                    required: true,
                    message: `${t("view.map.required_field")}`,
                  },
                  {
                    max: 255,
                    message: `${t("noti.255_characters_limit")}`,
                  },
                ]}
              >
                <TextArea
                  onBlur={(e) => {
                    form.setFieldsValue({
                      note: e.target.value.trim(),
                    });
                  }}
                  onPaste={(e) => {
                    form.setFieldsValue({
                      note: e.target.value.trimStart(),
                    });
                  }}
                ></TextArea>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label={t("view.common_device.desc")}
                name={["description"]}
                rules={[
                  {
                    required: true,
                    message: `${t("view.map.required_field")}`,
                  },
                  {
                    max: 255,
                    message: `${t("noti.255_characters_limit")}`,
                  },
                ]}
              >
                <TextArea
                  onBlur={(e) => {
                    form.setFieldsValue({
                      description: e.target.value.trim(),
                    });
                  }}
                  onPaste={(e) => {
                    form.setFieldsValue({
                      description: e.target.value.trimStart(),
                    });
                  }}
                ></TextArea>
              </Form.Item>
            </Col>
          </Row>
          <Row className="row--submit">
            <div className="submit">
              <Button type="primary" htmlType="submit ">
                {t("view.user.detail_list.confirm")}
              </Button>
            </div>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default ModalEditNVR;
