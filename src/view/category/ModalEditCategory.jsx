import { Button, Col, Form, Input, Modal, Row } from "antd";
import { isEmpty } from "lodash-es";
import React, { useEffect, useState } from "react";
import CameraApi from "../../actions/api/camera/CameraApi";
import {
  default as Event,
  default as EventApi,
} from "../../actions/api/event/EventApi";
import FieldApi from "../../actions/api/field/FieldApi";
import VendorApi from "../../actions/api/vendor/VendorApi";
import Notification from "../../components/vms/notification/Notification";
import "./../commonStyle/commonAuto.scss";
import "./../commonStyle/commonForm.scss";
import "./../commonStyle/commonInput.scss";
import "./../commonStyle/commonModal.scss";
import "./../commonStyle/commonSelect.scss";
import "./ModalEditCategory.scss";
import { CATEGORY_NAME } from "./TableCategory";
import { useTranslation } from "react-i18next";

const formItemLayout = {
  wrapperCol: { span: 24 },
  labelCol: { span: 24 },
};

const ModalViewEditCategory = (props) => {
  const { t } = useTranslation();
  let { setShowModal, selectedCategoryId, dataType } = props;
  const [fieldData, setFieldData] = useState([]);
  const [name, setName] = useState("");
  const [form] = Form.useForm();
  const [selectedCategoryEdit, setSelectedCategoryEdit] = useState(null);

  useEffect(() => {
    if (selectedCategoryId !== null) {
      getCategoryByUuid(dataType, selectedCategoryId).then(async (data) => {
        setSelectedCategoryEdit(data);
      });
    }

    if (CATEGORY_NAME.CAMERA_TYPE === dataType) {
      setName(`${t("view.map.camera_type", { cam: t("camera") })}`);
    }
    if (CATEGORY_NAME.VENDOR === dataType) {
      setName(`${t("view.category.camera_vendor", { cam: t("camera") })}`);
    }
    if (CATEGORY_NAME.FIELD === dataType) {
      setName(`${t("view.category.field")}`);
    }
    if (CATEGORY_NAME.EVENT_TYPE === dataType) {
      setName(`${t("view.category.event_type")}`);
    }
  }, [selectedCategoryId]);

  const renderOptionSelectField = () => {
    return fieldData?.map((item) => {
      return (
          <option value={item.uuid}>
            {item.name.length > 40
                ? `${item.name.slice(0, 19)}...${item.name.slice(
                    item.name.length - 20,
                    item.name.length
                )}`
                : `${item.name}`}
          </option>
      )
    });
  };

  const getAllField = async (params) => {
    const data = await FieldApi.getAllFeild(params);
    setFieldData(data);
  };

  useEffect(() => {
    const params = {
      name: "",
    };
    getAllField(params);
  }, []);

  const handleSubmit = async (value) => {
    const payload = {
      ...value,
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
            type: "success",
            title: `${t("noti.success")}`,
            description: `${t("noti.successfully_edit_name")} ${name}`,
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
            type: "success",
            title: `${t("noti.success")}`,
            description: `${t("noti.successfully_add")} ${name}`,
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
    if (isEmpty(selectedCategoryEdit)) {
      return null;
    }
  }

  return (
    <>
      <Modal
        title={
          selectedCategoryId
            ? `${t("view.common_device.edit")} ${name}`
            : `${t("view.camera.add_new")}`
        }
        visible={true}
        onCancel={() => {
          setShowModal(false);
        }}
        className="modal__edit--category"
        footer={null}
        maskStyle={{ background: "rgba(51, 51, 51, 0.9)" }}
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
                name={["name"]}
                rules={[
                  {
                    required: true,
                    message: `${t("view.map.required_field")}`,
                  },
                ]}
              >
                <Input
                  maxLength={255}
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
                />
              </Form.Item>
              {dataType === CATEGORY_NAME.EVENT_TYPE ? (
                <Form.Item
                  label={t("view.category.field")}
                  name={["fieldUuid"]}
                  rules={[
                    {
                      required: true,
                      message: `${t("view.map.required_field")}`,
                    },
                  ]}
                >
                  <select>
                    <option value="" selected hidden disabled>
                      {t("view.category.choose_field_for_event")}
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
              {t("view.camera.close")}
            </Button>
            <Button htmlType="submit">{t("view.map.button_save")}</Button>
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
