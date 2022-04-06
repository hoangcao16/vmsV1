import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Select, Radio, Input, Popconfirm } from "antd";
import "./ExportReportToMail.scss";
import { useTranslation } from "react-i18next";
import {
  filterOption,
  normalizeOptions,
} from "../../../common/select/CustomSelect";
import { reactLocalStorage } from "reactjs-localstorage";
import ReportApi from "../../../../actions/api/report/ReportApi";
import Notification from "../../../../components/vms/notification/Notification";
import UserApi from "../../../../actions/api/user/UserApi";

const dataType = "";

export default function ExportReportToMail(props) {
  const language = reactLocalStorage.get("language");
  const { type } = props;
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [params, setParams] = useState(() => {
    // getting stored value
    const saved = localStorage.getItem("payloadDataChart");

    const initialValue = JSON.parse(saved);
    return initialValue || "";
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [allEmail, setAllEmail] = useState([]); //callAPI get email
  const [message, setMessage] = useState(false);
  const [chooseEmail, setChooseEmail] = useState(true);

  useEffect(() => {
    const data = {
      page: 1,
      size: 100000,
    };
    UserApi.getAllUser(data).then((result) => {
      setAllEmail(result.payload)
    });
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
    form.resetFields();
  };

  const onChange = (e) => {
    setChooseEmail(e.target.value);
    setMessage(false);
    form.resetFields();
  };

  const handleOk = () => {
    setIsModalVisible(false);
    setChooseEmail(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setChooseEmail(true);
  };

  const handleSubmit = async (value) => {
    confirm();
    // handleOk();
  };

  const renderHeader = (dataType) => {
    let name = `${t("view.report.sent_data")}`;
    return <div className="table__title">{name}</div>;
  };

  function confirm() {
    Modal.confirm({
      title: `${t("view.user.detail_list.confirm")}`,
      content: `${t("noti.are_you_sure_sent_data_for_this_email")}`,
      okText: `${t("view.user.detail_list.confirm")}`,
      cancelText: `${t("view.map.button_cancel")}`,
      onOk: () => {
        handleOk();
        const data = {
          ...params,
          typeChart: type,
          lang: language,
          emails: form.getFieldsValue().email.toString(),
        };
        console.log("data", data)
        ReportApi.getExportDataToMail(data).then((value) => {
          if (value.code == "1300") {
            const notifyMess = {
              type: "success",
              title: "",
              description: `${t("noti.sent_mail_successful")}`,
            };
            Notification(notifyMess);
          } else {
            const notifyMess = {
              type: "error",
              title: "",
              description: `${t("noti.fail_sent_mail")}`,
            };
            Notification(notifyMess);
          }
        });
      },
    });
  }

  return (
    <>
      <div onClick={showModal} className="button-send">
        {t("view.report.sent_data")}
      </div>
      <Modal
        title={renderHeader(dataType)}
        className="modal-custom"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose={true}
      >
        <div className="modal-custom-content">
          <div className="modal-custom-content-to">{t("view.report.to")}</div>
          <div className="modal-custom-content-wrapper">
            <Radio.Group
              onChange={onChange}
              value={chooseEmail}
              className="modal-custom-content-wrapper--radio"
            >
              <Radio value={true}>{t("view.report.in_system")}</Radio>
              <Radio value={false}>{t("view.report.leader")}</Radio>
            </Radio.Group>
            <Form form={form} onFinish={handleSubmit}>
              {chooseEmail == true ? (
                <>
                  <Form.Item
                    name={"email"}
                    label="Email"
                    rules={[
                      {
                        required: true,
                        message: `${t("view.map.required_field")}`,
                      },
                    ]}
                  >
                    <Select
                      mode="multiple"
                      allowClear={false}
                      showSearch
                      dataSource={allEmail}
                      // onChange={(cameraAI) => onChangeEmail(cameraAI)}
                      filterOption={filterOption}
                      options={normalizeOptions("email", "email", allEmail)}
                      placeholder="Email"
                      maxTagCount={3}
                    />
                  </Form.Item>
                  <div className="button-wrapper">
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="submit-button"
                    >
                      {t("view.report.sent")}
                    </Button>
                    <Button onClick={handleCancel}>
                      {t("view.camera.close")}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Form.Item
                    name={["email"]}
                    label="Email"
                    rules={[
                      {
                        required: true,
                        message: `${t("view.map.required_field")}`,
                      },
                      () => ({
                        validator(_, value) {
                          //eslint-disable-next-line
                          if (
                            !value ||
                            /^(([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5}){1,25})+([,](([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5}){1,25})+)*$/.test(
                              value
                            )
                          ) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error(`${t("view.report.email_not_valid")}`)
                          );
                        },
                      }),
                      {
                        max: 100,
                        message: `${t("noti.100_characters_limit")}`,
                      },
                    ]}
                  >
                    <Input
                      placeholder="Email"
                      autocomplete="off"
                      onBlur={(e) => {
                        form.setFieldsValue({
                          email: e.target.value.trim(),
                        });
                      }}
                    />
                  </Form.Item>
                  <div className="button-wrapper">
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="submit-button"
                      on
                    >
                      {t("view.report.sent")}
                    </Button>
                    <Button onClick={handleCancel}>
                      {t("view.camera.close")}
                    </Button>
                  </div>
                </>
              )}
            </Form>
          </div>
        </div>
      </Modal>
    </>
  );
}
