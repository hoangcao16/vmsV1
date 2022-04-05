import React, { useState } from "react";
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
  const [email, setEmail] = useState([]); //callAPI get email
  const [emailUuid, setEmailUuid] = useState([]);
  const [message, setMessage] = useState(false);

  const [chooseEmail, setChooseEmail] = useState(true);

  const fakeEmail = [
    { emailId: "1", name: "nguyenvana@gmail.com", uuid: "1" },
    { emailId: "2", name: "nguyenvanb@gmail.com", uuid: "12" },
    { emailId: "3", name: "nguyenvanc@gmail.com", uuid: "123" },
    { emailId: "4", name: "nguyenvand@gmail.com", uuid: "1234" },
    { emailId: "5", name: "nguyenvane@gmail.com", uuid: "12345" },
    { emailId: "6", name: "nguyenvanf@gmail.com", uuid: "123456" },
    { emailId: "7", name: "nguyenvang@gmail.com", uuid: "1234567" },
    { emailId: "8", name: "nguyenvanh@gmail.com", uuid: "12345678" },
    { emailId: "9", name: "nguyenvani@gmail.com", uuid: "123456789" },
  ];

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
                      dataSource={fakeEmail}
                      // onChange={(cameraAI) => onChangeEmail(cameraAI)}
                      filterOption={filterOption}
                      options={normalizeOptions("name", "uuid", fakeEmail)}
                      placeholder="Email"
                    />
                  </Form.Item>
                  <div className="button-wrapper">
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="submit-button"
                      disabled
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
